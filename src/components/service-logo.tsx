"use client"

import * as React from "react"
import Link from "next/link"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function ServiceLogo({
                                logo,
                            }: {
    logo: {
        name: string
        url: string
        icon: React.ElementType
    }
}) {
    const { isMobile } = useSidebar()

    if (!logo) {
        return null
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <Link href={logo.url}>
                        <div className="flex aspect-square items-center justify-center rounded-lg text-sidebar-primary-foreground shrink-0">
                            <logo.icon className="size-8 text-red-500 stroke-3" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden" style={{ fontFamily: "'Formula 1', monospace" }}>
                            <span className="truncate text-xl font-medium">{logo.name}</span>
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}