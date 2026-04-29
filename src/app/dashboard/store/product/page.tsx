import { GoodsProduct } from "@/components/goods-product";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Store | Apex-F1",
    description: "Apex-F1 Original Goods and Marketplace",
};

export default function StorePage() {
    return (
        <div className="flex-1">
            <GoodsProduct />
        </div>
    );
}