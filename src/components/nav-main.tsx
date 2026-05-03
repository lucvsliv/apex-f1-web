"use client"

import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function NavMain({ items, label }: {
    items: {
        title: React.ReactNode
        url: string
        icon?: LucideIcon | React.ComponentType<any>
        isActive?: boolean
        tooltip?: string
        items?: {
            title: string
            url: string
        }[]
    }[]
    label: string
}) {
    const pathname = usePathname()
    const { isMobile, state } = useSidebar()

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = pathname === item.url || (item.items?.some(subItem => subItem.url === pathname))
                    const isCollapsed = state === "collapsed"

                    const menuButton = (
                        <SidebarMenuButton tooltip={typeof item.title === "string" ? item.title : item.tooltip} isActive={isActive}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            {item.items && (
                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            )}
                        </SidebarMenuButton>
                    )

                    return (
                        <Collapsible
                            key={typeof item.title === "string" ? item.title : (item.url + label)}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                {item.items ? (
                                    <>
                                        <CollapsibleTrigger asChild>
                                            {menuButton}
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                                            <a href={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </a>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </>
                                ) : (
                                    <a href={item.url}>{menuButton}</a>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
