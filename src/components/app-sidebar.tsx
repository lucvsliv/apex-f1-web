"use client"

import * as React from "react"
import { Shell, Store, Timer, Trophy, LineSquiggle, Sparkles, ShoppingCart } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { NavContent } from "@/components/nav-content"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar"
import { IconBorderCornerPill, IconCar4wd, IconHelmet, IconCalendarEvent, } from "@tabler/icons-react";

import { useUserStore } from "@/store/useUserStore"

const data = {
    logo: { name: "Apex F1", url: "/dashboard", icon: "/icons/logo.svg", },

    aiAgent: [
        {
            title: (
                <span className="bg-gradient-to-r from-stone-500 via-red-500 to-red-600 bg-clip-text text-transparent">
                    DoDo 에이전트
                </span>
            ),
            tooltip: "DoDo 에이전트",
            url: "/dashboard/agent/chat",
            icon: () => (
                <div className="relative flex items-center justify-center">
                    <svg width="0" height="0" className="absolute">
                        <defs>
                            <linearGradient id="sidebar-dodo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="10%" stopColor="#78716c" />
                                <stop offset="70%" stopColor="#ef4444" />
                                <stop offset="100%" stopColor="#dc2626" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <Sparkles
                        className="size-4"
                        style={{ stroke: "url(#sidebar-dodo-gradient)" }}
                    />
                </div>
            ),
        },
    ],

    navMain: [
        { title: "경기 일정", url: "/dashboard/schedules", icon: IconCalendarEvent },
        { title: "경기 결과", url: "/dashboard/results", icon: Timer },
        { title: "팀 정보", url: "/dashboard/teams", icon: Shell },
        { title: "드라이버", url: "/dashboard/drivers", icon: IconHelmet },
        { title: "레이스카", url: "/dashboard/cars", icon: IconCar4wd },
        { title: "랭킹", url: "/dashboard/ranks", icon: Trophy },
        { title: "서킷 정보", url: "/dashboard/circuits", icon: LineSquiggle },
    ],

    originalGoods: [
        { title: "상품 목록", url: "/dashboard/store/product", icon: Store },
        { title: "장바구니", url: "/dashboard/store/cart", icon: ShoppingCart },
    ],

    userMembership: [
        { title: "멤버십 관리", url: "/dashboard/profile", icon: IconBorderCornerPill },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useUserStore()

    return (
        <Sidebar collapsible="icon" {...props} className="border-r border-gray-200">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-600 text-white">
                        <img src="/icons/logo.svg" alt="Apex F1" className="size-6 invert brightness-0" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold text-stone-950">Apex F1</span>
                        <span className="text-xs text-stone-500">Official Partner</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.aiAgent} label="AI Agents" />
                <NavMain items={data.navMain} label="F1 Data" />
                <NavContent items={data.originalGoods} label="Store" />
                <NavContent items={data.userMembership} label="Membership" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{
                    name: user?.nickname || "Guest",
                    email: user?.email || "guest@example.com",
                    avatar: user?.profileImageUrl || "https://bundui-images.netlify.app/avatars/08.png",
                }} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
