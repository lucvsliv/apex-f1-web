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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useRouter } from "next/navigation";
import Script from "next/script";
import api from "@/lib/api/client";
import { Upload, Dices, User, CheckCircle2 } from "lucide-react";

export function SignupForm({
                               className,
                               ...props
                           }: React.ComponentProps<"div">) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [apiError, setApiError] = useState("");

    const [nicknameStatus, setNicknameStatus] = useState<"idle" | "checking" | "available" | "duplicate" | "error">("idle");
    const [otp, setOtp] = useState("");
    const [otpStatus, setOtpStatus] = useState<"idle" | "sent" | "verified" | "error">("idle");

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
        setApiError("");

        if (id === "nickname") {
            setNicknameStatus("idle");
        }
        if (id === "email") {
            setOtpStatus("idle");
            setOtp("");
        }
    };

    const handleNicknameCheck = async () => {
        if (!formData.nickname.trim()) return;

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

    const handleSendOtp = async () => {
        if (!formData.email) return;
        try {
            await api.post("/auth/email/send", { email: formData.email });
            setOtpStatus("sent");
        } catch (error) {
            console.error("이메일 발송 에러:", error);
            alert("이메일 발송에 실패했습니다. 이메일 형식을 확인해 주세요.");
        }
    };

    const handleVerifyOtp = async () => {
        try {
            await api.post("/auth/email/verify", { 
                email: formData.email, 
                otp: otp 
            });
            setOtpStatus("verified");
        } catch (error) {
            setOtpStatus("error");
        }
    };

    const handleAvatarSelect = (url: string | null) => {
        if (url) {
            setFormData((prev) => ({ ...prev, profileImageUrl: url }));
        }
    };

    const generateRandomAvatar = () => {
        const seed = Math.random().toString(36).substring(7);
        const newRandomUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;
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

    const isPasswordLongEnough = formData.password.length >= 8;
    const isPasswordTooShort = formData.password.length > 0 && !isPasswordLongEnough;
    const isPasswordMismatch = formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;
    const isPasswordMatchSuccess = formData.confirmPassword.length > 0 && isPasswordLongEnough && formData.password === formData.confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isPasswordTooShort || isPasswordMismatch) return;

        if (nicknameStatus !== "available") {
            setApiError("닉네임 중복 확인을 진행해 주세요.");
            return;
        }

        if (otpStatus !== "verified") {
            setApiError("이메일 인증을 완료해 주세요.");
            return;
        }

        try {
            setIsLoading(true);
            setApiError("");
            await api.post("/auth/signup", {
                email: formData.email,
                nickname: formData.nickname,
                password: formData.password,
                profileImageUrl: formData.profileImageUrl,
            });
            setIsSuccess(true);
        } catch (error: any) {
            if (error.response?.status === 409) {
                setApiError("이미 사용 중인 이메일 또는 닉네임입니다.");
            } else {
                setApiError("회원가입에 실패했습니다. 다시 시도해 주세요.");
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

            <Card className="overflow-hidden p-0 border-stone-200">
                <CardContent className="grid p-0 md:grid-cols-2 min-h-[600px]">
                    {isSuccess ? (
                        <div className="flex flex-col justify-center items-center p-6 md:p-8 text-center animate-in fade-in zoom-in duration-500">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
                            <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome!</h2>
                            <p className="text-muted-foreground text-2xl mb-12 leading-relaxed">
                                <span className="font-semibold text-stone-900">{formData.nickname}</span>님, 환영합니다!<br/>
                            </p>
                            <p className="text-muted-foreground text-base mb-15 leading-relaxed">
                                회원가입이 성공적으로 완료되었습니다.<br/>
                                로그인하여 Apex F1을 경험하세요.
                            </p>
                            <Button
                                size="lg"
                                className="w-full max-w-sm"
                                onClick={() => router.push("/login")}
                            >
                                로그인하러 가기
                            </Button>
                        </div>
                    ) : (
                        <form className="p-6 md:p-8 flex flex-col justify-center" onSubmit={handleSubmit}>
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold">계정 만들기</h1>
                                    <p className="text-muted-foreground text-sm text-balance">
                                        Apex F1 Agent에 가입하고 데이터를 탐색하세요
                                    </p>
                                </div>

                                {apiError && (
                                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md text-center">
                                        {apiError}
                                    </div>
                                )}

                                <Field>
                                    <FieldLabel htmlFor="nickname">닉네임</FieldLabel>
                                    <div className="flex gap-2 items-start">
                                        <div className="flex-1 flex flex-col gap-1">
                                            <Input
                                                id="nickname"
                                                type="text"
                                                placeholder="닉네임을 입력하세요"
                                                required
                                                value={formData.nickname}
                                                onChange={handleChange}
                                                className={cn(
                                                    "w-full placeholder:text-stone-300",
                                                    nicknameStatus === "available" && "border-blue-400 focus-visible:ring-blue-400",
                                                    nicknameStatus === "duplicate" && "border-red-400 focus-visible:ring-red-400"
                                                )}
                                            />
                                            {nicknameStatus === "available" && <span className="text-xs font-medium text-blue-400">사용 가능한 닉네임입니다.</span>}
                                            {nicknameStatus === "duplicate" && <span className="text-xs font-medium text-red-400">이미 사용 중인 닉네임입니다.</span>}
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleNicknameCheck}
                                            disabled={!formData.nickname || nicknameStatus === "checking" || nicknameStatus === "available"}
                                            className={cn(
                                                "shrink-0 transition-colors",
                                                (nicknameStatus === "idle" || nicknameStatus === "checking") &&
                                                "border-stone-300 text-stone-500 hover:bg-stone-100 hover:text-stone-800",

                                                nicknameStatus === "duplicate" &&
                                                "border-red-400 text-red-400 border-stone-300 text-stone-500",

                                                nicknameStatus === "available" &&
                                                "border-blue-400 text-blue-400 border-stone-300 text-stone-500"
                                            )}
                                        >
                                            {nicknameStatus === "checking" ? "확인 중..." : "중복확인"}
                                        </Button>
                                    </div>
                                </Field>

                                <Field>
                                    <FieldLabel>프로필 이미지</FieldLabel>
                                    <div className="flex gap-8 items-end mt-2">

                                        <div className="flex flex-col items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handleAvatarSelect(presetAvatar)}
                                                className={cn(
                                                    "w-16 h-16 rounded-full border-2 overflow-hidden transition-all hover:scale-105",
                                                    formData.profileImageUrl !== presetAvatar && "opacity-40 grayscale-[30%] hover:opacity-100",
                                                    formData.profileImageUrl === presetAvatar
                                                        ? "border-stone-400 ring-2 ring-stone-200"
                                                        : "border-stone-200 hover:border-stone-300"
                                                )}
                                            >
                                                <img src={presetAvatar} alt="Default" className="w-full h-full object-cover" />
                                            </button>
                                            <span className={cn(
                                                "text-xs font-medium transition-colors",
                                                formData.profileImageUrl === presetAvatar ? "text-stone-500" : "text-stone-300"
                                            )}>
                                                기본
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAvatarSelect(randomAvatar)}
                                                    className={cn(
                                                        "w-16 h-16 rounded-full border-2 overflow-hidden transition-all hover:scale-105 bg-white",
                                                        formData.profileImageUrl !== randomAvatar && "opacity-40 grayscale-[30%] hover:opacity-100",
                                                        formData.profileImageUrl === randomAvatar
                                                            ? "border-stone-400 ring-2 ring-stone-200"
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
                                                    className="absolute -bottom-1 -right-1 bg-white border border-stone-200 rounded-full p-1.5 shadow-sm hover:bg-stone-50 text-stone-600 transition-colors z-20 opacity-100"
                                                    title="다른 랜덤 이미지 생성"
                                                >
                                                    <Dices size={14} />
                                                </button>
                                            </div>
                                            <span className={cn(
                                                "text-xs font-medium transition-colors",
                                                formData.profileImageUrl === randomAvatar ? "text-stone-500" : "text-stone-300"
                                            )}>
                                                랜덤
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => uploadAvatar && handleAvatarSelect(uploadAvatar)}
                                                    className={cn(
                                                        "w-16 h-16 flex items-center justify-center rounded-full border-2 overflow-hidden transition-all",
                                                        !uploadAvatar
                                                            ? "border-dashed border-stone-300 bg-stone-50 cursor-default"
                                                            : "hover:scale-105",
                                                        uploadAvatar && formData.profileImageUrl !== uploadAvatar && "opacity-40 grayscale-[30%] hover:opacity-100",
                                                        uploadAvatar && formData.profileImageUrl === uploadAvatar
                                                            ? "border-stone-400 ring-2 ring-stone-200"
                                                            : (uploadAvatar ? "border-stone-200 hover:border-stone-300" : "")
                                                    )}
                                                >
                                                    {uploadAvatar ? (
                                                        <img src={uploadAvatar} alt="Upload" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={24} className="text-stone-400" />
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
                                                    className="absolute -bottom-1 -right-1 bg-white border border-stone-200 rounded-full p-1.5 shadow-sm hover:bg-stone-50 text-stone-500 transition-colors z-20 opacity-100"
                                                    title="이미지 업로드"
                                                >
                                                    <Upload size={14} />
                                                </button>
                                            </div>
                                            <span className={cn(
                                                "text-xs font-medium transition-colors",
                                                formData.profileImageUrl === uploadAvatar ? "text-stone-500" : "text-stone-300"
                                            )}>
                                                업로드
                                            </span>
                                        </div>
                                    </div>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">이메일</FieldLabel>
                                    <div className="flex gap-2 items-start">
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="example@example.com"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={otpStatus === "verified"}
                                            className={cn(
                                                "placeholder:text-stone-300 flex-1",
                                                otpStatus === "verified" && "bg-stone-50 border-blue-400 focus-visible:ring-blue-400 text-stone-500"
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleSendOtp}
                                            disabled={!formData.email || otpStatus === "verified"}
                                            className={cn(
                                                "shrink-0 transition-colors",
                                                otpStatus === "verified"
                                                    ? "border-blue-400 text-blue-400 border-stone-300 text-stone-500"
                                                    : "border-stone-300 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                                            )}
                                        >
                                            {otpStatus === "sent" ? "재전송" : (otpStatus === "verified" ? "인증완료" : "인증요청")}
                                        </Button>
                                    </div>
                                </Field>

                                {(otpStatus === "sent" || otpStatus === "error") && (
                                    <Field>
                                        <div className="flex gap-2 items-start">
                                            <div className="flex-1 flex flex-col gap-1">
                                                <InputOTP 
                                                    maxLength={6} 
                                                    value={otp} 
                                                    onChange={(val) => {
                                                        setOtp(val);
                                                        if (otpStatus === "error") setOtpStatus("sent");
                                                    }}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} className={cn(otpStatus === "error" && "border-red-400 focus-visible:ring-red-400 text-red-500")} />
                                                        <InputOTPSlot index={1} className={cn(otpStatus === "error" && "border-red-400 focus-visible:ring-red-400 text-red-500")} />
                                                        <InputOTPSlot index={2} className={cn(otpStatus === "error" && "border-red-400 focus-visible:ring-red-400 text-red-500")} />
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={3} className={cn(otpStatus === "error" && "border-red-400 focus-visible:ring-red-400 text-red-500")} />
                                                        <InputOTPSlot index={4} className={cn(otpStatus === "error" && "border-red-400 focus-visible:ring-red-400 text-red-500")} />
                                                        <InputOTPSlot index={5} className={cn(otpStatus === "error" && "border-red-400 focus-visible:ring-red-400 text-red-500")} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                                {otpStatus === "error" && <span className="text-xs font-medium text-red-400">인증번호가 일치하지 않습니다.</span>}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={handleVerifyOtp}
                                                disabled={otp.length !== 6}
                                                className="shrink-0 bg-stone-100 text-stone-700 hover:bg-stone-200"
                                            >
                                                확인
                                            </Button>
                                        </div>
                                    </Field>
                                )}

                                <Field>
                                    <Field className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                                            <Input
                                                id="password"
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={cn(isPasswordTooShort && "border-red-400 focus-visible:ring-red-400")}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="confirmPassword">
                                                비밀번호 확인
                                            </FieldLabel>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className={cn(
                                                    isPasswordMismatch && "border-red-400 focus-visible:ring-red-400",
                                                    isPasswordMatchSuccess && "border-blue-400 focus-visible:ring-blue-400"
                                                )}
                                            />
                                        </Field>
                                    </Field>

                                    <div className="flex flex-col gap-1 mt-1">
                                        {isPasswordTooShort && (
                                            <span className="text-xs font-medium text-red-400">비밀번호는 8자리 이상이어야 합니다.</span>
                                        )}
                                        {isPasswordMismatch && (
                                            <span className="text-xs font-medium text-red-400">비밀번호가 일치하지 않습니다.</span>
                                        )}
                                        {isPasswordMatchSuccess && (
                                            <span className="text-xs font-medium text-blue-400">비밀번호가 안전하게 일치합니다.</span>
                                        )}
                                        {!isPasswordTooShort && !isPasswordMismatch && !isPasswordMatchSuccess && (
                                            <FieldDescription>최소 8자 이상이어야 합니다.</FieldDescription>
                                        )}
                                    </div>
                                </Field>

                                <Field>
                                    <Button
                                        type="submit"
                                        disabled={isLoading || isPasswordTooShort || isPasswordMismatch || nicknameStatus !== "available" || otpStatus !== "verified"}
                                        className="w-full"
                                    >
                                        {isLoading ? "계정 생성 중..." : "계정 생성"}
                                    </Button>
                                </Field>
                                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                    또는 다음 계정으로 계속하기
                                </FieldSeparator>
                                <Field className="grid grid-cols-3 gap-4">
                                    <Button
                                        className="bg-[#FEE500] hover:bg-[#FDD800] border-transparent"
                                        type="button"
                                        onClick={handleKakaoLogin}
                                    >
                                        <img src="/icons/kakao.svg" alt="Kakao" className="w-4.5 h-4.5 object-contain" />
                                        <span className="sr-only">카카오로 로그인</span>
                                    </Button>
                                    <Button
                                        className="bg-[#03C75A] hover:bg-[#02b350] border-transparent"
                                        type="button"
                                        onClick={() => alert("네이버 로그인은 준비 중입니다!")}
                                    >
                                        <img src="/icons/naver.svg" alt="Naver" className="w-4 h-4 object-contain" />
                                        <span className="sr-only">네이버로 로그인</span>
                                    </Button>
                                    <Button
                                        className="bg-white hover:bg-stone-50 border border-stone-200"
                                        type="button"
                                        onClick={() => alert("구글 로그인은 준비 중입니다!")}
                                    >
                                        <img src="/icons/google.svg" alt="Google" className="w-5 h-5 object-contain" />
                                        <span className="sr-only">구글로 로그인</span>
                                    </Button>
                                </Field>
                                <FieldDescription className="text-center">
                                    이미 계정이 있으신가요? <a href="/login">로그인</a>
                                </FieldDescription>
                            </FieldGroup>
                        </form>
                    )}

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
                계속하기를 클릭하면 <a href="#">서비스 이용약관</a> 및 <a href="#">개인정보 처리방침</a>에 동의하게 됩니다.
            </FieldDescription>
        </div>
    );
}