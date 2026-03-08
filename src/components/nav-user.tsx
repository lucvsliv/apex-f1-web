"use client"

import { useState } from "react"
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

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function NavUser({
                            user,
                        }: {
    user: {
        nickname: string
        email: string
        profileImageUrl: string
    }
}) {
    const { isMobile } = useSidebar()
    const router = useRouter()

    // 💡 두 개의 모달 상태를 각각 관리합니다.
    const [isAccountOpen, setIsAccountOpen] = useState(false)
    const [isMembershipOpen, setIsMembershipOpen] = useState(false)

    const { user: fullUser, clearUser } = useUserStore()
    const isGuest = user.nickname === "Guest"

    const handleLogout = () => {
        localStorage.removeItem("apex_access_token")
        clearUser()
        alert("로그아웃 되었습니다.")
        router.push("/login")
    }

    const handleLogin = () => {
        router.push("/login")
    }

    // 💡 멤버십 등급에 따른 UI 텍스트 매핑 함수
    const getTierDetails = (tier?: string) => {
        switch (tier) {
            case "PADDOCK": return { name: "PADDOCK", limit: "일일 50회", color: "text-blue-600 font-semibold" }
            case "GARAGE": return { name: "GARAGE", limit: "일일 200회", color: "text-blue-700 font-bold" }
            case "PITWALL": return { name: "PITWALL", limit: "무제한", color: "text-stone-900 font-extrabold" }
            default: return { name: "ROOKIE (무료)", limit: "일일 5회", color: "text-stone-500 font-medium" }
        }
    }

    const currentTier = getTierDetails(fullUser?.tier)

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
                                    onSelect={() => !isGuest && setIsAccountOpen(true)}
                                    className={!isGuest ? "cursor-pointer" : ""}
                                    disabled={isGuest}
                                >
                                    <IconUserCircle className="mr-2 size-4" />
                                    Account
                                </DropdownMenuItem>

                                {/* 💡 Membership 메뉴: ROOKIE 등급 처리 추가 */}
                                <DropdownMenuItem
                                    onSelect={() => {
                                        // 💡 비로그인이거나, 로그인했지만 등급이 ROOKIE(무료)인 경우
                                        if (isGuest || fullUser?.tier === "ROOKIE") {
                                            router.push("/membership")
                                        } else {
                                            // 유료 구독자(PADDOCK, GARAGE, PITWALL)만 모달 띄우기
                                            setIsMembershipOpen(true)
                                        }
                                    }}
                                    className="cursor-pointer"
                                >
                                    <IconCarambola className="mr-2 size-4" />
                                    Membership
                                </DropdownMenuItem>

                                <DropdownMenuItem disabled={isGuest} className={!isGuest ? "cursor-pointer" : ""}>
                                    <IconNotification className="mr-2 size-4" />
                                    Notifications
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />

                            {isGuest ? (
                                <DropdownMenuItem onClick={handleLogin} className="cursor-pointer text-blue-600 focus:text-blue-700 focus:bg-blue-50">
                                    <IconLogin className="mr-2 size-4" />
                                    Log in
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                                    <IconLogout className="mr-2 size-4" />
                                    Log out
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            {/* Account 모달 */}
            <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                <DialogContent
                    className="border-stone-300 sm:max-w-sm"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle>My Profile</DialogTitle>
                        <DialogDescription>
                            내 계정 정보를 확인하고 관리할 수 있습니다.
                        </DialogDescription>
                    </DialogHeader>
                    <Separator />
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Profile Image</FieldLabel>
                            <div className="flex flex-col items-start gap-2">
                                <img
                                    src={fullUser?.profileImageUrl || "/avatars/default.svg"}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full border border-stone-200 overflow-hidden transition-all object-cover"
                                />
                            </div>
                        </Field>
                        <Field>
                            <Label htmlFor="nickname">Nickname</Label>
                            <Input id="nickname" name="nickname" defaultValue={fullUser?.nickname || ""} />
                        </Field>
                        <Field>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" defaultValue={fullUser?.email || ""} readOnly className="bg-stone-50 text-stone-500 focus-visible:ring-0 pointer-events-none" />
                        </Field>
                        <Field>
                            <Label htmlFor="provider">Account Provider</Label>
                            <Input id="provider" name="provider" defaultValue={fullUser?.provider === "LOCAL" ? "Email Account" : "Kakao Account"} readOnly className="bg-stone-50 text-stone-500 focus-visible:ring-0 pointer-events-none" />
                        </Field>
                    </FieldGroup>
                    <Separator />
                    <DialogFooter>
                        <DialogClose asChild className="border-stone-200 cursor-pointer">
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="button" onClick={() => alert("정보 수정 기능은 준비 중입니다.")} className="cursor-pointer">
                            Save changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Membership 모달 */}
            <Dialog open={isMembershipOpen} onOpenChange={setIsMembershipOpen}>
                <DialogContent
                    className="border-stone-300 sm:max-w-sm"
                    onOpenAutoFocus={(e) => e.preventDefault()} // 💡 여기도 추가하세요!
                >
                    <DialogHeader>
                        <DialogTitle>My Membership</DialogTitle>
                        <DialogDescription>
                            현재 구독 중인 플랜과 혜택을 확인하세요.
                        </DialogDescription>
                    </DialogHeader>

                    <Separator />

                    <FieldGroup>
                        <Field>
                            <Label>Current Plan</Label>
                            <div className={`text-xl ${currentTier.color}`}>
                                {currentTier.name}
                            </div>
                        </Field>

                        <Field>
                            <Label>AI Agent Usage Limit</Label>
                            <Input
                                readOnly
                                value={currentTier.limit}
                                className="bg-stone-50 text-stone-700 font-medium focus-visible:ring-0 pointer-events-none"
                            />
                        </Field>
                    </FieldGroup>

                    <Separator />

                    <DialogFooter>
                        <DialogClose asChild className="border-stone-200 cursor-pointer">
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                        {/* 💡 업그레이드 페이지로 라우팅하는 버튼 */}
                        <Button
                            type="button"
                            onClick={() => {
                                setIsMembershipOpen(false)
                                router.push("/membership")
                            }}
                            className="cursor-pointer"
                        >
                            Change Plan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}