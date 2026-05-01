"use client"

import { ChatMessageList } from "@/components/agent/chat-message-list"
import { ChatInputArea } from "@/components/agent/chat-input-area"
import { Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAgentStore } from "@/store/useAgentStore"
import { useUserStore } from "@/store/useUserStore"
import { Separator } from "@/components/ui/separator"
import api from "@/lib/api/client";

export default function AgentChat() {
    const { clearMessages, addMessage, messages } = useAgentStore()
    const { user } = useUserStore()

    const handleClear = () => {
        const chatId = user ? `agent-user-${user.id}` : "guest-agent";
        
        api.post("/agent/clear", { chatId })
        .then(() => {
            clearMessages()
            addMessage({
                role: "agent",
                content: "대화가 초기화되었습니다. 무엇을 도와드릴까요?",
                actionType: "none",
            })
        })
        .catch(err => {
            console.error("Failed to clear chat memory", err);
            alert("대화 초기화에 실패했습니다.");
        });
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="size-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-base font-semibold">Apex Agent</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-muted-foreground">온라인</span>
                        </div>
                    </div>
                </div>
                <Button
                    id="agent-clear-btn"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={handleClear}
                >
                    <Trash2 className="size-4" />
                </Button>
            </div>
            <Separator />

            {/* 메시지 영역 */}
            <ChatMessageList />

            {/* 입력 영역 */}
            <ChatInputArea />
        </div>
    )
}