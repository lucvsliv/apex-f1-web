"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { formatTeamName } from "@/lib/utils";

import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api/client";
import { SeasonTeam } from "@/types/team";

const TEAM_SCALES: Record<string, number> = {
    "mclaren": 1.50,
    "mclaren-1997-2006": 1.25,
    "mclaren-2007-2016": 0.90,
    "mclaren-2017-2020": 1.25,
    "ferrari": 1.10,
    "redbullracing": 1.30,
    "mercedes": 1.05,
    "astonmartin": 1.50,
    "alpine": 1.30,
    "williams": 0.90,
    "williams-2026": 1.10,
    "racingbulls": 1.40,
    "haas": 1.40,
    "audi": 1.40,
    "cadillac": 1.20,
    "kicksauber": 0.95,
    "alphatauri": 1.30,
    "alfaromeo": 1.00,
    "racingpoint": 0.95,
    "renault": 0.95,
    "tororosso": 1.00,
    "forceindia": 1.00,
    "lotusf1": 1.40,
    "caterham": 0.90,
    "sauber": 1.20,
    "hrt": 1.00,
    "hrt-2010": 0.95,
    "lotusracing-2010-2018": 1.30,
    "williams-2007-2013": 1.00,
    "virgin": 1.15,
};

const AVAILABLE_YEAR_SPECIFIC_IMAGES: string[] = [
    "williams-2026",
    "virgin-2011",
    "hrt-2010",
    "mercedes-1997-2006",
    "mclaren-1997-2006",
    "mclaren-2007-2016",
    "mclaren-2017-2020",
    "lotusracing-2010-2018",
    "lotusracing-1989-2009",
    "williams-2007-2013"
];

function TeamLogo({ year, constructorId }: { year: string, constructorId: string }) {
    let urlConstructorId = constructorId.replace(/[-_]/g, '').toLowerCase();

    // DB naming variations
    if (urlConstructorId === 'redbull') urlConstructorId = 'redbullracing';
    if (urlConstructorId === 'rb') urlConstructorId = 'racingbulls';

    let currentSrc = `/team/${urlConstructorId}.png`;
    let scaleKey = `${urlConstructorId}-${year}`;

    // 1. Check for exact year match (e.g. williams-2026)
    if (AVAILABLE_YEAR_SPECIFIC_IMAGES.includes(`${urlConstructorId}-${year}`)) {
        currentSrc = `/team/${urlConstructorId}-${year}.png`;
    } else {
        // 2. Check for range match (e.g. mclaren-2017-2020)
        const yearNum = parseInt(year, 10);
        for (const imgName of AVAILABLE_YEAR_SPECIFIC_IMAGES) {
            if (imgName.startsWith(`${urlConstructorId}-`)) {
                const parts = imgName.split('-');
                if (parts.length === 3) {
                    const start = parseInt(parts[1], 10);
                    const end = parseInt(parts[2], 10);
                    if (yearNum >= start && yearNum <= end) {
                        currentSrc = `/team/${imgName}.png`;
                        scaleKey = imgName; // use range name for scale override if exists
                        break;
                    }
                }
            }
        }
    }

    // Check if there is a specific scale override (e.g. williams-2026 or mclaren-2017-2020), else use default
    const scale = TEAM_SCALES[scaleKey] || TEAM_SCALES[urlConstructorId] || 1.2;

    return (
        <div
            className="relative w-full h-full"
            style={{ transform: `scale(${scale})` }}
        >
            <Image
                src={currentSrc}
                alt={constructorId}
                fill
                className="object-contain"
                unoptimized // Prevent Next.js from spamming the server console if an image is missing
            />
        </div>
    );
}

export function TeamCard() {
    const { language } = useLanguage();
    const router = useRouter();
    const [year, setYear] = React.useState<string>("2026");
    const [teams, setTeams] = React.useState<SeasonTeam[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchTeams = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/seasons/${year}/teams`);
                setTeams(response.data);
            } catch (error) {
                console.error("Failed to fetch teams:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTeams();
    }, [year]);

    return (
        <div>
            {/* Breadcrumb & Year Selector */}
            <Breadcrumb className="mx-7 mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-sm">{language === 'ko' ? '홈' : 'Home'}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/teams" className="text-sm">{language === 'ko' ? '팀' : 'Teams'}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-fit text-sm">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="border-stone-200 h-64">
                                {Array.from({ length: 2026 - 2000 + 1 }, (_, i) => (2026 - i).toString()).map((y) => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                ))}
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
                    {isLoading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-[200px] w-full rounded-2xl" />
                        ))
                    ) : (
                        teams.map((team) => {
                            // fallback formatting for full name (use entrantName from DB)
                            const formattedFullName = team.entrantName;

                            return (
                                <Card
                                    key={`${team.entrantId}-${team.constructorId}`}
                                    className="w-full rounded-2xl border border-stone-200 duration-200 p-6 cursor-pointer hover:shadow-lg transition-shadow"
                                    onClick={() => {
                                        router.push(`/dashboard/teams/${year}/${team.constructorId}`);
                                    }}
                                >
                                    <div className="flex flex-col items-center justify-center text-center gap-4">
                                        <div className="h-24 w-full flex items-center justify-center">
                                            <TeamLogo year={year} constructorId={team.constructorId} />
                                        </div>

                                        {/* 텍스트 영역 */}
                                        <div className="space-y-1.5 mt-2">
                                            <CardTitle className="text-lg font-bold leading-tight text-gray-950 dark:text-gray-100">
                                                {formatTeamName(team.constructorId, language)}
                                            </CardTitle>
                                            <CardDescription className="text-[11px] text-gray-500 line-clamp-2 min-h-8" title={formattedFullName}>
                                                {formattedFullName}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}