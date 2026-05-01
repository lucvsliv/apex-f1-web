"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, UserCircle, Clock, Eye, Trash2, Pencil } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";

import api from "@/lib/api/client";
import { Post } from "@/types/post";

export default function BoardPost() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const { user } = useUserStore();
    const [post, setPost] = React.useState<Post | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState("");
    const [editContent, setEditContent] = React.useState("");

    const toggleEdit = () => {
        if (!post) return;
        if (!isEditMode) {
            setEditTitle(post.title);
            setEditContent(post.content);
        }
        setIsEditMode(!isEditMode);
    };

    const handleUpdate = async () => {
        if (!id || !editTitle.trim() || !editContent.trim()) return;

        try {
            setIsUpdating(true);
            await api.put(`/posts/${id}`, {
                title: editTitle,
                content: editContent
            });
            toast.success("게시글이 수정되었습니다.");
            setPost(prev => prev ? { ...prev, title: editTitle, content: editContent } : null);
            setIsEditMode(false);
        } catch (error) {
            console.error("게시글 수정 실패:", error);
            toast.error("게시글 수정에 실패했습니다.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!post) return;

        try {
            setIsDeleting(true);
            await api.delete(`/posts/${id}`);
            toast.success("게시글이 삭제되었습니다.");
            router.push("/dashboard/community");
        } catch (error) {
            console.error("게시글 삭제 실패:", error);
            toast.error("게시글 삭제에 실패했습니다.");
        } finally {
            setIsDeleting(false);
        }
    };

    React.useEffect(() => {
        if (!id) return;

        const fetchPost = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error("게시글을 불러오는데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-stone-500">게시글을 불러오는 중입니다...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-stone-500">게시글을 찾을 수 없습니다.</p>
                <Button onClick={() => router.push("/dashboard/community")}>Back to Board</Button>
            </div>
        );
    }

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
                            <Badge variant="secondary" className="bg-stone-100 text-stone-700 border border-stone-200 hover:bg-stone-200">{post.category || "General"}</Badge>
                        </div>
                        {isEditMode ? (
                            <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="text-2xl sm:text-3xl font-bold mb-6 text-stone-900 border-stone-200 h-auto py-2 focus-visible:ring-stone-200"
                                placeholder="제목을 입력하세요"
                            />
                        ) : (
                            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-stone-900 leading-tight">{post.title}</h1>
                        )}

                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-stone-500">
                            <div className="flex items-center gap-2">
                                <Avatar className="size-5">
                                    <AvatarImage src={post.authorProfileImageUrl} />
                                    <AvatarFallback className="text-[10px]">CN</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-stone-700">{post.authorNickname || `User ${post.authorId}`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>{post.views || 0} 조회</span>
                            </div>

                            {/* Edit/Delete Buttons - Only for Author */}
                            {user?.id === post.authorId && !isEditMode && (
                                <div className="ml-auto flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-stone-500 hover:text-stone-700 hover:bg-stone-50 h-8 gap-1.5 px-2"
                                        onClick={toggleEdit}
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        <span>수정</span>
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 gap-1.5 px-2"
                                                disabled={isDeleting}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                <span>삭제</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] bg-white border-stone-200">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl font-bold text-stone-900">게시글 삭제</DialogTitle>
                                                <DialogDescription className="text-stone-500">
                                                    정말로 이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="gap-3">
                                                <DialogClose asChild>
                                                    <Button variant="outline" className="border-stone-200">취소</Button>
                                                </DialogClose>
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleDelete}
                                                    disabled={isDeleting}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    {isDeleting ? "삭제 중..." : "삭제하기"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Post Content */}
                    <div className="min-h-[300px] mb-8">
                        {isEditMode ? (
                            <div className="space-y-4">
                                <Textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="min-h-[300px] text-sm sm:text-base border-stone-200 focus-visible:ring-stone-200"
                                    placeholder="내용을 입력하세요"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={toggleEdit} disabled={isUpdating} className="border-stone-200">취소</Button>
                                    <Button onClick={handleUpdate} disabled={isUpdating || !editTitle.trim() || !editContent.trim()}>
                                        {isUpdating ? "저장 중..." : "수정 완료"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-stone-800 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                                {post.content}
                            </p>
                        )}
                    </div>

                    {/* Post Actions */}
                    {!isEditMode && (
                        <div className="mt-12 pt-6 border-t border-stone-200 flex justify-end items-center gap-3">
                            <Button variant="outline" className="border-stone-200 text-stone-600">Share</Button>
                            <Button>Reply</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

