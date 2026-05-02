"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Info, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Feature = {
    text: string;
    included: boolean;
};

type Plan = {
    name: string;
    description: string;
    priceMonthly: number;
    priceYearly: number;
    billedYearlyText: string;
    discount?: string;
    isPopular?: boolean;
    buttonText: string;
    buttonColorClass: string;
    features: Feature[];
    additionalFeatures: Feature[];
};

const plans: Plan[] = [
    {
        name: "Rookie",
        description: "가볍지만, 멋지게",
        priceMonthly: 0,
        priceYearly: 0,
        billedYearlyText: "Upgrade any time",
        buttonText: "Get started",
        buttonColorClass: "bg-black hover:bg-gray-800 text-white",
        features: [
            { text: "1 active project", included: true },
            { text: "3 MB upload limit", included: true },
            { text: "5,000 visitors /mo", included: true }
        ],
        additionalFeatures: [
            { text: "Remove Tiny Host banner", included: false },
            { text: "QR codes", included: false },
            { text: "Built-in Analytics", included: false }
        ]
    },
    {
        name: "Paddock",
        description: "놀라운 세계, 그 속으로",
        priceMonthly: 1900,
        priceYearly: 19900,
        billedYearlyText: "Billed at $60 /yr",
        discount: "13% off",
        buttonText: "Get started",
        buttonColorClass: "bg-[#007bff] hover:bg-[#0069d9] text-white",
        features: [
            { text: "1 active project", included: true },
            { text: "25 MB upload limit", included: true },
            { text: "10,000 visitors /mo", included: true }
        ],
        additionalFeatures: [
            { text: "Remove Tiny Host banner", included: true },
            { text: "QR codes", included: true },
            { text: "Built-in Analytics", included: true }
        ]
    },
    {
        name: "Garage",
        description: "더 넓은 시야, 더 넓은 경험",
        priceMonthly: 4900,
        priceYearly: 49900,
        billedYearlyText: "Billed at $156 /yr",
        discount: "15% off",
        isPopular: true,
        buttonText: "Get started",
        buttonColorClass: "bg-[#8a2be2] hover:bg-[#7a24cc] text-white",
        features: [
            { text: "5 active projects", included: true },
            { text: "75 MB upload limit", included: true },
            { text: "100,000 visitors /mo", included: true }
        ],
        additionalFeatures: [
            { text: "Everything in Tiny Plan", included: true },
            { text: "Custom domains", included: true },
            { text: "Edit mode", included: true },
            { text: "Password protection", included: true }
        ]
    },
    {
        name: "Pitwall",
        description: "막힘없이, 끊임없이, 최대로",
        priceMonthly: 9900,
        priceYearly: 79900,
        billedYearlyText: "Billed at $372 /yr",
        discount: "33% off",
        buttonText: "Get started",
        buttonColorClass: "bg-[#ffc107] hover:bg-[#e0a800] text-black",
        features: [
            { text: "Unlimited active projects", included: true },
            { text: "10 GB upload limit", included: true },
            { text: "500,000 visitors /mo", included: true }
        ],
        additionalFeatures: [
            { text: "Everything in Solo Plan", included: true },
            { text: "Capture emails", included: true },
            { text: "Add more team members", included: true }
        ]
    }
];

