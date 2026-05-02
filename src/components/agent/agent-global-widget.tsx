"use client"

import { Suspense, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AgentFloatingButton } from "@/components/agent/agent-floating-button"
import { AgentChatSheet } from "@/components/agent/agent-chat-sheet"
import { useAgentStore } from "@/store/useAgentStore"
import { useUserStore } from "@/store/useUserStore"
import api from "@/lib/api/client"

function PaymentSuccessHandler() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { addMessage, setOpen, _hasHydrated } = useAgentStore()
    const { fetchUser } = useUserStore()
    const hasProcessed = useRef(false)

    useEffect(() => {
        const paymentSuccess = searchParams.get("paymentSuccess")
        const authKey = searchParams.get("authKey")
        const customerKey = searchParams.get("customerKey")
        const targetTier = searchParams.get("targetTier")

        if (paymentSuccess !== "true" || !authKey || !customerKey || !targetTier) return
        if (hasProcessed.current) return
        hasProcessed.current = true

        const processSubscription = async () => {
            // 결제 프로세스 시작을 즉시 알림
            setOpen(true)
            addMessage({
                role: "agent",
                content: `${targetTier} 멤버십 결제를 처리하고 있습니다...`,
                actionType: "none",
            })

            try {
                const token = localStorage.getItem("apex_access_token")
                await api.post("/subscriptions",
                    { authKey, customerKey, targetTier },
                    { headers: { "Authorization": `Bearer ${token}` } }
                )

                // 성공 메시지를 즉시 표시 (유저 정보 갱신을 기다리지 않음)
                addMessage({
                    role: "agent",
                    content: `🎉 **${targetTier} 멤버십 구독이 완료되었습니다!**\n\n이제 더 강력한 기능들을 사용하실 수 있습니다. 다른 도움이 필요하시면 말씀해 주세요.`,
                    actionType: "none",
                })

                // 유저 정보(사이드바 등)는 백그라운드에서 조용히 갱신
                fetchUser()
            } catch (error) {
                console.error("구독 처리 실패:", error)
                addMessage({
                    role: "agent",
                    content: "멤버십 구독 처리 중 오류가 발생했습니다. 다시 시도해 주세요.",
                    actionType: "none",
                })
            }

            // URL 파라미터 제거
            router.replace("/dashboard", { scroll: false })
        }

        processSubscription()
    }, [searchParams, addMessage, setOpen, fetchUser, router])

    return null
}

export function AgentGlobalWidget() {
    return (
        <>
            <Suspense fallback={null}>
                <PaymentSuccessHandler />
            </Suspense>
            <AgentChatSheet />
            <AgentFloatingButton />
        </>
    )
}
