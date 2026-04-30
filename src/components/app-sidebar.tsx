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
    logo: { name: "Apex F1", url: "/dashboard", icon: "/icons/logo.svg",},

    aiAgent: [
        { title: "Apex Agent", url: "/dashboard/agent/chat", icon: Sparkles,},
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

    originalGoods: [
        { title: "Products", url: "/dashboard/store/product", icon: Store },
        { title: "Cart", url: "/dashboard/store/cart", icon: ShoppingCart },
        { title: "Checkout", url: "/dashboard/store/checkout", icon: CreditCard },
    ],

    community: [
        { title: "Board", url: "/dashboard/community", icon: MessageSquare },
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
                <NavMain label="Apex AI" items={data.aiAgent} />
                <NavMain label="Dataground" items={data.navMain} />
                <NavMain label="Original Goods" items={data.originalGoods} />
                <NavMain label="Community" items={data.community} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={displayUser}/>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}