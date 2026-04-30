"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Schedule } from "@/types/schedule"; // 스케줄 타입
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as React from "react";
import { useRouter } from "next/navigation"; // useRouter 훅 사용

export function ScheduleCard({ schedules }: { schedules: Schedule[] }) {
    const router = useRouter();
    const [year, setYear] = React.useState<string>("2025"); // 기본 연도

    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb className="mx-7 mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-sm">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/schedules" className="text-sm">Schedules</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="text-sm h-8 border-stone-200 bg-white shadow-sm font-medium focus:ring-0 w-[100px]">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="border-stone-200 bg-white">
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 그랑프리 년도 정보 */}
            <div className="text-left px-8 sm:pb-5 pt-10 sm:pt-15 pb-10">
                <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>FORMULA 1</p>
                <h1 className="text-4xl font-bold">GRAND PRIX {year}</h1>
            </div>

            {/* 일정 카드 */}
            <div className="w-full pt-5 px-6 sm:pb-5 pb-5 sm:pb-15">
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
                                                <span className="text-[10px] uppercase font-bold tracking-wider">Next Race</span>
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

                                <CardTitle className="text-xl font-semibold">{schedule.name}</CardTitle>
                                <CardDescription className="text-sm text-gray-700">{schedule.date}</CardDescription>
                                <CardDescription className="text-xs text-gray-500">{schedule.circuit}</CardDescription>
                            </CardHeader>

                            <div className="border-t border-dashed border-gray-300"></div>

                            <CardContent className="pt-0 px-5 pb-3">
                                <div className="grid gap-1 text-xs" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                                    {schedule.sessions.map((session) => (
                                        <div key={session.name} className="flex justify-between rounded hover:bg-gray-50 transition-colors">
                                            <span>{session.name}</span>
                                            <span className="text-gray-500">{session.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
