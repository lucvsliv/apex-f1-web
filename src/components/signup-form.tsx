"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import Script from "next/script";
import api from "@/lib/api/client";
import { Upload, Dices, User } from "lucide-react";

export function SignupForm({
                               className,
                               ...props
                           }: React.ComponentProps<"div">) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);

    const [presetAvatar] = useState("/avatars/default.svg");
    const [randomAvatar, setRandomAvatar] = useState("");
    const [uploadAvatar, setUploadAvatar] = useState<string | null>(null);

    useEffect(() => {
        generateRandomAvatar();
    }, []);

    const [formData, setFormData] = useState({
        email: "",
        nickname: "",
        password: "",
        confirmPassword: "",
        profileImageUrl: "/avatars/default.svg",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleAvatarSelect = (url: string | null) => {
        if (url) {
            setFormData((prev) => ({ ...prev, profileImageUrl: url }));
        }
    };

    const generateRandomAvatar = () => {
        const seed = Math.random().toString(36).substring(7);
        const newRandomUrl = `https://api.dicebear.com/9.x/identicon/svg?seed=${seed}`;
        setRandomAvatar(newRandomUrl);
        if (formData.profileImageUrl === randomAvatar) {
            setFormData((prev) => ({ ...prev, profileImageUrl: newRandomUrl }));
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
        if (formData.password.length < 8) {
            alert("비밀번호는 8자리 이상이어야 합니다.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            setIsLoading(true);
            await api.post("/v1/auth/signup", {
                email: formData.email,
                nickname: formData.nickname,
                password: formData.password,
                profileImageUrl: formData.profileImageUrl,
            });
            alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
            router.push("/login");
        } catch (error: any) {
            if (error.response?.status === 409) {
                alert("이미 사용 중인 이메일 또는 닉네임입니다.");
            } else {
                alert("회원가입에 실패했습니다. 다시 시도해 주세요.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKakaoLogin = () => {
        if (!window.Kakao || !window.Kakao.isInitialized()) {
            alert("카카오 SDK가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        window.Kakao.Auth.login({
            success: async function (authObj: any) {
                try {
                    const response = await api.post("/auth/social/login", {
                        provider: "KAKAO",
                        accessToken: authObj.access_token,
                    });

                    localStorage.setItem("apex_access_token", response.data.accessToken);
                    router.push("/dashboard/agent/chat");

                } catch (error) {
                    console.error("로그인 연동 에러:", error);
                    alert("로그인 처리 중 문제가 발생했습니다.");
                }
            },
            fail: function (err: any) {
                console.error("카카오 로그인 실패:", err);
                alert("카카오 로그인에 실패했습니다.");
            },
        });
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Script
                src="https://t1.kakaocdn.net/kakao_js_sdk/1.43.1/kakao.min.js"
                strategy="lazyOnload"
                onLoad={() => {
                    if (window.Kakao && !window.Kakao.isInitialized()) {
                        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
                    }
                }}
            />

            <Card className="overflow-hidden p-0 border-gray-200">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Create your account</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Join Apex F1 Agent and explore the data
                                </p>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
                                <Input
                                    id="nickname"
                                    type="text"
                                    placeholder="Type your name"
                                    required
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    className="placeholder:text-stone-300"
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Profile Image</FieldLabel>
                                <div className="flex gap-8 items-end mt-2">

                                    {/* 1. 기본 프리셋 옵션 */}
                                    <div className="flex flex-col items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleAvatarSelect(presetAvatar)}
                                            className={cn(
                                                "w-16 h-16 rounded-full border-2 overflow-hidden transition-all hover:scale-105",
                                                formData.profileImageUrl === presetAvatar
                                                    ? "border-stone-500 ring-2 ring-stone-200"
                                                    : "border-stone-200 hover:border-stone-300"
                                            )}
                                        >
                                            <img src={presetAvatar} alt="Default" className="w-full h-full object-cover" />
                                        </button>
                                        <span className={cn(
                                            "text-xs font-medium transition-colors",
                                            formData.profileImageUrl === presetAvatar ? "text-stone-500" : "text-stone-300"
                                        )}>
                                            Default
                                        </span>
                                    </div>

                                    {/* 2. 랜덤 생성 옵션 */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => handleAvatarSelect(randomAvatar)}
                                                className={cn(
                                                    "w-16 h-16 rounded-full border-2 overflow-hidden transition-all hover:scale-105 bg-white",
                                                    formData.profileImageUrl === randomAvatar
                                                        ? "border-stone-500 ring-2 ring-stone-200"
                                                        : "border-stone-200 hover:border-stone-300"
                                                )}
                                            >
                                                {randomAvatar && <img src={randomAvatar} alt="Random" className="w-full h-full object-cover" />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    generateRandomAvatar();
                                                }}
                                                className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50 text-gray-600 transition-colors z-10"
                                                title="다른 랜덤 이미지 생성"
                                            >
                                                <Dices size={14} />
                                            </button>
                                        </div>
                                        <span className={cn(
                                            "text-xs font-medium transition-colors",
                                            formData.profileImageUrl === randomAvatar ? "text-stone-500" : "text-stone-300"
                                        )}>
                                            Random
                                        </span>
                                    </div>

                                    {/* 3. 커스텀 업로드 옵션 */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => uploadAvatar && handleAvatarSelect(uploadAvatar)}
                                                className={cn(
                                                    "w-16 h-16 flex items-center justify-center rounded-full border-2 overflow-hidden transition-all",
                                                    // 💡 업로드 전에는 점선, 업로드 후에는 다른 이미지들처럼 취급
                                                    !uploadAvatar
                                                        ? "border-dashed border-gray-300 bg-gray-50 cursor-default"
                                                        : "hover:scale-105",
                                                    uploadAvatar && formData.profileImageUrl === uploadAvatar
                                                        ? "border-stone-500 ring-2 ring-stone-200"
                                                        : (uploadAvatar ? "border-stone-200 hover:border-stone-300" : "")
                                                )}
                                            >
                                                {uploadAvatar ? (
                                                    <img src={uploadAvatar} alt="Upload" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={24} className="text-gray-400" />
                                                )}
                                            </button>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50 text-gray-600 transition-colors z-10"
                                                title="이미지 업로드"
                                            >
                                                <Upload size={14} />
                                            </button>
                                        </div>
                                        <span className={cn(
                                            "text-xs font-medium transition-colors",
                                            formData.profileImageUrl === uploadAvatar ? "text-stone-500" : "text-stone-300"
                                        )}>
                                            Upload
                                        </span>
                                    </div>

                                </div>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="placeholder:text-stone-300"
                                />
                            </Field>
                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirmPassword">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </Field>
                                </Field>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? "Creating Account..." : "Create Account"}
                                </Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>
                            <Field className="grid grid-cols-3 gap-4">
                                <Button
                                    className="bg-[#FEE500] hover:bg-[#FDD800] border-transparent"
                                    type="button"
                                    onClick={handleKakaoLogin}
                                >
                                    <img src="/icons/kakao.svg" alt="Kakao" className="w-4.5 h-4.5 object-contain" />
                                    <span className="sr-only">Login with Kakao</span>
                                </Button>
                                <Button
                                    className="bg-[#03C75A] hover:bg-[#02b350] border-transparent"
                                    type="button"
                                    onClick={() => alert("네이버 로그인은 준비 중입니다!")}
                                >
                                    <img src="/icons/naver.svg" alt="Naver" className="w-4 h-4 object-contain" />
                                    <span className="sr-only">Login with Naver</span>
                                </Button>
                                <Button
                                    className="bg-white hover:bg-gray-50 border border-gray-200"
                                    type="button"
                                    onClick={() => alert("구글 로그인은 준비 중입니다!")}
                                >
                                    <img src="/icons/google.svg" alt="Google" className="w-5 h-5 object-contain" />
                                    <span className="sr-only">Login with Google</span>
                                </Button>
                            </Field>
                            <FieldDescription className="text-center">
                                Already have an account? <a href="/login">Sign in</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                    <div className="relative hidden md:block bg-stone-200">
                        <img
                            src="/logo/apex-f1-logo.png"
                            alt="Apex F1 Logo"
                            className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}