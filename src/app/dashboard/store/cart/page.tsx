import { Metadata } from "next";
import Cart from "@/components/cart";

export const metadata: Metadata = {
    title: "Cart | Apex-F1",
    description: "Your shopping cart",
};

export default function CartPage() {
    return (
        <div className="flex-1">
            <Cart />
        </div>
    );
}