"use client";

import { useState, useEffect } from "react";
import type { JSX } from "react/jsx-runtime";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }
    return timeLeft;
};

import { useLanguage } from "@/contexts/language-context";
import { Schedule } from "@/types/schedule";
import api from "@/lib/api/client";

export function Countdown() {
    const { t } = useLanguage();
    const [targetDate, setTargetDate] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchNextRace = async () => {
            try {
                const year = new Date().getFullYear() > 2026 ? new Date().getFullYear() : 2026;
                const response = await api.get(`/races/schedules?year=${year}`);
                const schedules: Schedule[] = response.data;
                
                const now = new Date();
                let nextTarget: Date | null = null;

                for (const schedule of schedules) {
                    const raceSession = schedule.sessions.find(s => s.name.toLowerCase() === "race" || s.name.toLowerCase() === "레이스");
                    if (raceSession) {
                        const raceDate = new Date(raceSession.time);
                        if (raceDate > now) {
                            nextTarget = raceDate;
                            break;
                        }
                    }
                }
                
                if (nextTarget) {
                    setTargetDate(nextTarget);
                } else {
                    setTargetDate(new Date("2026-07-12T22:00:00+09:00"));
                }
            } catch (error) {
                console.error("Failed to fetch next race:", error);
                setTargetDate(new Date("2026-07-12T22:00:00+09:00"));
            }
        };

        fetchNextRace();
    }, []);

    useEffect(() => {
        if (!targetDate) return;
        setTimeLeft(calculateTimeLeft(targetDate));
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    // 클라이언트 렌더링 전이거나 targetDate가 아직 없으면 아무것도 보여주지 않음
    if (!mounted || !targetDate) return null;

    const timerComponents: JSX.Element[] = [];

    Object.keys(timeLeft).forEach((interval) => {
        const value = timeLeft[interval as keyof TimeLeft];
        timerComponents.push(
            <div key={interval} className="flex flex-col items-center">
                <span className="text-5xl font-extrabold text-stone-800 tracking-tight">
                  {value < 10 ? `0${value}` : value}
                </span>
                <span className="text-xs uppercase text-stone-800 font-semibold tracking-widest mt-2">
                  {t(`countdown.${interval}`)}
                </span>
            </div>
        );
    });

    return (
        <div className="flex flex-col items-center w-fit mx-auto mt-10">
            <span className="text-2xl font-semibold text-stone-800 uppercase tracking-widest mb-3 ml-1">
                {t("countdown.next")}
            </span>

            {/* 기존의 타이머 영역 */}
            <div className="flex justify-center gap-6 md:gap-8">
                {timerComponents.length ? timerComponents : <span className="text-3xl font-bold text-red-600 animate-pulse">{t("countdown.raceday")}</span>}
            </div>
        </div>
    );
}