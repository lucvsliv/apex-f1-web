"use client"

import { useAgentStore } from "@/store/useAgentStore"
import { ChatMessageList } from "@/components/agent/chat-message-list"
import { ChatInputArea } from "@/components/agent/chat-input-area"
import { Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function AgentChatSheet() {
    const { isOpen, setOpen, clearMessages, addMessage } = useAgentStore()

    const handleClear = () => {
        clearMessages()
        addMessage({
            role: "agent",
            content: "대화가 초기화되었습니다. 무엇을 도와드릴까요?",
            actionType: "none",
        })
    }

    return (
        <div
            className={cn(
                "fixed bottom-24 right-6 z-50",
                "w-[400px] h-[600px]",
                "bg-background border border-stone-200 rounded-2xl shadow-2xl shadow-black/10",
                "flex flex-col overflow-hidden",
                "transition-all duration-300 ease-out origin-bottom-right",
                isOpen
                    ? "scale-100 opacity-100 translate-y-0 pointer-events-auto"
                    : "scale-95 opacity-0 translate-y-4 pointer-events-none"
            )}
        >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="size-4 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold">Apex Agent</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-muted-foreground">온라인</span>
                        </div>
                    </div>
                </div>
                <Button
                    id="agent-sheet-clear-btn"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={handleClear}
                >
                    <Trash2 className="size-3.5" />
                </Button>
            </div>
            <Separator className="bg-stone-200" />

            {/* 메시지 영역 */}
            <ChatMessageList />

            {/* 입력 영역 */}
            <ChatInputArea />
        </div>
    )
}
