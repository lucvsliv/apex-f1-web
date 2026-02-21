// src/components/schedule-card.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,} from "@/components/ui/breadcrumb"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import * as React from "react";
import {teams} from "@/data/teams";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"
import { useRouter } from "next/navigation";

export function TeamCard() {
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
                            <SelectTrigger className="w-[100px] text-sm">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-200">
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 그랑프리 년도 정보 */}
            <div className="text-left p-15 pb-10">
                <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>FORMULA 1</p>
                <h1 className="text-4xl font-bold">TEAMS {year}</h1>
            </div>

            {/* 팀 카드 */}
            <div className="w-full px-15 pb-15 pt-5">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {teams.map((team, idx) => (
                        <Card
                            key={idx}
                            className="relative w-full rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                            onClick={() => {
                                router.push(`/teams/${team.shortName.toLowerCase().replace(/\s+/g, "-")}`);
                            }}
                        >
                            {/* Card Header */}
                            <CardHeader
                                className="px-3 flex items-center gap-3"
                                style={{ minHeight: "70px" }}
                            >
                                <img src={team.img} alt={team.shortName} className="w-11 h-11 rounded-md" />
                                <div className="flex flex-col justify-center">
                                    <CardTitle className="text-xl font-semibold">{team.shortName}</CardTitle>
                                    <CardDescription className="text-sm text-gray-600">{team.name}</CardDescription>
                                </div>
                            </CardHeader>

                            <div className="border-t border-dashed border-gray-300" />

                            <CardContent className="pt-0 px-3 pb-3">
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {team.drivers.map((driver) => (
                                        <TooltipProvider key={driver.number}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center justify-center h-20 border-gray-200 gap-2"
                                                        asChild
                                                        onClick={(e) => e.stopPropagation()} // ★ 클릭 이벤트 전파 막기
                                                    >
                                                        <Link
                                                            href={`/drivers/${driver.number}`}
                                                            className="flex items-center justify-center gap-2 w-full"
                                                        >
                                                            <img
                                                                src={driver.img}
                                                                alt={driver.lastName}
                                                                className="w-8 h-8 rounded-sm flex-shrink-0"
                                                            />
                                                            <div className="flex flex-col items-start leading-tight truncate hidden sm:flex">
                                                                <span className="text-xs text-gray-500">{driver.firstName}</span>
                                                                <span className="text-sm font-medium">{driver.lastName}</span>
                                                            </div>
                                                        </Link>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{driver.firstName} {driver.lastName}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div>
                            </CardContent>

                            {/* 팀 컬러 바 */}
                            <div
                                className="absolute bottom-0 left-0 w-full h-1 rounded-b-xl"
                                style={{ backgroundColor: team.color }}
                            />
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    )
}
