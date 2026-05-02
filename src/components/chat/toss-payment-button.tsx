"use client";

import * as React from "react";
import { CreditCard, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadTossPayments } from "@tosspayments/payment-sdk";

interface TossPaymentButtonProps {
    tier: string;
    userEmail: string;
}

export function TossPaymentButton({ tier, userEmail }: TossPaymentButtonProps) {
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handlePayment = React.useCallback(async () => {
        const token = localStorage.getItem("apex_access_token");
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (!userEmail || userEmail === "Guest") {
            alert("유저 정보를 불러올 수 없습니다. 다시 로그인해 주세요.");
            return;
        }

        setIsProcessing(true);
        try {
            const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
            if (!clientKey) {
                throw new Error("토스 클라이언트 키가 설정되지 않았습니다.");
            }

            const tossPayments = await loadTossPayments(clientKey);
            const safeEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '');
            const customerKey = `customer_${safeEmail}_${Date.now()}`;
            const targetTier = tier.toUpperCase();

            await tossPayments.requestBillingAuth("카드", {
                customerKey: customerKey,
                successUrl: `${window.location.origin}/dashboard?paymentSuccess=true&targetTier=${targetTier}`,
                failUrl: `${window.location.origin}/membership/fail`,
            });
        } catch (error: any) {
            console.error("결제창 호출 실패:", error);
            alert(error.message || "결제창을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setIsProcessing(false);
        }
    }, [tier, userEmail]);

    return (
        <Card className="w-full max-w-sm border-stone-200 shadow-none">
            <CardHeader className="pb-2 pt-3 px-4">
                <div className="flex items-center gap-2">
                    <div className="size-7 rounded-md bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                        <CreditCard className="size-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold">멤버십 결제</p>
                            <Badge variant="secondary" className="text-[10px]">
                                {tier.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground">토스페이먼츠 안전 결제</p>
                    </div>
                </div>
            </CardHeader>
            <CardFooter className="pt-0 pb-3 px-4">
                {isProcessing ? (
                    <Button size="sm" disabled className="w-full gap-1.5 h-8">
                        <Loader2 className="size-3 animate-spin" />
                        결제창 여는 중...
                    </Button>
                ) : (
                    <Button size="sm" className="w-full gap-1.5 h-8" onClick={handlePayment}>
                        <CreditCard className="size-3" />
                        결제하기
                        <ArrowRight className="size-3" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
