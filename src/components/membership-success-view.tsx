"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/store/useUserStore";
import api from "@/lib/api/client";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { fetchUser } = useUserStore(); // 💡 fetchUser 가져오기
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const authKey = searchParams.get("authKey");
        const customerKey = searchParams.get("customerKey");
        const targetTier = searchParams.get("tier");

        if (!authKey || !customerKey || !targetTier) {
            setStatus("error");
            return;
        }

        const confirmSubscription = async () => {
            try {
                const token = localStorage.getItem("apex_access_token");
                await api.post("/api/v1/subscriptions",
                    {
                        authKey,
                        customerKey,
                        targetTier
                    },
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                setStatus("success");
                await fetchUser();

            } catch (error) {
                console.error("구독 승인 에러:", error);
                setStatus("error");
            }
        };

        confirmSubscription();
    }, [searchParams, fetchUser]);

    if (status === "loading") {
        return (
            <Card className="w-full text-center p-10 shadow-sm border-stone-200">
                <CardContent className="flex flex-col items-center pt-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stone-900 mb-6"></div>
                    <h2 className="text-xl font-bold text-stone-800">결제를 승인하고 있습니다...</h2>
                    <p className="text-stone-500 mt-2">잠시만 기다려주세요. 페이지를 닫지 마세요.</p>
                </CardContent>
            </Card>
        );
    }

    if (status === "error") {
        return (
            <Card className="w-full text-center p-10 shadow-sm border-red-200">
                <CardContent className="flex flex-col items-center pt-6">
                    <h1 className="text-2xl font-bold text-red-600 mb-3">결제 승인 실패</h1>
                    <p className="text-stone-600 mb-8">결제 처리 중 문제가 발생했습니다.</p>
                    <Button variant="outline" onClick={() => router.push("/membership")}>
                        멤버십 페이지로 돌아가기
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full text-center p-10 shadow-sm border-green-200">
            <CardContent className="flex flex-col items-center pt-6">
                <h1 className="text-3xl font-extrabold text-green-600 mb-3">구독 완료! 🎉</h1>
                <p className="text-stone-600 mb-8">이제 APEX의 더 강력한 기능들을 경험해 보세요.</p>
                <div className="flex justify-center gap-3">
                    <Button onClick={() => router.push("/")}>홈으로 이동</Button>
                    <Button variant="outline" onClick={() => router.push("/dashboard/agent/chat")}>
                        AI Agent 바로가기
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export function MembershipSuccessView() {
    return (
        <Suspense fallback={
            <Card className="w-full text-center p-10 shadow-sm">
                <CardContent className="pt-6 text-stone-500">로딩 중...</CardContent>
            </Card>
        }>
            <SuccessContent />
        </Suspense>
    );
}