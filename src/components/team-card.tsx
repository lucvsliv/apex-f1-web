"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TEAMS_DATA = [
    { id: "mclaren", name: "McLaren", fullName: "McLaren Formula 1 Team", scale: 1.30 },
    { id: "ferrari", name: "Ferrari", fullName: "Scuderia Ferrari HP", scale: 1.00 },
    { id: "redbullracing", name: "Red Bull Racing", fullName: "Oracle Red Bull Racing", scale: 1.30 },
    { id: "mercedes", name: "Mercedes", fullName: "Mercedes-AMG PETRONAS F1 Team", scale: 0.9 },
    { id: "astonmartin", name: "Aston Martin", fullName: "Aston Martin Aramco Formula One Team", scale: 1.5 },
    { id: "alpine", name: "Alpine", fullName: "BWT Alpine Formula One Team", scale: 1.20 },
    { id: "williams", name: "Williams", fullName: "Williams Racing", scale: 1.10 },
    { id: "racingbulls", name: "Racing Bulls", fullName: "Visa Cash App RB Formula One Team", scale: 1.25 },
    { id: "haas", name: "Haas", fullName: "MoneyGram Haas F1 Team", scale: 1.25 },
    { id: "audi", name: "Audi", fullName: "Audi F1 Team", scale: 1.4 },
    { id: "cadillac", name: "Cadillac", fullName: "Cadillac Formula 1 Team", scale: 1.2 },
];

export function TeamCard() {
    const router = useRouter();
    const [year, setYear] = React.useState<string>("2026");

    return (
        <div>
            {/* Breadcrumb & Year Selector */}
            <Breadcrumb className="mx-7 mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-sm">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/teams" className="text-sm">Teams</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-[100px] text-sm">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="border-stone-200">
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
            <div className="text-left px-8 sm:pb-5 pt-10 sm:pt-15 pb-10">
                <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>FORMULA 1</p>
                <h1 className="text-4xl font-bold">TEAMS {year}</h1>
            </div>

            {/* 팀 카드 리스트 */}
            <div className="w-full pt-5 px-6 sm:pb-5 pb-5 sm:pb-15">
                <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {TEAMS_DATA.map((team) => {
                        const teamLogoPath = `/team/${team.id}-${year}.png`;

                        return (
                            <Card
                                key={team.id}
                                className="w-full rounded-2xl border border-stone-200 duration-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => {
                                    router.push(`/dashboard/teams/${year}/${team.id}`);
                                }}
                            >
                                <div className="flex flex-col items-center justify-center text-center gap-4">

                                    <div className="h-24 w-full flex items-center justify-center">
                                        <div
                                            className="relative w-full h-full"
                                            style={{ transform: `scale(${team.scale})` }}
                                        >
                                            <Image
                                                src={teamLogoPath}
                                                alt={team.name}
                                                fill
                                                className="object-contain" // 비율이 깨지지 않도록 유지
                                            />
                                        </div>
                                    </div>

                                    {/* 텍스트 영역 */}
                                    <div className="space-y-1.5 mt-2">
                                        <CardTitle className="text-lg font-bold leading-tight text-gray-950 dark:text-gray-100">
                                            {team.name}
                                        </CardTitle>
                                        <CardDescription className="text-[11px] text-gray-500 line-clamp-2 h-7" title={team.fullName}>
                                            {team.fullName}
                                        </CardDescription>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}