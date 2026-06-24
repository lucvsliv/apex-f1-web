"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAgentStore, ChatMessage } from "@/store/useAgentStore"
import { useProductStore } from "@/store/useProductStore"
import { useUserStore } from "@/store/useUserStore"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import api from "@/lib/api/client";

export function ChatInputArea() {
    const [input, setInput] = useState("")
    const { addMessage, updateMessageContent, updateMessage, setTyping } = useAgentStore()
    const { user, fetchUser } = useUserStore()
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // 컴포넌트 마운트 시 유저 정보가 없으면 가져오기 시도
    useEffect(() => {
        if (!user && typeof window !== "undefined" && localStorage.getItem("apex_access_token")) {
            fetchUser();
        }
    }, [user, fetchUser]);

    const handleSend = useCallback(async () => {
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

        // 2. 에이전트 스트리밍 호출 시작
        setTyping(true)

        // 빈 에이전트 메시지 미리 생성
        const agentMsgId = addMessage({
            role: "agent",
            content: "",
            actionType: "none",
        })

        const chatId = user ? `agent-user-${user.id}` : "guest-agent"
        const token = typeof window !== "undefined" ? localStorage.getItem("apex_access_token") : null
        console.log("[DEBUG] Sending chat request. Token exists:", !!token, "chatId:", chatId);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
            const response = await fetch(`${baseUrl}/agent/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    message: trimmed,
                    chatId: chatId,
                    agentId: "fofo"
                }),
            });

            if (!response.ok) throw new Error("Network response was not ok");
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullText = "";
            let leftover = "";
            let isFirstChunk = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const currentData = leftover + chunk;
                const lines = currentData.split("\n");
                
                leftover = lines.pop() || "";

                for (const line of lines) {
                    if (!line.startsWith("data:")) continue;

                    const content = line.substring(5);
                    const finalChunk = content === "" ? "\n" : content;

                    if (finalChunk) {
                        if (isFirstChunk && finalChunk.trim() !== "") {
                            setTyping(false); 
                            isFirstChunk = false;
                            updateMessage(agentMsgId, { content: finalChunk });
                            fullText += finalChunk;
                        } else if (!isFirstChunk) {
                            fullText += finalChunk;
                            updateMessageContent(agentMsgId, finalChunk);
                        }
                    }
                }
            }
            
            // 마지막 남은 조각 처리
            if (leftover && leftover.startsWith("data:")) {
                const contentToAdd = leftover.substring(5) === "" ? "\n" : leftover.substring(5);
                
                if (contentToAdd) {
                    if (isFirstChunk) {
                        setTyping(false);
                        isFirstChunk = false;
                        updateMessage(agentMsgId, { content: contentToAdd });
                        fullText += contentToAdd;
                    } else {
                        fullText += contentToAdd;
                        updateMessageContent(agentMsgId, contentToAdd);
                    }
                }
            }

            // 3. 스트리밍 완료 후 패턴 파싱 및 액션 적용
            let finalUpdate: Partial<ChatMessage> = { content: fullText };

            const postDraftMatch = fullText.match(/:::post_draft\s+({.*?})\s+:::/);
            const storeActionMatch = fullText.match(/:::store_action\s+({.*?})\s+:::/);
            const tossPaymentMatch = fullText.match(/\[ACTION_TOSS_PAYMENT:(.*?)\]/);

            if (postDraftMatch) {
                try {
                    const payload = JSON.parse(postDraftMatch[1]);
                    finalUpdate = {
                        content: fullText.replace(postDraftMatch[0], "").trim() || "게시글 초안을 작성했습니다.",
                        actionType: "post_action",
                        actionPayload: payload
                    };
                } catch (e) { console.error("JSON parse error", e); }
            } else if (storeActionMatch) {
                try {
                    const payload = JSON.parse(storeActionMatch[1]);
                    finalUpdate = {
                        content: fullText.replace(storeActionMatch[0], "").trim() || "추천 상품을 찾았습니다.",
                        actionType: "store_action",
                        actionPayload: payload
                    };
                } catch (e) { console.error("JSON parse error", e); }
            } else if (tossPaymentMatch) {
                const tier = tossPaymentMatch[1];
                finalUpdate = {
                    content: fullText.replace(tossPaymentMatch[0], "").trim() || `${tier} 멤버십 결제를 진행해주세요.`,
                    actionType: "toss_payment",
                    actionPayload: { tier }
                };
            }

            // 최종 메시지 상태 업데이트
            updateMessage(agentMsgId, finalUpdate);

        } catch (error) {
            console.error("Agent Streaming error:", error);
            updateMessage(agentMsgId, {
                content: "죄송합니다. 서비스 연결에 문제가 발생했습니다. 다시 시도해 주세요.",
            });
        } finally {
            setTyping(false)
        }
    }, [input, addMessage, updateMessageContent, updateMessage, setTyping, user])

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
                        placeholder="FoFo에게 메시지 보내기..."
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
                FoFo는 실수할 수 있습니다. 중요한 작업은 반드시 확인해주세요.
            </p>
        </div>
    )
}
