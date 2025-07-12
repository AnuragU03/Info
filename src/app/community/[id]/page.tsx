

'use client';

import { getVillageById } from '@/lib/mock-data';
import { notFound, useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { addCommunityPost } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';

export default function CommunityPage() {
  const params = useParams();
  const villageId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Use state to manage village data, which is now fetched asynchronously
  const [village, setVillage] = useState<Awaited<ReturnType<typeof getVillageById>>>(undefined);

  const { toast } = useToast();
  const { userRole } = useAuth();
  const [message, setMessage] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  useEffect(() => {
    const fetchVillage = async () => {
        const villageData = await getVillageById(villageId);
        setVillage(villageData);
    };
    fetchVillage();
  }, [villageId]);


  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!village) {
    // Show a loading state or a skeleton while data is being fetched
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        </div>
    );
  }
  
  const handlePost = async () => {
    if (!message.trim()) {
        toast({
            variant: 'destructive',
            title: "Message can't be empty",
            description: "Please write something to post.",
        });
        return;
    }

    if (!userRole) {
        toast({
            variant: 'destructive',
            title: "Authentication required",
            description: "You must be logged in to post.",
        });
        return;
    }
    
    setIsPosting(true);
    
    const postData = {
        author: userRole === 'owner' ? 'Village Owner' : 'Admin User',
        avatarUrl: 'https://placehold.co/100x100.png',
        message: message,
    };
    
    const result = await addCommunityPost(villageId, postData);
    
    if (result.success) {
        toast({
            title: "Post successful!",
            description: "Your message has been added to the community board.",
        });
        setMessage('');
        // Refetch village data to show new post
        const updatedVillageData = await getVillageById(villageId);
        setVillage(updatedVillageData);
    } else {
        toast({
            variant: 'destructive',
            title: "Failed to post",
            description: result.error || "An unknown error occurred.",
        });
    }

    setIsPosting(false);
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            {village.name} Community
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            What's happening in {village.location}?
          </p>
        </div>

        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Join the conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea 
                    placeholder={`Share an update or ask a question in ${village.name}...`} 
                    className="min-h-[100px]" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isPosting}
                />
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={() => console.log('Image selected')} />
                         <Button variant="outline" size="icon" onClick={() => imageInputRef.current?.click()} disabled={isPosting}>
                             <ImageIcon className="h-5 w-5" />
                             <span className="sr-only">Add Image</span>
                         </Button>
                         <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={() => console.log('Video selected')} />
                         <Button variant="outline" size="icon" onClick={() => videoInputRef.current?.click()} disabled={isPosting}>
                             <Video className="h-5 w-5" />
                             <span className="sr-only">Add Video</span>
                         </Button>
                    </div>
                    <Button onClick={handlePost} disabled={isPosting || !message.trim()}>
                        {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Post Message
                    </Button>
                </div>
            </CardContent>
        </Card>


        <div className="space-y-6">
          {village.communityPosts && village.communityPosts.length > 0 ? (
            village.communityPosts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={post.avatarUrl} alt={post.author} data-ai-hint="person portrait" />
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="font-semibold text-foreground">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                    <p className="text-foreground/90 mt-1 whitespace-pre-wrap">{post.message}</p>
                    {post.imageUrl && (
                        <Image src={post.imageUrl} alt="Community post image" width={400} height={300} className="mt-2 rounded-lg object-cover" data-ai-hint="community photo"/>
                    )}
                    {post.videoUrl && (
                        <video src={post.videoUrl} controls className="mt-2 rounded-lg w-full" />
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
                <p>No posts yet in the {village.name} community.</p>
                <p>Be the first to share something!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
