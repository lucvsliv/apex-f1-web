"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, User, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAgentStore, type ChatMessage } from "@/store/useAgentStore"
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
                    <p className="text-xs text-muted-foreground mb-1.5">FoFo</p>
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
                    <p className="text-xs text-muted-foreground mb-1.5">FoFo</p>
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
                    <p className="text-xs text-muted-foreground mb-1.5">FoFo</p>
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
                <p className="text-xs text-muted-foreground mb-1.5">
                    {isAgent ? "FoFo" : (user?.nickname || "Guest")}
                </p>
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
                                table: ({ ...props }) => (
                                    <div className="overflow-x-auto my-2 border border-stone-200 rounded-lg">
                                        <table className="w-full text-xs border-collapse" {...props} />
                                    </div>
                                ),
                                th: ({ ...props }) => <th className="px-2 py-1 border-b border-stone-200 font-semibold text-left bg-stone-50" {...props} />,
                                td: ({ ...props }) => <td className="px-2 py-1 border-b border-stone-100" {...props} />,
                            }}
                        >
                            {message.content}
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
        <Avatar className="size-9 border-0 bg-transparent shrink-0 overflow-visible">
            <svg width="0" height="0" className="absolute">
                <defs>
                    <linearGradient id="fofo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="10%" stopColor="#3b82f6" />
                        <stop offset="70%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                </defs>
            </svg>
            <AvatarFallback className="bg-transparent">
                <Sparkles 
                    className="size-5" 
                    style={{ stroke: "url(#fofo-gradient)" }} 
                />
            </AvatarFallback>
        </Avatar>
    )
}

function UserAvatar() {
    const { user } = useUserStore()
    const fallbackInitials = (user?.nickname || "Guest").substring(0, 2).toUpperCase()
    
    return (
        <Avatar className="size-9 border-0 shrink-0">
            <AvatarImage src={user?.profileImageUrl || "https://bundui-images.netlify.app/avatars/08.png"} />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px]">
                {fallbackInitials}
            </AvatarFallback>
        </Avatar>
    )
}

function TypingIndicator() {
    return (
        <div className="flex gap-3 justify-start">
            <AgentAvatar />
            <div className="flex flex-col items-start">
                <p className="text-xs text-muted-foreground mb-1.5">FoFo</p>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">FoFo가 요청을 처리 중이에요...</span>
                </div>
            </div>
        </div>
    )
}

export function ChatMessageList() {
    const { messages, isTyping } = useAgentStore()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    return (
        <ScrollArea className="flex-1 min-h-0 overflow-hidden px-4">
            <div className="flex flex-col gap-5 py-4">
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} message={msg} />
                ))}
                {isTyping && (messages.length === 0 || messages[messages.length - 1].role !== "agent") && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
    )
}
