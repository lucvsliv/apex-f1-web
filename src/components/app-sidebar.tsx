"use client"

import * as React from "react"
import { useEffect } from "react"
import { Trophy, Timer, Shell, Map, PieChart, LineSquiggle, ClipboardList, Bot, Sparkles } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { ServiceLogo } from "@/components/service-logo"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar"
import { IconBorderCornerPill, IconCar4wd, IconHelmet, IconCalendarEvent, } from "@tabler/icons-react";

// Zustand 스토어 임포트
import { useUserStore } from "@/store/useUserStore"

const data = {
    logo: {
        name: "Apex F1",
        url: "/dashboard",
        icon: "/icons/logo.svg",
    },
    aiAgent: [
        {
            title: "Apex Assistant",
            url: "/dashboard/agent/chat",
            icon: Sparkles,
        },
    ],
    navMain: [
        { title: "Schedules", url: "/dashboard/schedules", icon: IconCalendarEvent },
        { title: "Results", url: "/dashboard/results", icon: Timer },
        { title: "Teams", url: "/dashboard/teams", icon: Shell },
        { title: "Drivers", url: "/dashboard/drivers", icon: IconHelmet },
        { title: "Cars", url: "/dashboard/cars", icon: IconCar4wd },
        { title: "Ranks", url: "/dashboard/ranks", icon: Trophy },
        { title: "Circuits", url: "/dashboard/circuits", icon: LineSquiggle },
    ],
    projects: [
        { name: "Board", url: "#", icon: ClipboardList },
        { name: "Sales & Marketing", url: "#", icon: PieChart },
        { name: "Travel", url: "#", icon: Map },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    // Zustand 스토어에서 상태와 함수 가져오기
    const { user, isLoading, fetchUser } = useUserStore();

    // 컴포넌트 마운트 시 API 호출
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // 로딩 중이거나 미로그인 상태일 때 NavUser 컴포넌트에 넘겨줄 Fallback 데이터
    const displayUser = {
        nickname: user?.nickname ?? (isLoading ? "Loading..." : "Guest"),
        email: user?.email ?? (isLoading ? "Please wait" : "Please sign in"),
        profileImageUrl: user?.profileImageUrl ?? "/avatars/default.svg",
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <ServiceLogo logo={data.logo} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain label="AI Agent" items={data.aiAgent} />
                <NavMain label="Dataground" items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={displayUser}/>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}