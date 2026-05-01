"use client"

import { Sparkles, X } from "lucide-react"
import { useAgentStore } from "@/store/useAgentStore"
import { cn } from "@/lib/utils"

export function AgentFloatingButton() {
    const { isOpen, toggleOpen } = useAgentStore()

    return (
        <button
            id="agent-floating-btn"
            onClick={toggleOpen}
            className={cn(
                "fixed bottom-6 right-6 z-50",
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
    )
}
