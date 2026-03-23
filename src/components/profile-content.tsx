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
import api from "@/lib/api/client"; // 💡 유저 정보를 가져오기 위한 api 임포트

interface UserData {
    tier: string;
}

export default function ProfileContent() {
    const router = useRouter();

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
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="membership">Membership</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="space-y-6">
                <Card className="border-stone-200">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details and profile information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" defaultValue="John" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" defaultValue="Doe" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="john.doe@example.com" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" defaultValue="+1 (555) 123-4567" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobTitle">Job Title</Label>
                                <Input id="jobTitle" defaultValue="Senior Product Designer" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input id="company" defaultValue="Acme Inc." disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
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
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" defaultValue="San Francisco, CA" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6">
                <Card className="border-stone-200">
                    <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your account preferences and data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Account Status</Label>
                                <p className="text-muted-foreground text-sm">Your account is currently active</p>
                            </div>
                            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                Active
                            </Badge>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Account Visibility</Label>
                                <p className="text-muted-foreground text-sm">
                                    Make your profile visible to other users
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Data Export</Label>
                                <p className="text-muted-foreground text-sm">Download a copy of your data</p>
                            </div>
                            <Button variant="outline" className="border-stone-200">Export Data</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>Irreversible and destructive actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-base">Delete Account</Label>
                                <p className="text-muted-foreground text-sm">
                                    Permanently delete your account and all data
                                </p>
                            </div>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Membership */}
            <TabsContent value="membership" className="space-y-6">
                <Card className="border-stone-200">
                    <CardHeader>
                        <CardTitle>Membership Plan</CardTitle>
                        <CardDescription>Manage your subscription and billing details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-stone-100 rounded-lg bg-stone-50/50">
                            <div className="space-y-1">
                                <Label className="text-base font-semibold text-stone-800">Current Plan</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-2xl font-bold text-stone-900">{currentTier}</span>
                                    {currentTier === "ROOKIE" ? (
                                        <Badge variant="outline" className="text-stone-500 font-normal">Free</Badge>
                                    ) : (
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-semibold">Active</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-stone-500 mt-1">
                                    {currentTier === "ROOKIE"
                                        ? "Upgrade to unlock advanced F1 data analysis features."
                                        : "You are currently enjoying premium features."}
                                </p>
                            </div>

                            <Button
                                onClick={() => router.push("/membership")}
                                className={currentTier === "ROOKIE" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-stone-900 hover:bg-stone-800 text-white cursor-pointer"}
                            >
                                <CreditCard className="mr-2 h-4 w-4" />
                                {currentTier === "ROOKIE" ? "Upgrade Membership" : "Manage Membership"}
                            </Button>
                        </div>

                        {currentTier !== "ROOKIE" && (
                            <>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base text-stone-800">Cancel Subscription</Label>
                                        <p className="text-muted-foreground text-sm">Cancel your current billing cycle.</p>
                                    </div>
                                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-stone-200">
                                        Cancel Subscription
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
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>Manage your account security and authentication.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">Password</Label>
                                    <p className="text-muted-foreground text-sm">Last changed 3 months ago</p>
                                </div>
                                <Button variant="outline" className="border-stone-200">
                                    <Key className="mr-2 h-4 w-4" />
                                    Change Password
                                </Button>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">Two-Factor Authentication</Label>
                                    <p className="text-muted-foreground text-sm">
                                        Add an extra layer of security to your account
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                        Enabled
                                    </Badge>
                                    <Button variant="outline" size="sm" className="border-stone-200">
                                        Configure
                                    </Button>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">Login Notifications</Label>
                                    <p className="text-muted-foreground text-sm">
                                        Get notified when someone logs into your account
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">Active Sessions</Label>
                                    <p className="text-muted-foreground text-sm">
                                        Manage devices that are logged into your account
                                    </p>
                                </div>
                                <Button variant="outline" className="border-stone-200">
                                    <Shield className="mr-2 h-4 w-4" />
                                    View Sessions
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
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>Choose what notifications you want to receive.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">Email Notifications</Label>
                                    <p className="text-muted-foreground text-sm">Receive notifications via email</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">Push Notifications</Label>
                                    <p className="text-muted-foreground text-sm">
                                        Receive push notifications in your browser
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">Marketing Emails</Label>
                                    <p className="text-muted-foreground text-sm">
                                        Receive emails about new features and updates
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">Weekly Summary</Label>
                                    <p className="text-muted-foreground text-sm">
                                        Get a weekly summary of your activity
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base">Security Alerts</Label>
                                    <p className="text-muted-foreground text-sm">
                                        Important security notifications (always enabled)
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