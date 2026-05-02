"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAgentStore, type ChatMessage } from "@/store/useAgentStore"
import { Sparkles, User, Loader2 } from "lucide-react"
import { PostDraftCard } from "@/components/agent/cards/post-draft-card"
import { ProductCheckoutCard } from "@/components/agent/cards/product-checkout-card"
import { TossPaymentButton } from "@/components/chat/toss-payment-button"
import { useUserStore } from "@/store/useUserStore"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

function ChatBubble({ message }: { message: ChatMessage }) {
    const isAgent = message.role === "agent"
    const { user } = useUserStore()

    // Action Card 렌더링
    if (message.actionType === "post_action" && message.actionPayload) {
        return (
            <div className="flex gap-3 justify-start">
                <AgentAvatar />
                <div className="max-w-[85%]">
                    <p className="text-xs text-muted-foreground mb-1.5">Apex Agent</p>
                    <PostDraftCard payload={message.actionPayload} />
                </div>
            </div>
        )
    }

    if (message.actionType === "store_action" && message.actionPayload) {
        return (
            <div className="flex gap-3 justify-start">
                <AgentAvatar />
                <div className="max-w-[85%]">
                    <p className="text-xs text-muted-foreground mb-1.5">Apex Agent</p>
                    <ProductCheckoutCard payload={message.actionPayload} />
                </div>
            </div>
        )
    }

    if (message.actionType === "toss_payment" && message.actionPayload) {
        return (
            <div className="flex gap-3 justify-start">
                <AgentAvatar />
                <div className="max-w-[85%]">
                    <p className="text-xs text-muted-foreground mb-1.5">Apex Agent</p>
                    {message.content && (
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed mb-2">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}
                                components={{
                                    p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                    <TossPaymentButton tier={message.actionPayload.tier} userEmail={user?.email || ""} />
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex gap-3", isAgent ? "justify-start" : "justify-end")}>
            {isAgent && <AgentAvatar />}
            <div className={cn("max-w-[80%] flex flex-col", isAgent ? "items-start" : "items-end")}>
                {isAgent && (
                    <p className="text-xs text-muted-foreground mb-1.5">Apex Agent</p>
                )}
                <div
                    className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        isAgent
                            ? "bg-muted text-foreground rounded-tl-sm"
                            : "bg-primary text-primary-foreground rounded-tr-sm whitespace-pre-wrap"
                    )}
                >
                    {isAgent ? (
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]} 
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                ul: ({ ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                                ol: ({ ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                                a: ({ ...props }) => <a className="text-primary underline underline-offset-4" {...props} />,
                                code: ({ ...props }) => <code className="bg-black/5 px-1 rounded text-xs font-mono" {...props} />,
                            }}
                        >
                            {message.content.replace(/\n/g, "  \n")}
                        </ReactMarkdown>
                    ) : (
                        message.content
                    )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 px-1" suppressHydrationWarning>
                    {new Date(message.timestamp).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
            {!isAgent && <UserAvatar />}
        </div>
    )
}

function AgentAvatar() {
    return (
        <Avatar className="size-8 border border-primary/20 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary">
                <Sparkles className="size-4" />
            </AvatarFallback>
        </Avatar>
    )
}

function UserAvatar() {
    return (
        <Avatar className="size-8 border shrink-0">
            <AvatarFallback className="bg-secondary">
                <User className="size-4" />
            </AvatarFallback>
        </Avatar>
    )
}

function TypingIndicator() {
    return (
        <div className="flex gap-3 justify-start">
            <AgentAvatar />
            <div className="flex flex-col items-start">
                <p className="text-xs text-muted-foreground mb-1.5">Apex Agent</p>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">생각하고 있어요...</span>
                </div>
            </div>
        </div>
    )
}

export function ChatMessageList() {
    const { messages, isTyping } = useAgentStore()
    const scrollRef = useRef<HTMLDivElement>(null)

    // 새 메시지가 추가되면 자동으로 맨 아래로 스크롤
    useEffect(() => {
        if (scrollRef.current) {
            const viewport = scrollRef.current.querySelector("[data-slot='scroll-area-viewport']")
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight
            }
        }
    }, [messages, isTyping])

    return (
        <ScrollArea ref={scrollRef} className="flex-1 min-h-0 overflow-hidden px-4">
            <div className="flex flex-col gap-5 py-4">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
            </div>
        </ScrollArea>
    )
}
