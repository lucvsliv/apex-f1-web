"use client"

import * as React from "react"
import Link from "next/link"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function ServiceLogo({
                                logo,
                            }: {
    logo: {
        name: string
        url: string
        icon: React.ElementType | string
    }
}) {
    if (!logo) return null

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <Link href={logo.url} className="flex items-center gap-2">

                        {/* 로고 아이콘 */}
                        <div className="flex aspect-square items-center justify-center rounded-lg shrink-0">
                            {typeof logo.icon === "string" ? (
                                <img src={logo.icon} alt="logo" className="size-8" />
                            ) : (
                                <logo.icon className="size-8 text-red-500 stroke-3" />
                            )}
                        </div>

                        {/* 로고 텍스트 */}
                        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span
                  className="truncate text-xl font-medium"
                  style={{ fontFamily: "'Formula 1', monospace" }}
              >
                {logo.name}
              </span>
                        </div>

                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}