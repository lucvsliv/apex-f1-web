// SiteHeader.tsx
"use client"
import { usePathname } from "next/navigation"
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import { useLanguage } from "@/contexts/language-context";

export function SiteHeader() {
    const pathname = usePathname()
    const { t } = useLanguage()

    const pageTitleMap: Record<string, string> = {
        "/dashboard": t("sidebar.dashboard"),
        "/dashboard/agent/chat": t("sidebar.chat"),
        "/dashboard/schedules": t("sidebar.schedule"),
        "/dashboard/results": t("sidebar.results"),
        "/dashboard/teams": t("sidebar.teams"),
        "/dashboard/drivers": t("sidebar.drivers"),
        "/dashboard/cars": t("sidebar.cars"),
        "/dashboard/ranks": t("sidebar.standings"),
        "/dashboard/circuits": t("sidebar.circuits"),
        "/dashboard/community": t("sidebar.community.free"),
        "/dashboard/store/product": t("sidebar.store.products"),
        "/dashboard/store/cart": t("sidebar.store.cart"),
        "/dashboard/store/checkout": t("sidebar.store.checkout"),
        "/dashboard/profile": t("profile.tabs.account"),
        "/dashboard/profile/edit": "Edit Profile",
        "/dashboard/reports": "Reports",
    }

    let title = pageTitleMap[pathname]

    if (!title) {
        if (pathname.startsWith("/dashboard/drivers/")) {
            title = t("sidebar.drivers")
        } else if (pathname.startsWith("/dashboard/teams/")) {
            title = t("sidebar.teams")
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
