"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Countdown } from "./countdown";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

export default function ComingSoon() {
    const { t } = useLanguage();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("apex_access_token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <div className="relative flex flex-col min-h-screen">
            {/* Full Screen Background Image */}
            <div
                className={cn(
                    "absolute inset-0 z-0",
                    "bg-[url(/grandprix/austria.jpg)] bg-cover bg-center"
                )}
            />

            {/* Top White Gradient Overlay for Text Readability */}
            <div className="absolute inset-x-0 top-0 h-[60vh] md:h-[50vh] bg-gradient-to-b from-stone-50/80 via-stone-50/40 to-transparent z-0 pointer-events-none" />

            {/* Top Section (Text & Timer) */}
            <div className="relative z-10 flex flex-col items-center pt-16 pb-12 px-4 w-full">
                <div className="flex flex-col items-center space-y-4 text-center mb-8">
                    <p className="text-stone-600 lg:text-lg max-w-md mb-0 leading-relaxed font-medium">
                        {t("coming.soon.title1")}
                    </p>
                    <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight lg:text-5xl drop-shadow-sm">
                        {t("coming.soon.title2")}
                    </h1>
                </div>

                {/* 타이머 컴포넌트 */}
                <div className="w-full max-w-[600px] overflow-hidden mb-6">
                    <Countdown />
                </div>

                {/* 미로그인 사용자에게만 Go to Login 표시 */}
                {mounted && !isLoggedIn && (
                    <div className="w-full flex flex-col items-center">
                        <Button
                            asChild
                            variant="ghost"
                            className="text-stone-600 hover:text-stone-900 hover:bg-white/50 text-base font-medium transition-colors"
                        >
                            <Link href="/login">
                                {t("coming.soon.login")} <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>

            {/* Empty space below to show the background image */}
            <div className="relative flex-1 z-0 pointer-events-none" />
        </div>
    );
}