"use client";

import * as React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api/client";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type SeasonDriverDetail = {
    driverId: string;
    name: string;
    team: string;
    country: string;
    number: number | null;
    year: number;
    positionNumber: number | null;
    positionText: string | null;
    bestStartingGridPosition: number | null;
    bestRaceResult: number | null;
    bestSprintRaceResult: number | null;
    totalRaceEntries: number;
    totalRaceStarts: number;
    totalRaceWins: number;
    totalRaceLaps: number;
    totalPodiums: number;
    totalPoints: number;
    totalPolePositions: number;
    totalFastestLaps: number;
    totalSprintRaceStarts: number;
    totalSprintRaceWins: number;
    totalDriverOfTheDay: number;
    totalGrandSlams: number;
};

type SeasonDriverSummary = {
    driverId: string;
    name: string;
};

const TEAM_DISPLAY_MAP: Record<string, string> = {
    "Mercedes-AMG Petronas Formula One Team": "Mercedes",
    "Mercedes": "Mercedes",
    "Oracle Red Bull Racing": "Red Bull Racing",
    "Scuderia Ferrari HP": "Ferrari",
    "McLaren Mastercard F1 Team": "McLaren",
    "Aston Martin Aramco Formula One Team": "Aston Martin",
    "Alpine F1 Team": "Alpine",
    "BWT Alpine Formula One Team": "Alpine",
    "Atlassian Williams F1 Team": "Williams",
    "MoneyGram Haas F1 Team": "Haas",
    "TGR Haas F1 Team": "Haas",
    "Visa Cash App Racing Bulls Formula One Team": "RB",
    "Cadillac Formula 1 Team": "Cadillac",
    "Audi Revolut F1 Team": "Audi"
};

// 차트 컬러 및 라벨 설정
// TODO: 추후 팀컬러를 기반으로 각 선수마다 색상 변경되도록
const chartConfig = {
    driver: {
        label: "Driver",
        color: "hsl(var(--chart-1))", // 진한 색 (해당 선수)
    },
    average: {
        label: "Grid Average",
        color: "hsl(var(--muted-foreground))", // 연한 색 (전체 평균)
    },
} satisfies ChartConfig;

