"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Mail, MapPin } from "lucide-react";
import api from "@/lib/api/client";
import Link from "next/link";

interface UserData {
    nickname: string;
    email: string;
    profileImageUrl: string;
    tier: string;
}

export default function ProfileHeader() {
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/users/me");
                if (response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("사용자 정보를 불러오는데 실패했습니다.", error);
            }
        };
        fetchUser();
    }, []);

    const fallbackInitials = user?.nickname ? user.nickname.substring(0, 2).toUpperCase() : "JD";

    return (
        <Card className="border-stone-200">
            <CardContent className="p-6">
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                    <div className="relative">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.profileImageUrl || "https://bundui-images.netlify.app/avatars/08.png"} alt="Profile" />
                            <AvatarFallback className="text-2xl">{fallbackInitials}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <h1 className="text-2xl font-bold">{user?.nickname || "John Doe"}</h1>

                            {/* 멤버십 뱃지 영역 */}
                            <Badge variant={user?.tier === "ROOKIE" ? "outline" : "secondary"} className="border-stone-200">
                                {user?.tier ? `${user.tier} Member` : "Anonymous Member"}
                            </Badge>
                        </div>

                        {/* TODO: 나중에 응원하는 팀이나 자기소개로 변경 */}
                        <p className="text-muted-foreground">Senior Product Designer</p>

                        <div className="text-muted-foreground flex flex-wrap gap-4 text-sm mt-2">

                            {/* 이메일 영역 */}
                            <div className="flex items-center gap-1.5">
                                <Mail className="h-4 w-4" />
                                {user?.email || "john.doe@example.com"}
                            </div>

                            {/* TODO: 개인 지역 설정 */}
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                San Francisco, CA
                            </div>

                            {/* TODO: 나중에 가입 날짜 추가 - created_at 기반 */}
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                Joined March 2023
                            </div>
                        </div>
                    </div>
                    <Button asChild variant="default">
                        <Link href="/dashboard/profile/edit">Edit Profile</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}