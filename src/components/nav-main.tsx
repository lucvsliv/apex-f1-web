"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
import * as React from "react"

export function NavMain({
                            label,
                            items,
                        }: {
    label: string
    items: {
        title: string
        url: string
        icon?: React.ElementType
    }[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                {label}
            </SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                            isActive={pathname === item.url}
                            className="data-[active=true]:bg-sidebar-foreground/10"
                        >
                            <Link href={item.url}>
                                {item.icon && (
                                    <item.icon
                                        className="shrink-0 !size-4.5"
                                        strokeWidth={1.7}
                                    />
                                )}
                                <span className="truncate group-data-[collapsible=icon]:hidden">
                                    {item.title}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}