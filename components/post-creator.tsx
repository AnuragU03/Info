
'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { addCommunityPost } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send, Image as ImageIcon, Video, Loader2 } from 'lucide-react';

type PostCreatorProps = {
    villageId: string;
    villageName: string;
};

export function PostCreator({ villageId, villageName }: PostCreatorProps) {
    const { toast } = useToast();
    const { userRole } = useAuth();
    const [message, setMessage] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

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
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Join the conversation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder={`Share an update or ask a question in ${villageName}...`}
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
    );
}
