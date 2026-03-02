"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useRouter } from "next/navigation";
import Script from "next/script";
import api from "@/lib/api/client";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const router = useRouter();

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
            {/* 카카오 SDK 로드 */}
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
                    <form className="p-6 md:p-8" onSubmit={(e) => e.preventDefault()}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome</h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your Apex F1 account
                                </p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="apex@apexf1.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" required />
                            </Field>
                            <Field>
                                <Button type="submit">Login</Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>
                            <Field className="grid grid-cols-3 gap-4">
                                {/* 1. 카카오 로그인 버튼 */}
                                <Button
                                    className="bg-[#FEE500] hover:bg-[#FDD800] border-transparent"
                                    type="button"
                                    onClick={handleKakaoLogin}
                                >
                                    {/* 💡 직접 만든 SVG 파일 경로 지정, 크기는 w-5 h-5로 고정 */}
                                    <img src="/icons/kakao.svg" alt="Kakao" className="w-4.5 h-4.5 object-contain" />
                                    <span className="sr-only">Login with Kakao</span>
                                </Button>

                                {/* 2. 네이버 로그인 버튼 */}
                                <Button
                                    className="bg-[#03C75A] hover:bg-[#02b350] border-transparent"
                                    type="button"
                                    onClick={() => alert("네이버 로그인은 준비 중입니다!")}
                                >
                                    <img src="/icons/naver.svg" alt="Naver" className="w-4 h-4 object-contain" />
                                    <span className="sr-only">Login with Naver</span>
                                </Button>

                                {/* 3. 구글 로그인 버튼 */}
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
                                Don&apos;t have an account? <a href="/signup">Sign up</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    {/* 오른쪽 이미지 영역 */}
                    <div className="relative hidden md:block bg-gradient-to-br from-stone-100 via-neutral-300 to-stone-500">
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
    )
}