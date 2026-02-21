import AgentChat from "@/components/agent-chat"

export default function Page() {
    return (
        <div className="flex-1 h-[calc(100vh-theme(spacing.16))]">
            <AgentChat />
        </div>
    )
}