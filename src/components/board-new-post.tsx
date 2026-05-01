"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, X } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import api from "@/lib/api/client";
import { toast } from "sonner";

export default function BoardNewPost() {
    const router = useRouter();
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);
            await api.post("/posts", {
                title,
                content
            });
            toast.success("게시글이 성공적으로 등록되었습니다.");
            router.push("/dashboard/community");
            router.refresh();
        } catch (error) {
            console.error("게시글 등록 실패:", error);
            toast.error("게시글 등록에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <BreadcrumbLink href="/dashboard/community/new" className="text-sm text-stone-900">New Post</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="w-full pt-5 px-6 sm:pb-5 pb-5 sm:pb-15">
                <div className="max-w-4xl mx-auto">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4 text-stone-500 hover:text-stone-900">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Board
                    </Button>

                <div className="mb-8 border-b border-stone-200 pb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">Create New Post</h1>
                    <p className="text-stone-500 mt-2">Share your thoughts, feedback, or start a discussion with the Apex-F1 community.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-stone-700 font-semibold">Category</Label>
                            <Select defaultValue="Discussion">
                                <SelectTrigger id="category" className="w-full sm:w-[200px] bg-white border-stone-200">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Discussion">Discussion</SelectItem>
                                    <SelectItem value="Feedback">Feedback</SelectItem>
                                    <SelectItem value="Guide">Guide</SelectItem>
                                    <SelectItem value="Announcement">Announcement</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-stone-700 font-semibold">Title</Label>
                            <Input 
                                id="title" 
                                placeholder="Enter a descriptive title for your post" 
                                className="bg-white border-stone-200"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content" className="text-stone-700 font-semibold">Content</Label>
                            <Textarea 
                                id="content" 
                                placeholder="Write your post content here..." 
                                className="min-h-[300px] bg-white border-stone-200 resize-y"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-stone-200">
                        <Button type="button" variant="outline" onClick={() => router.back()} className="border-stone-200 text-stone-600">
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-stone-900 text-white hover:bg-stone-800" disabled={isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting ? "Publishing..." : "Publish Post"}
                        </Button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}
