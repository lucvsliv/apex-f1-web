"use client"

import * as React from "react"
// AI Agent용 아이콘으로 Bot 추가
import { Trophy, Timer, Shell, Map, PieChart, LineSquiggle, ClipboardList, Bot, Sparkles } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { ServiceLogo } from "@/components/service-logo"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar"
import { IconBorderCornerPill, IconCar4wd, IconHelmet, IconCalendarEvent, } from "@tabler/icons-react";

const data = {
    user: {
        name: "Charles Lucvs",
        email: "lucvs@apexf1.com",
        avatar: "/avatars/quokka.jpg",
    },
    logo: {
        name: "Apex F1",
        url: "/dashboard",
        icon: IconBorderCornerPill,
    },
    // AI Agent 전용 메뉴 데이터 추가
    aiAgent: [
        {
            title: "Apex Assistant",
            url: "/dashboard/agent/chat",
            icon: Sparkles,
        },
    ],
    navMain: [
        {
            title: "Schedules",
            url: "/dashboard/schedules",
            icon: IconCalendarEvent,
        },
        {
            title: "Results",
            url: "/dashboard/results",
            icon: Timer,
        },
        {
            title: "Teams",
            url: "/dashboard/teams",
            icon: Shell,
        },
        {
            title: "Drivers",
            url: "/dashboard/drivers",
            icon: IconHelmet,
        },
        {
            title: "Cars",
            url: "/dashboard/cars",
            icon: IconCar4wd,
        },
        {
            title: "Ranks",
            url: "/dashboard/ranks",
            icon: Trophy,
        },
        {
            title: "Circuits",
            url: "/dashboard/circuits",
            icon: LineSquiggle,
        },
    ],
    projects: [
        {
            name: "Board",
            url: "#",
            icon: ClipboardList,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <ServiceLogo logo={data.logo} />
            </SidebarHeader>
            <SidebarContent>
                {/* AI Agent 그룹을 최상단에 추가 */}
                <NavMain label="AI Agent" items={data.aiAgent} />
                {/* 기존 Dataground 그룹 */}
                <NavMain label="Dataground" items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}