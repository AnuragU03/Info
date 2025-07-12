
'use client';

import { getVillageById } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { PostCreator } from '@/components/post-creator';
import { useEffect, useState } from 'react';
import type { Village, CommunityPost } from '@/lib/mock-data';
import { Loader2 } from 'lucide-react';

type CommunityPageProps = {
    params: {
        id: string;
    };
};

export default function CommunityPage({ params }: CommunityPageProps) {
    const villageId = params.id;
    const [village, setVillage] = useState<Village | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVillage = async () => {
            setLoading(true);
            const villageData = await getVillageById(villageId);
            setVillage(villageData || null);
            setLoading(false);
        };
        fetchVillage();
    }, [villageId]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">Loading community...</p>
            </div>
        );
    }
    
    if (!village) {
        return (
             <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold">Village not found</h1>
                <p className="text-muted-foreground">The community you are looking for does not exist.</p>
            </div>
        )
    }

    // Sort posts to show newest first
    const sortedPosts = village.communityPosts ? [...village.communityPosts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];

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

                <PostCreator villageId={villageId} villageName={village.name} />

                <div className="space-y-6 mt-8">
                    {sortedPosts && sortedPosts.length > 0 ? (
                        sortedPosts.map((post) => (
                            <Card key={post.id} className="p-4">
                                <div className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarImage src={post.avatarUrl} alt={post.author} data-ai-hint="person portrait" />
                                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2">
                                            <p className="font-semibold text-foreground">{post.author}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(post.timestamp).toLocaleString()}</p>
                                        </div>
                                        <p className="text-foreground/90 mt-1 whitespace-pre-wrap">{post.message}</p>
                                        {post.imageUrl && (
                                            <Image src={post.imageUrl} alt="Community post image" width={400} height={300} className="mt-2 rounded-lg object-cover" data-ai-hint="community photo" />
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
