"use client"

import { useState, useEffect } from "react"
import {
    IconCreditCard,
    IconDotsVertical,
    IconLogout,
    IconLogin,
    IconNotification,
    IconUserCircle,
    IconCarambola,
} from "@tabler/icons-react"

import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/useUserStore"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
    user,
}: {
    user: {
        nickname: string
        email: string
        profileImageUrl?: string
    }
}) {
    const { isMobile, setOpenMobile } = useSidebar()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const { user: fullUser, clearUser } = useUserStore()
    const isGuest = user.nickname === "게스트" || user.nickname === "로딩 중..."

    const handleLogout = () => {
        localStorage.removeItem("apex_access_token")
        clearUser()
        alert("로그아웃 되었습니다.")
        router.push("/login")
    }

    const handleLogin = () => {
        router.push("/login")
    }

    const getTierDetails = (tier?: string) => {
        switch (tier) {
            case "PADDOCK": return { name: "PADDOCK", limit: "일일 50회", color: "text-blue-600 font-semibold" }
            case "GARAGE": return { name: "GARAGE", limit: "일일 200회", color: "text-blue-700 font-bold" }
            case "PITWALL": return { name: "PITWALL", limit: "무제한", color: "text-stone-900 font-extrabold" }
            default: return { name: "ROOKIE (무료)", limit: "일일 5회", color: "text-stone-500 font-medium" }
        }
    }

    const currentTier = getTierDetails(fullUser?.tier)

    if (!mounted) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" disabled>
                        <div className="size-8 rounded-lg bg-muted animate-pulse" />
                        <div className="grid flex-1 gap-1">
                            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                            <div className="h-2 w-24 bg-muted animate-pulse rounded" />
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.profileImageUrl} alt={user.nickname} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.nickname}</span>
                                    <span className="text-muted-foreground truncate text-xs">
                        {user.email}
                    </span>
                                </div>
                                <IconDotsVertical className="ml-auto size-4 text-stone-700" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-r border-stone-200"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user.profileImageUrl} alt={user.nickname} />
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{user.nickname}</span>
                                        <span className="text-muted-foreground truncate text-xs">
                            {user.email}
                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onSelect={() => {
                                        if (!isGuest) {
                                            router.push("/dashboard/profile")
                                            if (isMobile) setOpenMobile(false)
                                        }
                                    }}
                                    className={!isGuest ? "cursor-pointer" : ""}
                                    disabled={isGuest}
                                >
                                    <IconUserCircle className="mr-2 size-4" />
                                    계정 정보
                                </DropdownMenuItem>

                                {/* Membership */}
                                <DropdownMenuItem
                                    onSelect={() => {
                                        router.push("/membership")
                                        if (isMobile) setOpenMobile(false)
                                    }}
                                    className="cursor-pointer"
                                >
                                    <IconCarambola className="mr-2 size-4" />
                                    멤버십
                                </DropdownMenuItem>

                                {/* Notifications는 그대로 유지 */}
                                <DropdownMenuItem disabled={isGuest} className={!isGuest ? "cursor-pointer" : ""}>
                                    <IconNotification className="mr-2 size-4" />
                                    알림
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            {/* 로그인/로그아웃 버튼 */}
                            {isGuest ? (
                                <DropdownMenuItem onClick={handleLogin} className="cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50">
                                    <IconLogin className="mr-2 size-4" />
                                    로그인
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                                    <IconLogout className="mr-2 size-4" />
                                    로그아웃
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    )
}