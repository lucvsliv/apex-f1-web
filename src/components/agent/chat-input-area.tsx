"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useAgentStore } from "@/store/useAgentStore"
import { useProductStore } from "@/store/useProductStore"
import { useUserStore } from "@/store/useUserStore"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import api from "@/lib/api/client";

export function ChatInputArea() {
    const [input, setInput] = useState("")
    const { addMessage, setTyping } = useAgentStore()
    const { user } = useUserStore()
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSend = useCallback(() => {
        const trimmed = input.trim()
        if (!trimmed) return

        // 1. 사용자 메시지 추가
        addMessage({
            role: "user",
            content: trimmed,
            actionType: "none",
        })

        setInput("")

        // Textarea 높이 리셋
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
        }

        // 2. 에이전트 실제 API 호출
        setTyping(true)
        api.post("/agent/chat", {
            message: trimmed,
            chatId: user ? `agent-user-${user.id}` : "guest-agent"
        })
        .then(response => {
            const data = response.data;
            let text = data.response || "";
            
            // 패턴 파싱 (예: :::post_draft {...} :::)
            const postDraftMatch = text.match(/:::post_draft\s+({.*?})\s+:::/);
            const storeActionMatch = text.match(/:::store_action\s+({.*?})\s+:::/);
            
            if (postDraftMatch) {
                try {
                    const payload = JSON.parse(postDraftMatch[1]);
                    const cleanText = text.replace(postDraftMatch[0], "").trim();
                    addMessage({
                        role: "agent",
                        content: cleanText || "게시글 초안을 작성했습니다.",
                        actionType: "post_action",
                        actionPayload: payload
                    });
                    return;
                } catch (e) { console.error("JSON parse error", e); }
            }
            
            if (storeActionMatch) {
                try {
                    const payload = JSON.parse(storeActionMatch[1]);
                    const cleanText = text.replace(storeActionMatch[0], "").trim();
                    addMessage({
                        role: "agent",
                        content: cleanText || "추천 상품을 찾았습니다.",
                        actionType: "store_action",
                        actionPayload: payload
                    });
                    return;
                } catch (e) { console.error("JSON parse error", e); }
            }

            // [ACTION_TOSS_PAYMENT:TIER] 패턴 파싱
            const tossPaymentMatch = text.match(/\[ACTION_TOSS_PAYMENT:(.*?)\]/);
            if (tossPaymentMatch) {
                const tier = tossPaymentMatch[1];
                const cleanText = text.replace(tossPaymentMatch[0], "").trim();
                addMessage({
                    role: "agent",
                    content: cleanText || `${tier} 멤버십 결제를 진행해주세요.`,
                    actionType: "toss_payment",
                    actionPayload: { tier }
                });
                return;
            }
            
            addMessage({
                role: "agent",
                content: text,
                actionType: "none",
            });
        })
        .catch(error => {
            console.error("Agent API error:", error);
            addMessage({
                role: "agent",
                content: "죄송합니다. 서비스 연결에 문제가 발생했습니다.",
                actionType: "none",
            });
        })
        .finally(() => {
            setTyping(false)
        });
    }, [input, addMessage, setTyping])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.nativeEvent.isComposing) return
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // 자동 리사이즈
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
        const el = e.target
        el.style.height = "auto"
        el.style.height = Math.min(el.scrollHeight, 120) + "px"
    }

    return (
        <div className="border-t border-stone-200 bg-background p-4">
            <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Apex Agent에게 메시지 보내기..."
                        rows={1}
                        className={cn(
                            "w-full resize-none rounded-xl border border-stone-200 bg-muted/50 px-4 py-3 pr-12 text-sm",
                            "placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                            "transition-all duration-200",
                            "max-h-[120px] min-h-[44px]"
                        )}
                    />
                </div>
                <Button
                    id="agent-send-btn"
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={cn(
                        "shrink-0 rounded-xl size-[44px] transition-all duration-200",
                        input.trim()
                            ? "bg-primary hover:bg-primary/90 shadow-md"
                            : "bg-muted text-muted-foreground"
                    )}
                >
                    <Send className="size-4" />
                </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
                Apex Agent는 실수할 수 있습니다. 중요한 작업은 반드시 확인해주세요.
            </p>
        </div>
    )
}
