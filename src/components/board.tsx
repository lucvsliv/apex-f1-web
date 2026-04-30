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
import * as React from "react";
import { useRouter } from "next/navigation";

const posts = [
  {
    id: 1,
    title: "Welcome to the new board!",
    author: "Admin",
    date: "2024-04-30",
    views: 128,
    category: "Announcement",
  },
  {
    id: 2,
    title: "How to use the new AI Agent feature",
    author: "John Doe",
    date: "2024-04-29",
    views: 256,
    category: "Guide",
  },
  {
    id: 3,
    title: "Feedback on the latest race schedule",
    author: "Jane Smith",
    date: "2024-04-28",
    views: 512,
    category: "Feedback",
  },
  {
    id: 4,
    title: "Let's discuss the Miami Grand Prix",
    author: "Peter Pan",
    date: "2024-04-27",
    views: 1024,
    category: "Discussion",
  },
];

export default function Board() {
  const router = useRouter();
  const [category, setCategory] = React.useState("All");

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
                <TableHead className="w-[80px] hidden sm:table-cell">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[150px] hidden sm:table-cell">Author</TableHead>
                <TableHead className="w-[150px] hidden sm:table-cell">Date</TableHead>
                <TableHead className="w-[100px] text-right hidden sm:table-cell">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow
                  key={post.id}
                  className="border-t border-stone-200 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => router.push(`/dashboard/community/${post.id}`)}
                >
                  <TableCell className="font-medium hidden sm:table-cell">{post.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div>
                        <span className="font-medium text-sm sm:text-base">{post.title}</span>
                        <Badge variant="outline" className="ml-2 hidden sm:inline-flex border-stone-200">{post.category}</Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground sm:hidden gap-1.5 mt-1">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{post.author}</TableCell>
                  <TableCell className="hidden sm:table-cell">{post.date}</TableCell>
                  <TableCell className="text-right hidden sm:table-cell">{post.views}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
