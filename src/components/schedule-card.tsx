"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Schedule } from "@/types/schedule"; // 스케줄 타입
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import * as React from "react";
import { useRouter } from "next/navigation"; // useRouter 훅 사용
import api from "@/lib/api/client";
import { useLanguage } from "@/contexts/language-context";
import { formatGpName, formatGrandPrixId, translateCountry } from "@/lib/utils";

export function ScheduleCard() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [year, setYear] = React.useState<string>("2026"); // 기본 연도
    const [schedules, setSchedules] = React.useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isKst, setIsKst] = React.useState<boolean>(language === 'ko');

    React.useEffect(() => {
        setIsKst(language === 'ko');
    }, [language]);

    const convertToKst = (dateTimeStr: string) => {
        if (!isKst) {
            if (language === 'ko') {
                const daysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const daysKo = ["일", "월", "화", "수", "목", "금", "토"];
                let translated = dateTimeStr;
                daysEn.forEach((en, i) => {
                    translated = translated.replace(`(${en})`, `(${daysKo[i]})`);
                });
                return translated;
            }
            return dateTimeStr;
        }
        if (dateTimeStr.includes("TBD")) return dateTimeStr;
        
        const match = dateTimeStr.match(/^(\d{4})\.(\d{2})\.(\d{2})\([A-Z][a-z]{2}\)\s+(\d{2}):(\d{2})$/);
        if (!match) return dateTimeStr;

        const [_, y, m, d, h, min] = match;
        const date = new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d), parseInt(h), parseInt(min)));
        
        date.setUTCHours(date.getUTCHours() + 9);
        
        const kstYear = date.getUTCFullYear();
        const kstMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
        const kstDay = String(date.getUTCDate()).padStart(2, '0');
        const kstHour = String(date.getUTCHours()).padStart(2, '0');
        const kstMin = String(date.getUTCMinutes()).padStart(2, '0');
        
        const daysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const daysKo = ["일", "월", "화", "수", "목", "금", "토"];
        const kstDayOfWeek = language === 'ko' ? daysKo[date.getUTCDay()] : daysEn[date.getUTCDay()];

        return `${kstYear}.${kstMonth}.${kstDay}(${kstDayOfWeek}) ${kstHour}:${kstMin}`;
    };

    React.useEffect(() => {
        setIsLoading(true);
        api.get(`/races/schedules?year=${year}`)
            .then(res => {
                return res.data;
            })
            .then(data => {
                setSchedules(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch schedules:", err);
                setIsLoading(false);
            });
    }, [year]);

    const translateDate = (dateStr: string) => {
        if (language !== "ko") return dateStr;
        
        const months: Record<string, string> = {
            "Jan": "1월", "Feb": "2월", "Mar": "3월", "Apr": "4월", "May": "5월", "Jun": "6월",
            "Jul": "7월", "Aug": "8월", "Sep": "9월", "Oct": "10월", "Nov": "11월", "Dec": "12월"
        };

        let koDate = dateStr;
        for (const [eng, kor] of Object.entries(months)) {
            koDate = koDate.replace(new RegExp(eng, 'gi'), kor);
        }
        
        koDate = koDate.replace(/-/g, "~");
        
        if (/\d$/.test(koDate)) {
            koDate += "일";
        }
        
        return koDate;
    };



    const translateSessionName = (name: string) => {
        if (language !== "ko") return name;
        let tName = name;
        if (/Practice\s*\d+/i.test(tName)) {
            tName = tName.replace(/Practice\s*(\d+)/i, "프랙티스 $1");
        }
        tName = tName.replace(/Sprint Qualifying/i, "스프린트 퀄리파잉");
        tName = tName.replace(/Sprint Shootout/i, "스프린트 퀄리파잉");
        tName = tName.replace(/Sprint/i, "스프린트");
        if (tName === "Qualifying") tName = "퀄리파잉";
        if (tName === "Race") tName = "레이스";
        return tName;
    };

    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb className="mx-7 mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-sm">{language === 'ko' ? '홈' : 'Home'}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/schedules" className="text-sm">{language === 'ko' ? '일정' : 'Schedules'}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="text-sm h-8 border-stone-200 bg-white shadow-sm font-medium focus:ring-0 w-fit">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="border-stone-200 bg-white">
                                <SelectItem value="2026">2026</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 그랑프리 년도 정보 */}
            <div className="text-left px-8 sm:pb-5 pt-10 sm:pt-15 pb-10 flex justify-between items-end">
                <div>
                    <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>FORMULA 1</p>
                    <h1 className="text-4xl font-bold">{language === 'ko' ? `그랑프리 ${year}` : `GRAND PRIX ${year}`}</h1>
                </div>
                <div className="flex items-center space-x-2 pb-1.5">
                    <span className={`text-sm font-medium transition-colors ${!isKst ? 'text-stone-800' : 'text-stone-400'}`}>Local</span>
                    <Switch
                        checked={isKst}
                        onCheckedChange={setIsKst}
                        className="data-[state=checked]:bg-red-500"
                    />
                    <span className={`text-sm font-medium transition-colors ${isKst ? 'text-stone-800' : 'text-stone-400'}`}>KST</span>
                </div>
            </div>

            {/* 일정 카드 */}
            <div className="w-full pt-5 px-6 sm:pb-5 pb-5 sm:pb-15">
                {isLoading ? (
                    <div className="flex justify-center py-20 text-gray-500">
                        {t("common.loading")}
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {schedules.map((schedule, idx) => (
                        <Card
                            key={idx}
                            className={`w-full rounded-xl border shadow-none transition-colors duration-200 cursor-pointer
                            ${schedule.isCurrent ? "border-red-400 ring-1 ring-red-400 bg-red-50/10" : "border-stone-200 hover:border-stone-300"}`}
                            onClick={() => router.push(`/schedules/${schedule.countryCodeISO}`)}
                        >
                            {/* Card Header */}
                            <CardHeader className="px-5">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-lg">{schedule.round}</span>
                                        {schedule.isCurrent && (
                                            <div className="flex items-center gap-1.5 ml-1 px-2.5 py-0.5 bg-red-50 text-red-600 rounded-full border border-red-200">
                                                <span className="relative flex h-1.5 w-1.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                                </span>
                                                <span className="text-[10px] uppercase font-bold tracking-wider">{language === 'ko' ? '다음 레이스' : 'Next Race'}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1.5 text-sm font-medium">
                                        <img
                                            src={`https://flagcdn.com/w2560/${schedule.countryCodeISO.toLowerCase()}.png`}
                                            className="inline-block h-4 w-6 rounded-[0.175rem]"
                                            alt={schedule.countryCode}/>
                                        <span>{schedule.countryCode}</span>
                                    </div>
                                </div>

                                <CardTitle className="text-xl font-bold">
                                    {schedule.grandPrixId ? formatGrandPrixId(schedule.grandPrixId, language) : formatGpName(schedule.name, language)}
                                </CardTitle>
                                <CardDescription className="text-sm mt-1">
                                    {schedule.city}, {translateCountry(schedule.country, language)}
                                </CardDescription>
                                <CardDescription className="text-sm text-gray-700">{translateDate(schedule.date)}</CardDescription>
                                <CardDescription className="text-xs text-gray-500">{schedule.circuit}</CardDescription>
                            </CardHeader>

                            <div className="border-t border-dashed border-gray-300"></div>

                            <CardContent className="pt-0 px-5 pb-3">
                                <div className="grid gap-1 text-xs" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                                    {schedule.sessions.map((session) => (
                                        <div key={session.name} className="flex justify-between rounded hover:bg-gray-50 transition-colors">
                                            <span>{translateSessionName(session.name)}</span>
                                            <span className="text-gray-500">{convertToKst(session.time)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                )}
            </div>
        </div>
    );
}
