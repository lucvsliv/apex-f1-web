"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, MessageCircle, X } from "lucide-react"
import { useAgentStore } from "@/store/useAgentStore"
import { Button } from "@/components/ui/button"

export function AgentFloatingButton() {
    const { toggleOpen, isOpen } = useAgentStore()
    const [showGuide, setShowGuide] = useState(false)

    useEffect(() => {
        // 접속 1.5초 후 가이드 표시 (이미 닫았거나 열려있으면 표시 안함)
        const isGuideDismissed = localStorage.getItem("fofo-guide-dismissed")
        if (!isGuideDismissed && !isOpen) {
            const timer = setTimeout(() => setShowGuide(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowGuide(false)
        localStorage.setItem("fofo-guide-dismissed", "true")
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* 가이드 말풍선 */}
            <AnimatePresence>
                {showGuide && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative group"
                    >
                        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl rounded-2xl p-4 pr-10 max-w-[240px] text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                            <button 
                                onClick={handleDismiss}
                                className="absolute top-2 right-2 p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 transition-colors"
                            >
                                <X size={14} />
                            </button>
                            <p className="font-semibold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
                                <Sparkles size={14} className="text-blue-500" />
                                FoFo 활용 팁!
                            </p>
                            FoFo에게 원하는 동작을 요청해보세요. 게시글 작성이나 상품 구매도 도와드려요!
                        </div>
                        {/* 말풍선 꼬리 */}
                        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-stone-900 border-r border-b border-stone-200 dark:border-stone-800 rotate-45 shadow-[4px_4px_10px_-2px_rgba(0,0,0,0.1)]" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 메인 버튼 */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={() => {
                        toggleOpen()
                        if (showGuide) handleDismiss({ stopPropagation: () => {} } as any)
                    }}
                    size="icon"
                    className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-500 ${
                        isOpen 
                        ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rotate-90" 
                        : "bg-white dark:bg-stone-900 text-stone-900 dark:text-white hover:bg-stone-50"
                    }`}
                >
                    {isOpen ? (
                        <X size={28} />
                    ) : (
                        <div className="relative">
                            <svg width="0" height="0" className="absolute">
                                <defs>
                                    <linearGradient id="fofo-icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="10%" stopColor="#3b82f6" />
                                        <stop offset="70%" stopColor="#ef4444" />
                                        <stop offset="100%" stopColor="#dc2626" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <Sparkles 
                                size={28} 
                                style={{ stroke: "url(#fofo-icon-gradient)" }} 
                            />
                        </div>
                    )}
                </Button>
            </motion.div>
        </div>
    )
}
