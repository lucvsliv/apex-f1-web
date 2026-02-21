"use client"

import Link from "next/link"
import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
import * as React from "react"

export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
    }[]
}) {
    const pathname = usePathname() // 현재 경로

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Dataground</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                            isActive={pathname === item.url} // 현재 경로와 비교
                            className="data-[active=true]:bg-sidebar-foreground/10" // 선택 메뉴 배경 어둡게
                        >
                            <Link href={item.url}>
                                {item.icon && (
                                    <item.icon
                                        className="!size-4.5"
                                        strokeWidth={1.7}
                                    />
                                )}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
