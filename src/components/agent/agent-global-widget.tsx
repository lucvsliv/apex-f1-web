"use client"

import { AgentFloatingButton } from "@/components/agent/agent-floating-button"
import { AgentChatSheet } from "@/components/agent/agent-chat-sheet"

export function AgentGlobalWidget() {
    return (
        <>
            <AgentChatSheet />
            <AgentFloatingButton />
        </>
    )
}
