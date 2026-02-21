// SiteHeader.tsx
"use client"
import { usePathname } from "next/navigation"
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";

export function SiteHeader() {
    const pathname = usePathname()

    const pageTitleMap: Record<string, string> = {
        "/dashboard": "Dashboard",
        "/dashboard/schedules": "Schedules",
        "/dashboard/reports": "Reports",
    }

    const title = pageTitleMap[pathname] ?? "Untitled"

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-gray-200">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <h1 className="text-base font-medium">{title}</h1>
            </div>
        </header>
    )
}
