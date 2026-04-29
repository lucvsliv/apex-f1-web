// SiteHeader.tsx
"use client"
import { usePathname } from "next/navigation"
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";

export function SiteHeader() {
    const pathname = usePathname()

    const pageTitleMap: Record<string, string> = {
        "/dashboard": "Dashboard",
        "/dashboard/agent/chat": "Apex Agent",
        "/dashboard/schedules": "Schedules",
        "/dashboard/results": "Results",
        "/dashboard/teams": "Teams",
        "/dashboard/drivers": "Drivers",
        "/dashboard/cars": "Cars",
        "/dashboard/ranks": "Ranks",
        "/dashboard/circuits": "Circuits",
        "/dashboard/store/product": "Products",
        "/dashboard/store/cart": "Cart",
        "/dashboard/store/checkout": "Checkout",
        "/dashboard/profile": "Account",
        "/dashboard/profile/edit": "Edit Profile",
        "/dashboard/reports": "Reports",
    }

    let title = pageTitleMap[pathname]

    if (!title) {
        if (pathname.startsWith("/dashboard/drivers/")) {
            title = "Drivers"
        } else if (pathname.startsWith("/dashboard/teams/")) {
            title = "Teams"
        } else {
            title = "Untitled"
        }
    }

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