export default function DriverDetail() {
    const router = useRouter();
    const params = useParams();

    const currentYear = params.year as string;
    const currentDriverId = params.driverId as string;

    const [driverDetail, setDriverDetail] = React.useState<SeasonDriverDetail | null>(null);
    const [driversList, setDriversList] = React.useState<SeasonDriverSummary[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        if (!currentYear || !currentDriverId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [detailRes, listRes] = await Promise.all([
                    api.get(`/seasons/${currentYear}/drivers/${currentDriverId}`),
                    api.get(`/seasons/${currentYear}/drivers`)
                ]);

                if (detailRes.data) setDriverDetail(detailRes.data);
                if (listRes.data) setDriversList(listRes.data);
            } catch (error) {
                console.error("Error fetching driver details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentYear, currentDriverId]);

    const handleYearChange = (newYear: string) => {
        router.push(`/dashboard/drivers`);
    };

    const handleDriverChange = (newDriverId: string) => {
        router.push(`/dashboard/drivers/${currentYear}/${newDriverId}`);
    };

    if (isLoading || !driverDetail) {
        return <div className="flex justify-center py-20 text-gray-500">Loading driver details...</div>;
    }

    const imagePath = `/profile/${currentYear}-${driverDetail.driverId}.png`;

    // TODO: 현재 평균값은 Mock 데이터 -> 추후 백엔드에서 계산하여 내려주는 것이 필요
    // TODO: 따로 ResponseDTO 만들거나 기존 DTO에 Field 추가하는 방식으로
    const radarData = [
        { stat: "Wins", driver: driverDetail.totalRaceWins, average: 1.2 },
        { stat: "Podiums", driver: driverDetail.totalPodiums, average: 3.6 },
        { stat: "Poles", driver: driverDetail.totalPolePositions, average: 1.2 },
        { stat: "Fastest Laps", driver: driverDetail.totalFastestLaps, average: 1.2 },
        { stat: "DOTD", driver: driverDetail.totalDriverOfTheDay, average: 1.2 },
    ];

    return (
        <div>
            {/* 1. Breadcrumb */}
            <Breadcrumb className="mx-7 mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-sm">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/drivers" className="text-sm">Drivers</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={currentYear} onValueChange={handleYearChange}>
                            <SelectTrigger className="text-sm">
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
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={currentDriverId} onValueChange={handleDriverChange}>
                            <SelectTrigger className="text-sm">
                                <SelectValue placeholder="Driver" />
                            </SelectTrigger>
                            <SelectContent className="border-stone-200">
                                {driversList.map(d => (
                                    <SelectItem key={d.driverId} value={d.driverId}>
                                        {d.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 2. Hero Section */}
            <div className="mx-7 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center p-8 rounded-2xl border-muted shadow-sm">
                <div className="flex justify-center md:justify-end">
                    <Image
                        src={imagePath}
                        alt={driverDetail.name}
                        width={280}
                        height={280}
                        className="object-cover object-top rounded-lg aspect-square shadow-inner"
                    />
                </div>
                <div className="md:col-span-2 space-y-4 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <h1 className="text-5xl font-black uppercase tracking-tight">{driverDetail.name}</h1>
                        {driverDetail.number && (
                            <Badge variant="secondary" className="text-2xl px-3 py-1 bg-gray-900 text-white hover:bg-gray-800">
                                #{driverDetail.number}
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-lg font-medium text-gray-600">
                        <span className="text-primary font-bold">
                            {TEAM_DISPLAY_MAP[driverDetail.team] || driverDetail.team}
                        </span>
                        <Separator orientation="vertical" className="h-5" />
                        <span>{driverDetail.country}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 font-semibold uppercase">Championship</span>
                            <span className="text-3xl font-bold">{driverDetail.positionText || "N/A"}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 font-semibold uppercase">Total Points</span>
                            <span className="text-3xl font-bold">{driverDetail.totalPoints} PTS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Stats & Chart Section (2-Column Layout) */}
            <div className="mx-7 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 왼쪽: 레이더 차트 */}
                <Card className="lg:col-span-1 border-gray-100 shadow-sm flex flex-col">
                    <CardHeader className="items-center pb-2">
                        <CardTitle className="text-lg">Performance Radar</CardTitle>
                        <CardDescription>Driver vs Grid Average</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4 flex items-center justify-center">
                        <ChartContainer config={chartConfig} className="mx-auto w-full aspect-square max-h-[300px]">
                            <RadarChart data={radarData}>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                <PolarAngleAxis dataKey="stat" className="text-xs font-semibold" />
                                <PolarGrid />
                                {/* 연한 색: 전체 평균 */}
                                <Radar
                                    dataKey="average"
                                    fill="var(--color-average)"
                                    fillOpacity={0.2}
                                    stroke="var(--color-average)"
                                    strokeWidth={2}
                                />
                                {/* 진한 색: 현재 드라이버 */}
                                <Radar
                                    dataKey="driver"
                                    fill="var(--color-driver)"
                                    fillOpacity={0.6}
                                    stroke="var(--color-driver)"
                                    strokeWidth={2}
                                    dot={{ r: 4, fillOpacity: 1 }}
                                />
                            </RadarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* 오른쪽: 상세 스탯 카드 그리드 */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4 ml-1">Season Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <StatCard title="Best Race Result" value={driverDetail.bestRaceResult ? `P${driverDetail.bestRaceResult}` : "-"} />
                        <StatCard title="Best Grid Position" value={driverDetail.bestStartingGridPosition ? `P${driverDetail.bestStartingGridPosition}` : "-"} />
                        <StatCard title="Grand Slams" value={driverDetail.totalGrandSlams} />
                        <StatCard title="Race Starts" value={`${driverDetail.totalRaceStarts} / ${driverDetail.totalRaceEntries}`} />
                        <StatCard title="Laps Raced" value={driverDetail.totalRaceLaps} />
                        <StatCard title="Sprint Wins" value={driverDetail.totalSprintRaceWins} />
                        <StatCard title="Wins" value={driverDetail.totalRaceWins} />
                        <StatCard title="Podiums" value={driverDetail.totalPodiums} />
                        <StatCard title="Pole Positions" value={driverDetail.totalPolePositions} />
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ title, value }: { title: string, value: string | number }) {
    return (
        <Card className="bg-gray-50/50 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs text-gray-500 uppercase font-bold tracking-wider">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="text-2xl font-black text-gray-800">{value}</div>
            </CardContent>
        </Card>
    );
}