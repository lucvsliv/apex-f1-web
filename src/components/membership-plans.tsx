"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function MembershipPlans() {
    // 💡 사이드바처럼 isLoading과 fetchUser를 모두 가져옵니다.
    const { user, isLoading, fetchUser } = useUserStore();
    const router = useRouter();

    // 💡 마운트 시 토큰이 있는데 유저 데이터가 Guest라면 API를 찔러서 복구합니다.
    useEffect(() => {
        const token = localStorage.getItem("apex_access_token");
        if (token && (!user || user.nickname === "Guest")) {
            fetchUser();
        }
    }, [user, fetchUser]);

    const handleSubscribe = async (tier: string) => {
        const token = localStorage.getItem("apex_access_token");

        if (!token) {
            alert("로그인이 필요합니다.");
            router.push("/login");
            return;
        }

        // 💡 데이터를 아직 가져오는 중일 때의 방어
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

            const safeEmail = user.email.replace(/[^a-zA-Z0-9]/g, '');
            const customerKey = `customer_${safeEmail}_${Date.now()}`;

            tossPayments.requestBillingAuth("카드", {
                customerKey: customerKey,
                successUrl: `${window.location.origin}/membership/success?tier=${tier}`,
                failUrl: `${window.location.origin}/membership/fail`,
            });
        } catch (error) {
            console.error("결제창 호출 실패:", error);
            alert("결제창을 불러오는 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-3">APEX 멤버십 업그레이드</h1>
                <p className="text-stone-500">더 빠르고 강력한 F1 데이터 분석 플랜을 선택하세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {/* PADDOCK */}
                <Card className="flex flex-col items-center text-center p-6 border-stone-200 shadow-sm">
                    <CardContent className="p-0 flex flex-col items-center w-full">
                        <h2 className="text-xl font-bold mb-2">PADDOCK</h2>
                        <p className="text-stone-500 text-sm h-10 mb-4">일일 AI 질문 50회<br/>과거 경기 상세 분석</p>
                        <p className="text-2xl font-bold mb-6">₩9,900<span className="text-sm font-normal text-stone-500"> / 월</span></p>
                        <Button variant="outline" className="w-full" onClick={() => handleSubscribe("PADDOCK")} disabled={isLoading}>
                            {isLoading ? "로딩 중..." : "시작하기"}
                        </Button>
                    </CardContent>
                </Card>

                {/* GARAGE */}
                <Card className="flex flex-col items-center text-center p-6 border-2 border-blue-600 shadow-md relative transform md:-translate-y-2">
                    <div className="absolute top-0 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        인기 플랜
                    </div>
                    <CardContent className="p-0 flex flex-col items-center w-full mt-2">
                        <h2 className="text-xl font-bold text-blue-700 mb-2">GARAGE</h2>
                        <p className="text-stone-600 text-sm h-10 mb-4">일일 AI 질문 200회<br/>심층 기술 분석 우선 처리</p>
                        <p className="text-2xl font-bold text-blue-900 mb-6">₩19,900<span className="text-sm font-normal text-stone-500"> / 월</span></p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleSubscribe("GARAGE")} disabled={isLoading}>
                            {isLoading ? "로딩 중..." : "시작하기"}
                        </Button>
                    </CardContent>
                </Card>

                {/* PITWALL */}
                <Card className="flex flex-col items-center text-center p-6 border-stone-200 shadow-sm bg-stone-900 text-white">
                    <CardContent className="p-0 flex flex-col items-center w-full">
                        <h2 className="text-xl font-bold text-white mb-2">PITWALL</h2>
                        <p className="text-stone-400 text-sm h-10 mb-4">AI 질문 무제한<br/>실시간 우승 확률 예측</p>
                        <p className="text-2xl font-bold mb-6">₩39,900<span className="text-sm font-normal text-stone-400"> / 월</span></p>
                        <Button className="w-full bg-white text-stone-900 hover:bg-stone-200" onClick={() => handleSubscribe("PITWALL")} disabled={isLoading}>
                            {isLoading ? "로딩 중..." : "시작하기"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}