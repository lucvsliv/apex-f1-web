// app/dashboard/layout.tsx
import { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { AgentGlobalWidget } from "@/components/agent/agent-global-widget"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 60)",
                    "--sidebar-width-icon": "calc(var(--spacing) * 10)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            {/* 대시보드 전용 사이드바 */}
            <AppSidebar variant="inset" />

            <SidebarInset>
                {/* 공통 헤더 */}
                <SiteHeader />

                {/* 대시보드 페이지 콘텐츠 */}
                <div className="flex flex-1 flex-col">{children}</div>
            </SidebarInset>

            {/* 글로벌 AI 에이전트 위젯 (플로팅 버튼 + 채팅 패널) */}
            <AgentGlobalWidget />
        </SidebarProvider>
    )
}
