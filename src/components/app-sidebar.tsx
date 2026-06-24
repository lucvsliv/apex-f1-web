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
import { useLanguage } from "@/contexts/language-context"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user, isLoading, fetchUser } = useUserStore();
    const { t } = useLanguage();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const data = {
        logo: { name: "Apex F1", url: "/dashboard", icon: "/icons/logo.svg", },

        aiAgent: [
            {
                title: (
                    <span className="bg-gradient-to-r from-stone-500 via-red-500 to-red-600 bg-clip-text text-transparent">
                        {t("sidebar.chat")}
                    </span>
                ),
                tooltip: t("sidebar.chat"),
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
            { title: t("sidebar.schedule"), url: "/dashboard/schedules", icon: IconCalendarEvent },
            { title: t("sidebar.results"), url: "/dashboard/results", icon: Timer },
            { title: t("sidebar.teams"), url: "/dashboard/teams", icon: Shell },
            { title: t("sidebar.drivers"), url: "/dashboard/drivers", icon: IconHelmet },
            { title: t("sidebar.cars"), url: "/dashboard/cars", icon: IconCar4wd },
            { title: t("sidebar.standings"), url: "/dashboard/ranks", icon: Trophy },
            { title: t("sidebar.circuits"), url: "/dashboard/circuits", icon: LineSquiggle },
        ],

        originalGoods: [
            { title: t("sidebar.store.products"), url: "/dashboard/store/product", icon: Store },
            { title: t("sidebar.store.cart"), url: "/dashboard/store/cart", icon: ShoppingCart },
            { title: t("sidebar.store.checkout"), url: "/dashboard/store/checkout", icon: CreditCard },
        ],

        community: [
            { title: t("sidebar.community.free"), url: "/dashboard/community", icon: MessageSquare },
        ],
    }

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
                <NavMain label={t("sidebar.group.ai")} items={data.aiAgent} />
                <NavMain label={t("sidebar.group.data")} items={data.navMain} />
                <NavMain label={t("sidebar.group.store")} items={data.originalGoods} />
                <NavMain label={t("sidebar.group.community")} items={data.community} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={displayUser} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}