export function MembershipPlans() {
    const [isYearly, setIsYearly] = useState(true);

    const { user, isLoading, fetchUser } = useUserStore();
    const router = useRouter();

    const currentTier = user?.tier?.toUpperCase() || "ROOKIE";

    useEffect(() => {
        const token = localStorage.getItem("apex_access_token");
        if (token && (!user || user.nickname === "Guest")) {
            fetchUser();
        }
    }, [user, fetchUser]);

    const handleSubscribe = async (tierName: string) => {
        const targetTier = tierName.toUpperCase();

        if (targetTier === "ROOKIE") {
            router.push("/dashboard");
            return;
        }

        const token = localStorage.getItem("apex_access_token");
        if (!token) {
            alert("로그인이 필요합니다.");
            router.push("/login");
            return;
        }

        if (isLoading) {
            alert("유저 정보를 동기화 중입니다. 잠시만 기다려주세요.");
            return;
        }

        if (!user || user.nickname === "Guest" || !user.email) {
            alert("유저 정보를 불러올 수 없습니다. 다시 로그인해 주세요.");
            router.push("/login");
            return;
        }

        try {
            const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
            if (!clientKey) {
                console.error("토스 클라이언트 키 누락");
                return;
            }

            const tossPayments = await loadTossPayments(clientKey);

            // 토스 정책에 맞게 이메일에서 특수문자를 제거하여 고유 customerKey 생성
            const safeEmail = user.email.replace(/[^a-zA-Z0-9]/g, '');
            const customerKey = `customer_${safeEmail}_${Date.now()}`;

            // authKey는 결제 성공 시 토스가 successUrl 파라미터로 자동으로 붙여줍니다.
            tossPayments.requestBillingAuth("카드", {
                customerKey: customerKey,
                successUrl: `${window.location.origin}/membership/success?targetTier=${targetTier}`,
                failUrl: `${window.location.origin}/membership/fail`,
            });
        } catch (error) {
            console.error("결제창 호출 실패:", error);
            alert("결제창을 불러오는 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-12 space-y-4 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">Apex F1 Membership</h1>
                    <p className="text-muted-foreground text-lg text-balance">
                        Apex F1 멤버십을 구독하고, 더 놀라운 세상을 경험하세요
                    </p>
                </header>

                <div className="mb-12 text-center">
                    <div className="bg-muted inline-flex items-center rounded-full p-1">
                        <button
                            className={cn(
                                "rounded-full px-6 py-2 text-sm font-medium transition-colors",
                                !isYearly ? "bg-gray-200" : "text-muted-foreground"
                            )}
                            onClick={() => setIsYearly(false)}>
                            Monthly
                        </button>
                        <button
                            className={cn(
                                "rounded-full px-6 py-2 text-sm font-medium transition-colors",
                                isYearly ? "bg-black text-white" : "text-muted-foreground"
                            )}
                            onClick={() => setIsYearly(true)}>
                            Yearly
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {plans.map((plan) => {
                        const isCurrentPlan = currentTier === plan.name.toUpperCase();

                        return (
                            <div
                                key={plan.name}
                                className={cn(
                                    "bg-muted relative flex flex-col rounded-xl border p-6 border-stone-200",
                                    plan.isPopular && "border-2 border-[#8a2be2] shadow-xl"
                                )}>
                                {plan.isPopular && (
                                    <div
                                        className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#8a2be2] px-3 py-1 text-xs font-semibold text-white">
                                        Most Popular
                                    </div>
                                )}
                                <h2 className="mb-2 text-2xl font-semibold">{plan.name}</h2>
                                <p className="text-muted-foreground mb-4 text-sm">{plan.description}</p>

                                {/* 할인 배지 */}
                                {plan.discount && isYearly && (
                                    <div
                                        className={cn(
                                            "absolute top-6 right-6 rounded-full px-2 py-1 text-xs font-semibold",
                                            plan.name === "Paddock" && "bg-background text-[#007bff]",
                                            plan.name === "Garage" && "bg-background text-[#8a2be2]",
                                            plan.name === "Pitwall" && "bg-background text-[#ffc107]"
                                        )}>
                                        {plan.discount}
                                    </div>
                                )}

                                <div className="mb-6 flex items-baseline">
                                    <span className="text-4xl font-bold">
                                        ₩{plan.name === "Rookie" ? 0 : (isYearly ? plan.priceYearly : plan.priceMonthly).toLocaleString()}
                                    </span>
                                    <span className="text-muted-foreground text-xl">
                                        {plan.name === "Rookie" ? "" : isYearly ? "/년" : "/월"}
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-6 text-sm">
                                    {plan.name === "Rookie"
                                        ? plan.billedYearlyText
                                        : isYearly
                                            ? plan.billedYearlyText
                                            : "Billed monthly"}
                                </p>

                                <Button
                                    className={cn(
                                        "font-medium transition-all",
                                        isCurrentPlan
                                            ? "bg-stone-200 text-stone-500 opacity-80 cursor-not-allowed hover:bg-stone-200" // 현재 플랜일 때 회색/흐리게
                                            : plan.buttonColorClass
                                    )}
                                    onClick={() => handleSubscribe(plan.name)}
                                    disabled={isCurrentPlan || (isLoading && plan.name !== "Rookie")}
                                >
                                    {isLoading && plan.name !== "Rookie"
                                        ? "Loading..."
                                        : isCurrentPlan
                                            ? "Current Plan" // 현재 플랜이면 텍스트 변경
                                            : plan.buttonText}

                                    {/* 현재 플랜이 아닐 때만 화살표 표시 */}
                                    {!isCurrentPlan && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>

                                <div
                                    className="text-muted-foreground mt-4 mb-6 flex items-center justify-center text-xs">
                                    <Info className="mr-1 size-3" />
                                    <span>7-day money-back guarantee</span>
                                </div>

                                <div className="flex-grow">
                                    <ul className="text-muted-foreground space-y-3 text-left">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm">
                                                {feature.included ? (
                                                    <CheckCircle2
                                                        className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                                                ) : (
                                                    <XCircle className="mr-2 h-4 w-4 flex-shrink-0 text-red-500" />
                                                )}
                                                {feature.text}
                                            </li>
                                        ))}
                                    </ul>

                                    {plan.additionalFeatures.length > 0 && (
                                        <>
                                            <h3 className="mt-6 mb-3 text-sm font-semibold">Additional Features:</h3>
                                            <ul className="text-muted-foreground space-y-3 text-left">
                                                {plan.additionalFeatures.map((feature, index) => (
                                                    <li key={index} className="flex items-center text-sm">
                                                        {feature.included ? (
                                                            <CheckCircle2
                                                                className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                                                        ) : (
                                                            <XCircle
                                                                className="mr-2 h-4 w-4 flex-shrink-0 text-red-500" />
                                                        )}
                                                        {feature.text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}