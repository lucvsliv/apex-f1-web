"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, CreditCard, CheckCircle2, Loader2, Package, Plus, Minus } from "lucide-react"

interface ProductCheckoutPayload {
    productName: string
    price: number
    imageUrl: string
    quantity: number
}

export function ProductCheckoutCard({ payload }: { payload: ProductCheckoutPayload }) {
    const [status, setStatus] = useState<"ready" | "processing" | "ordered">("ready")
    const [quantity, setQuantity] = useState(payload.quantity)

    const handleCheckout = () => {
        setStatus("processing")
        // TODO: 실제 결제 프로세스 호출 (Toss Payments 연동)
        setTimeout(() => {
            setStatus("ordered")
        }, 2000)
    }

    const totalPrice = payload.price * quantity

    return (
        <Card className="w-full max-w-sm border-stone-200 shadow-none">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <ShoppingCart className="size-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold">상품 구매 요청</p>
                        <Badge variant="secondary" className="text-[10px] mt-0.5">
                            Original Goods
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <div className="flex gap-3 items-start">
                    <div className="size-16 rounded-lg bg-white flex items-center justify-center shrink-0 border border-stone-200 overflow-hidden">
                        {payload.imageUrl && !payload.imageUrl.includes("placeholder") ? (
                            <img src={payload.imageUrl} alt={payload.productName} className="size-full object-contain p-1" />
                        ) : (
                            <Package className="size-6 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                        <p className="text-sm font-medium">{payload.productName}</p>
                        <p className="text-sm text-primary font-semibold">
                            ₩{payload.price.toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                size="icon"
                                variant="outline"
                                className="size-6 rounded-md"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={status !== "ready"}
                            >
                                <Minus className="size-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                            <Button
                                size="icon"
                                variant="outline"
                                className="size-6 rounded-md"
                                onClick={() => setQuantity(quantity + 1)}
                                disabled={status !== "ready"}
                            >
                                <Plus className="size-3" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">합계</span>
                    <span className="text-base font-bold">₩{totalPrice.toLocaleString()}</span>
                </div>
            </CardContent>
            <CardFooter>
                {status === "ready" && (
                    <Button size="sm" className="w-full gap-1.5" onClick={handleCheckout}>
                        <CreditCard className="size-3" />
                        결제하기
                    </Button>
                )}
                {status === "processing" && (
                    <Button size="sm" disabled className="w-full gap-1.5">
                        <Loader2 className="size-3 animate-spin" />
                        결제 처리 중...
                    </Button>
                )}
                {status === "ordered" && (
                    <Button size="sm" variant="outline" disabled className="w-full gap-1.5 text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                        <CheckCircle2 className="size-3" />
                        주문 완료!
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
