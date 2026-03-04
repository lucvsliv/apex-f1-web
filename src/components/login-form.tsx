"use client";

import { useState } from "react";
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
import { useUserStore } from "@/store/useUserStore"; // 💡 Zustand 스토어 임포트

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const router = useRouter();
    const { fetchUser } = useUserStore(); // 💡 글로벌 유저 상태 업데이트 함수 가져오기

    // 폼 상태 관리
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
        setErrorMsg(""); // 입력 시 기존 에러 메시지 초기화
    };

    // 💡 일반 이메일 로그인 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setErrorMsg("이메일과 비밀번호를 모두 입력해주세요.");
            return;
        }

        try {
            setIsLoading(true);
            setErrorMsg("");

            // 1. 백엔드 로그인 API 호출
            const response = await api.post("/v1/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            // 2. 응답받은 JWT 토큰을 localStorage에 저장
            localStorage.setItem("apex_access_token", response.data.accessToken);

            // 3. Zustand 스토어를 통해 유저 정보 최신화 (사이드바 등 전역 상태 업데이트)
            await fetchUser();

            // 4. 로그인 성공 후 대시보드로 이동
            router.push("/dashboard");

        } catch (error: any) {
            // 401 Unauthorized 에러 처리 (비밀번호 틀림, 없는 계정 등)
            if (error.response?.status === 401) {
                setErrorMsg("이메일 또는 비밀번호가 올바르지 않습니다.");
            } else if (error.response?.status === 400) {
                setErrorMsg(error.response?.data || "소셜 로그인으로 가입된 계정일 수 있습니다.");
            } else {
                setErrorMsg("로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
            }
            console.error("Login Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 소셜(카카오) 로그인 핸들러
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
                    await fetchUser(); // 소셜 로그인 성공 시에도 유저 정보 업데이트
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
                    {/* 💡 form 태그에 onSubmit 연결 */}
                    <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Login to your Apex F1 account
                                </p>
                            </div>

                            {/* 에러 메시지 표시 영역 */}
                            {errorMsg && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md text-center">
                                    {errorMsg}
                                </div>
                            )}

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="apex@apexf1.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="placeholder:text-stone-400/70"
                                />
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline text-muted-foreground"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="placeholder:text-stone-400/70"
                                    placeholder="••••••••"
                                />
                            </Field>

                            <Field>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? "Logging in..." : "Login"}
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
                                Don't have an account? <a href="/signup" className="underline underline-offset-4">Sign up</a>
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
        </div>
    );
}