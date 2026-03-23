"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Countdown } from "./countdown";
import { cn } from "@/lib/utils";

export default function ComingSoon() {
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
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Left Section */}
            <div
                className={cn(
                    "relative flex flex-1 flex-col",
                    "bg-[url(/grandprix/suzuka.jpg)] bg-cover bg-center",
                    "min-h-[40svh] lg:min-h-full"
                )}
            >
            </div>

            {/* Right Section */}
            <div className="relative flex flex-1 flex-col items-center bg-stone-50 p-8 lg:p-12">

                <div className="flex flex-col items-center space-y-16 text-center mt-24 lg:mt-40 w-full">
                    <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
                        <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight lg:text-5xl">
                            Ready for Suzuka?
                        </h1>
                        <p className="text-stone-500 lg:text-lg max-w-md mt-5 leading-relaxed">
                            스즈카 그랑프리는 Apex F1과 함께
                        </p>
                    </div>

                    {/* 타이머 컴포넌트 */}
                    <Countdown />

                    {/* 로그인한 사용자는 안 보이게, 미로그인 사용자에게만 Go to Login 표시 */}
                    {mounted && !isLoggedIn && (
                        <div className="w-full flex flex-col items-center pt-4">
                            <Button
                                asChild
                                variant="ghost"
                                className="text-stone-500 hover:text-stone-900 hover:bg-transparent text-base"
                            >
                                <Link href="/login">
                                    Go to Login <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}