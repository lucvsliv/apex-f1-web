"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Key, Trash2, CreditCard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api/client";
import { useLanguage } from "@/contexts/language-context";

interface UserData {
    tier: string;
}

export default function ProfileContent() {
    const router = useRouter();
    const { t, language, setLanguage } = useLanguage();

    // 💡 1. 유저 상태 관리 추가
    const [user, setUser] = useState<UserData | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    // 💡 2. 컴포넌트 마운트 시 API에서 유저 등급(tier) 정보 가져오기
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/users/me");
                if (response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("사용자 정보를 불러오는데 실패했습니다.", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchUser();
    }, []);

    // 💡 유저 정보가 없으면 기본값은 ROOKIE로 처리
    const currentTier = user?.tier || "ROOKIE";

    if (isFetching) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
            </div>
        );
    }

    return (
        <Tabs defaultValue="personal" className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 gap-1 md:gap-0">
                <TabsTrigger value="personal">{t("profile.tabs.personal")}</TabsTrigger>
                <TabsTrigger value="account">{t("profile.tabs.account")}</TabsTrigger>
                <TabsTrigger value="membership">{t("profile.tabs.membership")}</TabsTrigger>
                <TabsTrigger value="security">{t("profile.tabs.security")}</TabsTrigger>
                <TabsTrigger value="notifications">{t("profile.tabs.notifications")}</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-6">
                <Card className="border-stone-200">
                    <CardHeader>
                        <CardTitle>{t("profile.personal.title")}</CardTitle>
                        <CardDescription>{t("profile.personal.desc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">{t("profile.personal.firstname")}</Label>
                                <Input id="firstName" defaultValue="John" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">{t("profile.personal.lastname")}</Label>
                                <Input id="lastName" defaultValue="Doe" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t("profile.personal.email")}</Label>
                                <Input id="email" type="email" defaultValue="john.doe@example.com" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">{t("profile.personal.phone")}</Label>
                                <Input id="phone" defaultValue="+1 (555) 123-4567" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobTitle">{t("profile.personal.jobtitle")}</Label>
                                <Input id="jobTitle" defaultValue="Senior Product Designer" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">{t("profile.personal.company")}</Label>
                                <Input id="company" defaultValue="Acme Inc." disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">{t("profile.personal.bio")}</Label>
                            <Textarea
                                id="bio"
                                placeholder="Tell us about yourself..."
                                defaultValue="Passionate product designer with 8+ years of experience creating user-centered digital experiences. I love solving complex problems and turning ideas into beautiful, functional products."
                                rows={4}
                                disabled
                                className="bg-stone-50 text-stone-500 border-dashed resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">{t("profile.personal.location")}</Label>
                            <Input id="location" defaultValue="San Francisco, CA" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6">
                <Card className="border-stone-200">
                    <CardHeader>
                        <CardTitle>{t("profile.account.title")}</CardTitle>
                        <CardDescription>{t("profile.account.description")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">{t("profile.account.status")}</Label>
                                <p className="text-muted-foreground text-sm">{t("profile.account.status.desc")}</p>
                            </div>
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                {t("common.active")}
                            </Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">{t("profile.account.language")}</Label>
                                <p className="text-muted-foreground text-sm">{t("profile.account.language.desc")}</p>
                            </div>
                            <Select value={language} onValueChange={(val) => setLanguage(val as "en" | "ko")}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent className="border-stone-200">
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ko">한국어</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">{t("profile.account.visibility")}</Label>
                                <p className="text-muted-foreground text-sm">
                                    {t("profile.account.visibility.desc")}
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">{t("profile.account.export")}</Label>
                                <p className="text-muted-foreground text-sm">{t("profile.account.export.desc")}</p>
                            </div>
                            <Button variant="outline" className="border-stone-200">{t("common.export")}</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">{t("profile.account.danger")}</CardTitle>
                        <CardDescription>{t("profile.account.danger.desc")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">{t("profile.account.delete")}</Label>
                                <p className="text-muted-foreground text-sm">
                                    {t("profile.account.delete.desc")}
                                </p>
                            </div>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("profile.account.delete")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Membership */}
            <TabsContent value="membership" className="space-y-6">
                <Card className="border-stone-200">
                    <CardHeader>
                        <CardTitle>{t("profile.membership.title")}</CardTitle>
                        <CardDescription>{t("profile.membership.description")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-stone-100 rounded-lg bg-stone-50/50">
                            <div className="space-y-1">
                                <Label className="text-base font-semibold text-stone-800">{t("profile.membership.current")}</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-2xl font-bold text-stone-900">{currentTier}</span>
                                    {currentTier === "ROOKIE" ? (
                                        <Badge variant="outline" className="text-stone-500 font-normal">{t("profile.membership.free")}</Badge>
                                    ) : (
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-semibold">{t("common.active")}</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-stone-500 mt-1">
                                    {currentTier === "ROOKIE"
                                        ? t("profile.membership.upgrade.msg")
                                        : t("profile.membership.premium.msg")}
                                </p>
                            </div>

                            <Button
                                onClick={() => router.push("/membership")}
                                className={currentTier === "ROOKIE" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-stone-900 hover:bg-stone-800 text-white cursor-pointer"}
                            >
                                <CreditCard className="mr-2 h-4 w-4" />
                                {currentTier === "ROOKIE" ? t("profile.membership.upgrade.btn") : t("profile.membership.manage.btn")}
                            </Button>
                        </div>

                        {currentTier !== "ROOKIE" && (
                            <>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base text-stone-800">{t("profile.membership.cancel")}</Label>
                                        <p className="text-muted-foreground text-sm">{t("profile.membership.cancel.desc")}</p>
                                    </div>
                                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-stone-200">
                                        {t("profile.membership.cancel")}
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
                <Card className="border-stone-200">
                    <CardHeader>
                        <CardTitle>{t("profile.security.title")}</CardTitle>
                        <CardDescription>{t("profile.security.desc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">{t("profile.security.password")}</Label>
                                </div>
                                <Button variant="outline" className="border-stone-200">
                                    <Key className="mr-2 h-4 w-4" />
                                    {t("profile.security.password.change")}
                                </Button>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">{t("profile.security.2fa")}</Label>
                                    <p className="text-muted-foreground text-sm">
                                        {t("profile.security.2fa.desc")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                        {t("profile.security.2fa.enabled")}
                                    </Badge>
                                    <Button variant="outline" size="sm" className="border-stone-200">
                                        {t("profile.security.2fa.config")}
                                    </Button>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">{t("profile.security.login_notif")}</Label>
                                    <p className="text-muted-foreground text-sm">
                                        {t("profile.security.login_notif.desc")}
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">{t("profile.security.sessions")}</Label>
                                    <p className="text-muted-foreground text-sm">
                                        {t("profile.security.sessions.desc")}
                                    </p>
                                </div>
                                <Button variant="outline" className="border-stone-200">
                                    <Shield className="mr-2 h-4 w-4" />
                                    {t("profile.security.sessions.view")}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
                <Card className="border-stone-200">
                    <CardHeader>
                        <CardTitle>{t("profile.notif.title")}</CardTitle>
                        <CardDescription>{t("profile.notif.desc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">{t("profile.notif.email")}</Label>
                                    <p className="text-muted-foreground text-sm">{t("profile.notif.email.desc")}</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">{t("profile.notif.push")}</Label>
                                    <p className="text-muted-foreground text-sm">
                                        {t("profile.notif.push.desc")}
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">{t("profile.notif.marketing")}</Label>
                                    <p className="text-muted-foreground text-sm">
                                        {t("profile.notif.marketing.desc")}
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">{t("profile.notif.weekly")}</Label>
                                    <p className="text-muted-foreground text-sm">
                                        {t("profile.notif.weekly.desc")}
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">{t("profile.notif.security")}</Label>
                                    <p className="text-muted-foreground text-sm">
                                        {t("profile.notif.security.desc")}
                                    </p>
                                </div>
                                <Switch checked disabled />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}