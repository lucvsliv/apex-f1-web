"use client"

import * as React from "react"
import { useEffect } from "react"
// 💡 ShoppingCart, CreditCard 아이콘 추가
import { Trophy, Timer, Shell, Map, PieChart, LineSquiggle, ClipboardList, Bot, Sparkles, Store, ShoppingCart, CreditCard, MessageSquare } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { ServiceLogo } from "@/components/service-logo"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar"
import { IconBorderCornerPill, IconCar4wd, IconHelmet, IconCalendarEvent, } from "@tabler/icons-react";

import { useUserStore } from "@/store/useUserStore"

const data = {
    logo: { name: "Apex F1", url: "/dashboard", icon: "/icons/logo.svg", },

    aiAgent: [
        { title: "Apex 에이전트", url: "/dashboard/agent/chat", icon: Sparkles, },
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
        { title: "결제하기", url: "/dashboard/store/checkout", icon: CreditCard },
    ],

    community: [
        { title: "자유게시판", url: "/dashboard/community", icon: MessageSquare },
    ],

    // projects: [
    //     { name: "Board", url: "#", icon: ClipboardList },
    //     { name: "Sales & Marketing", url: "#", icon: PieChart },
    //     { name: "Travel", url: "#", icon: Map },
    // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user, isLoading, fetchUser } = useUserStore();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const displayUser = {
        nickname: user?.nickname ?? (isLoading ? "로딩 중..." : "게스트"),
        email: user?.email ?? (isLoading ? "잠시만 기다려 주세요" : "로그인이 필요합니다"),
        profileImageUrl: user?.profileImageUrl ?? "/avatars/default.svg",
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <ServiceLogo logo={data.logo} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain label="Apex AI 에이전트" items={data.aiAgent} />
                <NavMain label="데이터 분석" items={data.navMain} />
                <NavMain label="굿즈 샵" items={data.originalGoods} />
                <NavMain label="커뮤니티" items={data.community} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={displayUser} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}