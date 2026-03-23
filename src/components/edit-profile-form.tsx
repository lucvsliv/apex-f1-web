"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Dices, Upload, User } from "lucide-react";
import api from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface UserData {
    nickname: string;
    profileImageUrl: string;
    email: string;
}

export default function EditProfileForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [originalNickname, setOriginalNickname] = useState("");
    const [originalProfileImageUrl, setOriginalProfileImageUrl] = useState("");

    const [nicknameStatus, setNicknameStatus] = useState<"idle" | "checking" | "available" | "duplicate" | "error">("idle");

    const [formData, setFormData] = useState<UserData>({
        nickname: "",
        profileImageUrl: "",
        email: "",
    });

    const [presetAvatar] = useState("/avatars/default.svg");
    const [randomAvatar, setRandomAvatar] = useState("");
    const [uploadAvatar, setUploadAvatar] = useState<string | null>(null);

    const generateRandomAvatar = () => {
        const seed = Math.random().toString(36).substring(7);
        const newRandomUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;
        setRandomAvatar(newRandomUrl);
        if (formData.profileImageUrl === randomAvatar) {
            setFormData((prev) => ({ ...prev, profileImageUrl: newRandomUrl }));
        }
    };

    const handleAvatarSelect = (url: string | null) => {
        if (url) {
            setFormData((prev) => ({ ...prev, profileImageUrl: url }));
        }
    };

    useEffect(() => {
        generateRandomAvatar();

        const fetchUser = async () => {
            try {
                const response = await api.get("/users/me");
                if (response.data) {
                    const currentImageUrl = response.data.profileImageUrl || presetAvatar;
                    const fetchedNickname = response.data.nickname || "";

                    setFormData({
                        nickname: fetchedNickname,
                        profileImageUrl: currentImageUrl,
                        email: response.data.email || "",
                    });

                    // 💡 서버에서 받아온 초기 데이터를 기록해 둡니다.
                    setOriginalNickname(fetchedNickname);
                    setOriginalProfileImageUrl(currentImageUrl);

                    if (currentImageUrl.includes("api.dicebear.com")) {
                        setRandomAvatar(currentImageUrl);
                    } else if (currentImageUrl !== presetAvatar) {
                        setUploadAvatar(currentImageUrl);
                    }
                }
            } catch (error) {
                console.error("사용자 정보를 불러오는데 실패했습니다.", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));

        if (id === "nickname") {
            setNicknameStatus("idle");
        }
    };

    const handleNicknameCheck = async () => {
        if (!formData.nickname.trim() || formData.nickname === originalNickname) return;

        setNicknameStatus("checking");
        try {
            await api.get(`/auth/check-nickname?nickname=${formData.nickname}`);
            setNicknameStatus("available");
        } catch (error: any) {
            if (error.response?.status === 409) {
                setNicknameStatus("duplicate");
            } else {
                setNicknameStatus("error");
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setUploadAvatar(base64String);
            setFormData((prev) => ({ ...prev, profileImageUrl: base64String }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isNicknameValid) return;

        setIsLoading(true);

        try {
            await api.put("/users/me", {
                nickname: formData.nickname,
                profileImageUrl: formData.profileImageUrl
            });

            router.push("/dashboard/profile");
            router.refresh();
        } catch (error) {
            console.error("프로필 수정 실패:", error);
            alert("프로필 수정에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const isNicknameValid = formData.nickname === originalNickname || nicknameStatus === "available";

    const hasChanges = formData.nickname !== originalNickname || formData.profileImageUrl !== originalProfileImageUrl;

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <form onSubmit={handleSubmit}>
                <Card className="border-stone-200">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details and profile information.</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-8">
                        {/* 프로필 이미지 선택 영역 */}
                        <div className="space-y-4">
                            <div>
                                <Label className="text-base font-medium">Profile Image</Label>
                            </div>

                            <div className="flex gap-8 items-end mt-2">
                                {/* 기본 이미지 */}
                                <div className="flex flex-col items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => handleAvatarSelect(presetAvatar)}
                                        className={cn(
                                            "w-20 h-20 rounded-full border-2 overflow-hidden transition-all hover:scale-105 p-0",
                                            formData.profileImageUrl !== presetAvatar && "opacity-40 grayscale-[30%] hover:opacity-100",
                                            formData.profileImageUrl === presetAvatar ? "border-stone-400 ring-2 ring-stone-200" : "border-stone-200 hover:border-stone-300"
                                        )}
                                    >
                                        <img src={presetAvatar} alt="Default" className="w-full h-full object-cover" />
                                    </Button>
                                    <span className={cn("text-xs font-medium transition-colors", formData.profileImageUrl === presetAvatar ? "text-stone-500" : "text-stone-300")}>
                                        Default
                                    </span>
                                </div>

                                {/* 랜덤 이미지 */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="relative">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => handleAvatarSelect(randomAvatar)}
                                            className={cn(
                                                "w-20 h-20 rounded-full border-2 overflow-hidden transition-all hover:scale-105 bg-white p-0",
                                                formData.profileImageUrl !== randomAvatar && "opacity-40 grayscale-[30%] hover:opacity-100",
                                                formData.profileImageUrl === randomAvatar ? "border-stone-400 ring-2 ring-stone-200" : "border-stone-200 hover:border-stone-300"
                                            )}
                                        >
                                            {randomAvatar && <img src={randomAvatar} alt="Random" className="w-full h-full object-cover" />}
                                        </Button>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={(e) => { e.stopPropagation(); generateRandomAvatar(); }}
                                            className="absolute -bottom-1 -right-1 bg-white border border-stone-200 rounded-full h-8 w-8 shadow-sm text-stone-600 transition-colors z-20 opacity-100 hover:bg-stone-50"
                                            title="다른 랜덤 이미지 생성"
                                        >
                                            <Dices className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <span className={cn("text-xs font-medium transition-colors", formData.profileImageUrl === randomAvatar ? "text-stone-500" : "text-stone-300")}>
                                        Random
                                    </span>
                                </div>

                                {/* 업로드 이미지 */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="relative">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => uploadAvatar && handleAvatarSelect(uploadAvatar)}
                                            className={cn(
                                                "w-20 h-20 flex items-center justify-center rounded-full border-2 overflow-hidden transition-all p-0",
                                                !uploadAvatar ? "border-dashed border-stone-300 bg-stone-50 cursor-default" : "hover:scale-105",
                                                uploadAvatar && formData.profileImageUrl !== uploadAvatar && "opacity-40 grayscale-[30%] hover:opacity-100",
                                                uploadAvatar && formData.profileImageUrl === uploadAvatar ? "border-stone-400 ring-2 ring-stone-200" : (uploadAvatar ? "border-stone-200 hover:border-stone-300" : "")
                                            )}
                                        >
                                            {uploadAvatar ? <img src={uploadAvatar} alt="Upload" className="w-full h-full object-cover" /> : <User className="h-6 w-6 text-stone-400" />}
                                        </Button>
                                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute -bottom-1 -right-1 bg-white border border-stone-200 rounded-full h-8 w-8 shadow-sm text-stone-500 transition-colors z-20 opacity-100 hover:bg-stone-50"
                                            title="이미지 업로드"
                                        >
                                            <Upload className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <span className={cn("text-xs font-medium transition-colors", formData.profileImageUrl === uploadAvatar ? "text-stone-500" : "text-stone-300")}>
                                        Upload
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2단 그리드 입력 폼 */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4 border-t border-stone-100">

                            <div className="space-y-2">
                                <Label htmlFor="nickname" className="font-semibold text-stone-800">Nickname</Label>
                                <div className="flex gap-2 items-start">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <Input
                                            id="nickname"
                                            type="text"
                                            placeholder="Enter your nickname"
                                            required
                                            value={formData.nickname}
                                            onChange={handleChange}
                                            className={cn(
                                                "w-full bg-white placeholder:text-stone-300",
                                                nicknameStatus === "available" && "border-blue-400 focus-visible:ring-blue-400",
                                                nicknameStatus === "duplicate" && "border-red-400 focus-visible:ring-red-400"
                                            )}
                                        />
                                        {nicknameStatus === "available" && <span className="text-xs font-medium text-blue-500 pl-1">사용 가능한 닉네임입니다.</span>}
                                        {nicknameStatus === "duplicate" && <span className="text-xs font-medium text-red-500 pl-1">이미 사용 중인 닉네임입니다.</span>}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleNicknameCheck}
                                        disabled={!formData.nickname || formData.nickname === originalNickname || nicknameStatus === "checking" || nicknameStatus === "available"}
                                        className={cn(
                                            "shrink-0 transition-colors bg-white",
                                            (nicknameStatus === "idle" || nicknameStatus === "checking") && "border-stone-300 text-stone-500 hover:bg-stone-100 hover:text-stone-800",
                                            nicknameStatus === "duplicate" && "border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-500",
                                            nicknameStatus === "available" && "border-blue-400 text-blue-500 disabled:opacity-100"
                                        )}
                                    >
                                        {nicknameStatus === "checking" ? "확인 중..." : "중복확인"}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-semibold text-stone-800">Email Address</Label>
                                <Input id="email" value={formData.email || "john.doe@example.com"} disabled className="bg-stone-50 text-stone-500" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-stone-500">First Name</Label>
                                <Input id="firstName" defaultValue="John" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-stone-500">Last Name</Label>
                                <Input id="lastName" defaultValue="Doe" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-stone-500">Phone</Label>
                                <Input id="phone" defaultValue="+1 (555) 123-4567" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobTitle" className="text-stone-500">Job Title</Label>
                                <Input id="jobTitle" defaultValue="Senior Product Designer" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-stone-500">Company</Label>
                                <Input id="company" defaultValue="Acme Inc." disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location" className="text-stone-500">Location</Label>
                                <Input id="location" defaultValue="San Francisco, CA" disabled className="bg-stone-50 text-stone-500 border-dashed" />
                            </div>
                        </div>

                        {/* Bio 영역 */}
                        <div className="space-y-2">
                            <Label htmlFor="bio" className="text-stone-500">Bio</Label>
                            <Textarea
                                id="bio"
                                defaultValue="Passionate product designer with 8+ years of experience creating user-centered digital experiences. I love solving complex problems and turning ideas into beautiful, functional products."
                                rows={4}
                                disabled
                                className="bg-stone-50 text-stone-500 border-dashed resize-none"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between items-center border-t border-stone-100 bg-stone-50/50 px-6 py-4 rounded-b-xl">
                        <div className="flex items-center gap-3">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading} className="bg-white border-stone-200">
                                Cancel
                            </Button>

                            <Button type="submit" disabled={isLoading || !formData.nickname.trim() || !isNicknameValid || !hasChanges}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}