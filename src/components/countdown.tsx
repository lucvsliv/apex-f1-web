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

export function Countdown() {
    const [targetDate] = useState(() => new Date("2026-03-29T14:00:00+09:00"));
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    // 클라이언트 렌더링 전에는 아무것도 보여주지 않음 (Hydration 에러 방지)
    if (!mounted) return null;

    const timerComponents: JSX.Element[] = [];

    Object.keys(timeLeft).forEach((interval) => {
        const value = timeLeft[interval as keyof TimeLeft];
        timerComponents.push(
            <div key={interval} className="flex flex-col items-center">
                <span className="text-5xl font-extrabold text-stone-800 tracking-tight">
                  {value < 10 ? `0${value}` : value}
                </span>
                <span className="text-xs uppercase text-stone-500 font-semibold tracking-widest mt-2">
                  {interval}
                </span>
            </div>
        );
    });

    return (
        <div className="flex flex-col items-center w-fit mx-auto mt-10">
            <span className="text-2xl font-semibold text-stone-400 uppercase tracking-widest mb-3 ml-1">
                Next Grand Prix
            </span>

            {/* 기존의 타이머 영역 */}
            <div className="flex justify-center gap-6 md:gap-8">
                {timerComponents.length ? timerComponents : <span className="text-3xl font-bold text-red-600 animate-pulse">It's Race Day! 🏎️</span>}
            </div>
        </div>
    );
}