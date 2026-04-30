"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserCircle, Clock, Eye } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const MOCK_POSTS = [
  {
    id: "1",
    title: "Welcome to the new board!",
    author: "Admin",
    date: "2024-04-30",
    views: 128,
    category: "Announcement",
    content: "Welcome to the new Apex-F1 community board! We're excited to have you here. \n\nFeel free to discuss anything related to Formula 1, our app features, or general motorsport topics. Please be respectful to others and follow the community guidelines."
  },
  {
    id: "2",
    title: "How to use the new AI Agent feature",
    author: "John Doe",
    date: "2024-04-29",
    views: 256,
    category: "Guide",
    content: "The new AI Agent is now live! To use it, simply navigate to the Agent section in the sidebar.\n\nYou can ask it anything about Formula 1 history, stats, or current standings. It uses real-time data to give you the most accurate answers."
  },
  {
    id: "3",
    title: "Feedback on the latest race schedule",
    author: "Jane Smith",
    date: "2024-04-28",
    views: 512,
    category: "Feedback",
    content: "I really like how the new schedule view is organized. The cards are clean and easy to read. \n\nHowever, it would be great if we could add our own local timezone instead of just track time. What do you guys think?"
  },
  {
    id: "4",
    title: "Let's discuss the Miami Grand Prix",
    author: "Peter Pan",
    date: "2024-04-27",
    views: 1024,
    category: "Discussion",
    content: "The upcoming Miami Grand Prix is looking to be an exciting one.\n\nWith the recent upgrades from McLaren and Ferrari, do you think Red Bull will still dominate? Let's discuss our predictions!"
  },
];

export default function BoardPost() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    
    const post = MOCK_POSTS.find((p) => p.id.toString() === id) || MOCK_POSTS[0];

    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb className="mx-7 mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-sm">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/community" className="text-sm">Community</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/dashboard/community/${id}`} className="text-sm text-stone-900 truncate max-w-[150px] sm:max-w-[300px] inline-block">{post.title}</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="w-full pt-5 px-6 sm:pb-5 pb-5 sm:pb-15">
                <div className="max-w-5xl mx-auto">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4 text-stone-500 hover:text-stone-900">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Board
                    </Button>

                {/* Post Header */}
                <div className="border-b border-stone-200 pb-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary" className="bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200">{post.category}</Badge>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-stone-900 leading-tight">{post.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-stone-500">
                        <div className="flex items-center gap-2">
                            <UserCircle className="h-4 w-4" />
                            <span className="font-medium text-stone-700">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{post.views} views</span>
                        </div>
                    </div>
                </div>

                {/* Post Content */}
                <div className="min-h-[300px]">
                    <p className="text-stone-800 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                        {post.content}
                    </p>
                </div>

                {/* Post Actions */}
                <div className="mt-12 pt-6 border-t border-stone-200 flex justify-end items-center gap-3">
                    <Button variant="outline" className="border-stone-200 text-stone-600">Share</Button>
                    <Button>Reply</Button>
                </div>
                </div>
            </div>
        </div>
    );
}
