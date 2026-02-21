"use client"

import * as React from "react"
import { Trophy, Timer, Shell, Map, PieChart, LineSquiggle, ClipboardList, } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { ServiceLogo } from "@/components/service-logo"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar"
import { IconBorderCornerPill, IconCar4wd, IconHelmet, IconCalendarEvent, } from "@tabler/icons-react";

// This is sample data.
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
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
