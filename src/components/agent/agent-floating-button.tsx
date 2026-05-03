"use client"

import { Sparkles, X } from "lucide-react"
import { useAgentStore } from "@/store/useAgentStore"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function AgentFloatingButton() {
    const { isOpen, toggleOpen } = useAgentStore()
    const [showTip, setShowTip] = useState(false)

    useEffect(() => {
        // 이전에 닫았는지 확인
        const isTipDismissed = localStorage.getItem("fofo-tip-dismissed")
        if (!isTipDismissed && !isOpen) {
            // 1.5초 후에 서서히 나타남
            const timer = setTimeout(() => setShowTip(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    const handleDismissTip = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowTip(false)
        localStorage.setItem("fofo-tip-dismissed", "true")
    }

    // 채팅창이 열리면 팁은 자동으로 숨김
    useEffect(() => {
        if (isOpen) setShowTip(false)
    }, [isOpen])

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {showTip && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-white dark:bg-gray-900 border border-stone-200 dark:border-gray-800 rounded-2xl p-4 shadow-2xl shadow-black/10 max-w-[200px] mb-1"
                    >
                        {/* 닫기 버튼 */}
                        <button
                            onClick={handleDismissTip}
                            className="absolute -top-2 -right-2 size-6 rounded-full bg-stone-100 dark:bg-gray-800 border border-stone-200 dark:border-gray-700 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors shadow-sm"
                        >
                            <X className="size-3" />
                        </button>

                        <div className="flex flex-col gap-1">
                            <p className="text-[13px] font-bold text-stone-900 dark:text-stone-100 leading-tight">
                                FoFo 활용 팁!
                            </p>
                            <p className="text-[12px] text-stone-500 dark:text-stone-400 leading-snug">
                                "구독 시작해줘" 혹은 "게시글 작성해줘"라고 FoFo에게 요청해보세요.
                            </p>
                        </div>

                        {/* 화살표 */}
                        <div className="absolute -bottom-2 right-6 size-4 bg-white dark:bg-gray-900 border-r border-b border-stone-200 dark:border-gray-800 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                id="agent-floating-btn"
                onClick={toggleOpen}
                className={cn(
                    "relative",
                    "size-14 rounded-2xl",
                    "flex items-center justify-center",
                    "shadow-lg shadow-primary/25",
                    "transition-all duration-300 ease-out",
                    "hover:scale-105 hover:shadow-xl hover:shadow-primary/30",
                    "active:scale-95",
                    isOpen
                        ? "bg-muted text-foreground rotate-0"
                        : "bg-primary text-primary-foreground"
                )}
            >
                {isOpen ? (
                    <X className="size-5" />
                ) : (
                    <>
                        <Sparkles className="size-5" />
                        {/* 알림 뱃지 */}
                        <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-green-500 border-2 border-background" />
                    </>
                )}
            </button>
        </div>
    )
}
