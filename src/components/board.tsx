"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as React from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api/client";
import { Post } from "@/types/post";

export default function Board() {
  const router = useRouter();
  const [category, setCategory] = React.useState("All");
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("게시글을 불러오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 백엔드에서 카테고리 필드를 제공하지 않으므로, 임시로 필터링 로직은 비활성화하거나 
  // 백엔드 데이터에 맞춰 조정이 필요합니다. 일단은 모든 글을 보여줍니다.
  const filteredPosts = category === "All" ? posts : posts.filter((p) => p.category === category);

  return (
    <div>
      <Breadcrumb className="mx-7 mt-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/community">Community</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {mounted && (
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="text-sm h-8 border-stone-200 bg-white shadow-sm font-medium focus:ring-0">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="border-stone-200 bg-white">
                  <SelectItem value="All">All Boards</SelectItem>
                  <SelectItem value="Discussion">Discussion</SelectItem>
                  <SelectItem value="Feedback">Feedback</SelectItem>
                  <SelectItem value="Guide">Guide</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="text-left px-8 sm:pb-5 pt-10 sm:pt-15 pb-10 flex justify-between items-center">
        <h1 className="text-4xl font-bold">{category === "All" ? "Community Board" : `${category} Board`}</h1>
        <Button onClick={() => router.push("/dashboard/community/new")}>New Post</Button>
      </div>
      <div className="w-full pt-5 px-6 sm:pb-5 pb-5 sm:pb-15">
        <div className="border border-stone-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-stone-200">
                <TableHead className="w-[80px] hidden sm:table-cell text-center">번호</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-[150px] hidden sm:table-cell">작성자</TableHead>
                <TableHead className="w-[150px] hidden sm:table-cell">작성일</TableHead>
                <TableHead className="w-[100px] text-right hidden sm:table-cell">조회수</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    게시글을 불러오는 중입니다...
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    등록된 게시글이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow
                    key={post.id}
                    className="border-t border-stone-200 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/dashboard/community/${post.id}`)}
                  >
                    <TableCell className="hidden sm:table-cell text-center text-muted-foreground">{post.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div>
                          <span className="text-sm text-muted-foreground">{post.title}</span>
                          {post.category && (
                            <Badge variant="outline" className="ml-2 hidden sm:inline-flex border-stone-200 text-[10px] font-normal">{post.category}</Badge>
                          )}
                        </div>
                        <div className="flex items-center text-[11px] text-muted-foreground sm:hidden gap-1.5 mt-1">
                          <span>{post.category || "General"}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Avatar className="size-3.5">
                              <AvatarImage src={post.authorProfileImageUrl} />
                              <AvatarFallback className="text-[8px]">CN</AvatarFallback>
                            </Avatar>
                            <span>{post.authorNickname}</span>
                          </div>
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5">
                          <AvatarImage src={post.authorProfileImageUrl} />
                          <AvatarFallback className="text-[10px]">CN</AvatarFallback>
                        </Avatar>
                        <span>{post.authorNickname}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right hidden sm:table-cell text-muted-foreground">{post.views || 0}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

