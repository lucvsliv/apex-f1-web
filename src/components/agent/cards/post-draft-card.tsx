"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Pencil, Send, CheckCircle2, Loader2 } from "lucide-react"
import api from "@/lib/api/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PostDraftPayload {
    title: string
    content: string
    category: string
}

export function PostDraftCard({ payload }: { payload: PostDraftPayload }) {
    const router = useRouter()
    const [status, setStatus] = useState<"draft" | "submitting" | "submitted">("draft")

    const handleSubmit = async () => {
        try {
            setStatus("submitting")
            await api.post("/posts", {
                title: payload.title,
                content: payload.content
            })
            setStatus("submitted")
            toast.success("게시글이 성공적으로 등록되었습니다.")
            router.refresh()
        } catch (error) {
            console.error("게시글 등록 실패:", error)
            setStatus("draft")
            toast.error("게시글 등록에 실패했습니다.")
        }
    }

    return (
        <Card className="w-full max-w-sm border-stone-200 shadow-none">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FileText className="size-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold">게시글 작성 요청</p>
                        <Badge variant="secondary" className="text-[10px] mt-0.5">
                            {payload.category}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <div className="space-y-2">
                    <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">제목</p>
                        <p className="text-sm font-medium mt-0.5">{payload.title}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">본문 미리보기</p>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-3">{payload.content}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                {status === "draft" && (
                    <>
                        <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => {}}>
                            <Pencil className="size-3" />
                            수정
                        </Button>
                        <Button size="sm" className="flex-1 gap-1.5" onClick={handleSubmit}>
                            <Send className="size-3" />
                            등록
                        </Button>
                    </>
                )}
                {status === "submitting" && (
                    <Button size="sm" disabled className="w-full gap-1.5">
                        <Loader2 className="size-3 animate-spin" />
                        등록 중...
                    </Button>
                )}
                {status === "submitted" && (
                    <Button size="sm" variant="outline" disabled className="w-full gap-1.5 text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                        <CheckCircle2 className="size-3" />
                        등록 완료!
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
