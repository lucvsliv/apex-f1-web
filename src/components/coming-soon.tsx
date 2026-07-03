"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Countdown } from "./countdown";
import { cn, formatGrandPrixId, formatGpName } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import api from "@/lib/api/client";
import { Schedule } from "@/types/schedule";

export default function ComingSoon() {
    const { t, language } = useLanguage();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [targetDate, setTargetDate] = useState<Date | null>(null);
    const [nextRace, setNextRace] = useState<Schedule | null>(null);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("apex_access_token");
        if (token) {
            setIsLoggedIn(true);
        }

        const fetchNextRace = async () => {
            try {
                const year = new Date().getFullYear() > 2026 ? new Date().getFullYear() : 2026;
                const response = await api.get(`/races/schedules?year=${year}`);
                const schedules: Schedule[] = response.data;
                
                const now = new Date();
                let nextTarget: Date | null = null;
                let foundRace: Schedule | null = null;

                for (const schedule of schedules) {
                    const raceSession = schedule.sessions.find(s => s.name.toLowerCase() === "race" || s.name.toLowerCase() === "레이스");
                    if (raceSession) {
                        const raceDate = new Date(raceSession.time);
                        if (raceDate > now) {
                            nextTarget = raceDate;
                            foundRace = schedule;
                            break;
                        }
                    }
                }
                
                if (nextTarget && foundRace) {
                    setTargetDate(nextTarget);
                    setNextRace(foundRace);
                } else {
                    setTargetDate(new Date("2026-07-12T22:00:00+09:00"));
                }
            } catch (error) {
                console.error("Failed to fetch next race:", error);
                setTargetDate(new Date("2026-07-12T22:00:00+09:00"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchNextRace();
    }, []);

    if (!mounted || isLoading) {
        return (
            <div className="relative flex flex-col min-h-screen bg-stone-50 items-center justify-center">
                <p className="text-stone-500 font-medium">{t("common.loading")}</p>
            </div>
        );
    }

    const gpName = nextRace 
        ? (nextRace.grandPrixId ? formatGrandPrixId(nextRace.grandPrixId, language) : formatGpName(nextRace.name, language))
        : (language === 'ko' ? "오스트리아 그랑프리" : "Austrian Grand Prix");

    const bgImageName = nextRace
        ? (nextRace.grandPrixId 
            ? nextRace.grandPrixId.replace(/[-_]/g, '').toLowerCase() 
            : nextRace.name.replace(/[^a-zA-Z]/g, '').toLowerCase())
        : 'austria';

    return (
        <div className="relative flex flex-col min-h-screen">
            {/* Full Screen Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(/grandprix/${bgImageName}.jpg)` }}
            />

            {/* Top White Gradient Overlay for Text Readability */}
            <div className="absolute inset-x-0 top-0 h-[60vh] md:h-[50vh] bg-gradient-to-b from-stone-50/80 via-stone-50/40 to-transparent z-0 pointer-events-none" />

            {/* Top Section (Text & Timer) */}
            <div className="relative z-10 flex flex-col items-center pt-16 pb-12 px-4 w-full">
                <div className="flex flex-col items-center space-y-4 text-center mb-8">
                    <p className="text-stone-600 lg:text-lg max-w-md mb-0 leading-relaxed font-medium">
                        {t("coming.soon.title1", { gpName })}
                    </p>
                    <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight lg:text-5xl drop-shadow-sm">
                        {t("coming.soon.title2", { gpName })}
                    </h1>
                </div>

                {/* 타이머 컴포넌트 */}
                <div className="w-full max-w-[600px] overflow-hidden mb-6">
                    {targetDate && <Countdown targetDate={targetDate} />}
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