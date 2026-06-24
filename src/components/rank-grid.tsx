"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/api/client";
import { useLanguage } from "@/contexts/language-context";
import { formatDriverName, formatTeamName } from "@/lib/utils";
import { Info } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type DriverRank = {
    position: number | null;
    driverId: string;
    name: string;
    team: string;
    teamColor?: string;
    points: number;
};

type TeamRank = {
    position: number | null;
    teamId: string;
    name: string;
    teamColor?: string;
    points: number;
};

const TEAM_DISPLAY_MAP: Record<string, string> = {
    // DB constructor_id values
    "mercedes": "Mercedes",
    "red-bull": "Red Bull Racing",
    "ferrari": "Ferrari",
    "mclaren": "McLaren",
    "aston-martin": "Aston Martin",
    "alpine": "Alpine",
    "williams": "Williams",
    "haas": "Haas",
    "racing-bulls": "RB",
    "rb": "RB",
    "kick-sauber": "Kick Sauber",
    "audi": "Audi",
    "cadillac": "Cadillac",

    // Full names / Other variations
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

const TEAM_COLORS: Record<string, string> = {
    "McLaren": "#F47600",
    "Ferrari": "#ED1131",
    "Mercedes": "#00D7B6",
    "Red Bull Racing": "#4781D7",
    "Alpine": "#00A1E8",
    "Aston Martin": "#229971",
    "Williams": "#1868DB",
    "Haas": "#9C9FA2",
    "RB": "#6C98FF",
    "Kick Sauber": "#01C00E",
    "Audi": "#ffffff",
    "Cadillac": "#000000"
};

export default function RankGrid() {
    const router = useRouter();
    const { language } = useLanguage();
    const [year, setYear] = React.useState<string>("2026");
    const [driverRanks, setDriverRanks] = React.useState<DriverRank[]>([]);
    const [teamRanks, setTeamRanks] = React.useState<TeamRank[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const years = Array.from({ length: 2026 - 2000 + 1 }, (_, i) => (2026 - i).toString());

    React.useEffect(() => {
        const fetchRanks = async () => {
            setIsLoading(true);
            try {
                const driverRes = await api.get(`/seasons/${year}/standings/drivers`);
                const teamRes = await api.get(`/seasons/${year}/standings/constructors`);

                setDriverRanks(driverRes.data || []);
                setTeamRanks(teamRes.data || []);
            } catch (error) {
                console.error("Error fetching ranks:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRanks();
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
                        <BreadcrumbLink href="/dashboard/ranks" className="text-sm">
                            {language === 'ko' ? '랭킹' : 'Ranks'}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-fit text-sm">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="border-stone-200 h-[200px] overflow-y-auto">
                                {years.map(y => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 그랑프리 년도 타이틀 */}
            <div className="text-left px-8 sm:pb-5 pt-10 sm:pt-15 pb-10">
                <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>FORMULA 1</p>
                <h1 className="text-4xl font-bold">RANKS {year}</h1>
            </div>

            <div className="mx-6 sm:pb-5 pb-5 sm:pb-15 max-w-2xl">
                <Tabs defaultValue="drivers" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="drivers">{language === 'ko' ? '드라이버 순위' : 'Drivers Ranking'}</TabsTrigger>
                        <TabsTrigger value="teams">{language === 'ko' ? '팀 순위' : 'Teams Ranking'}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="drivers">
                        <div className="rounded-md border border-stone-200 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-stone-100">
                                    <TableRow className="border-b-stone-200">
                                        <TableHead className="w-20">POS</TableHead>
                                        <TableHead>DRIVER</TableHead>
                                        <TableHead>TEAM</TableHead>
                                        <TableHead className="text-right">PTS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array.from({ length: 10 }).map((_, idx) => (
                                            <TableRow key={idx} className="border-b-stone-200">
                                                <TableCell className="py-4"><Skeleton className="h-6 w-8" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-6 w-12 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        driverRanks.map((rank, idx) => (
                                            <TableRow key={`${rank.driverId}-${idx}`} className="cursor-pointer hover:bg-stone-50 transition-colors border-b-stone-200">
                                                <TableCell className="font-bold" style={{ fontFamily: "'Formula 1', monospace" }}>
                                                    {rank.position ?? "-"}
                                                </TableCell>
                                                <TableCell className="font-semibold">{formatDriverName(rank.driverId, language)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-1 h-4 rounded-full"
                                                            style={{ backgroundColor: rank.teamColor || "#ccc" }}
                                                        />
                                                        {formatTeamName(rank.team, language)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-bold tabular-nums">
                                                    {rank.points}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="teams">
                        <div className="rounded-md border border-stone-200 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-stone-100">
                                    <TableRow className="border-b-stone-200">
                                        <TableHead className="w-20">POS</TableHead>
                                        <TableHead>TEAM</TableHead>
                                        <TableHead className="text-right">PTS</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array.from({ length: 10 }).map((_, idx) => (
                                            <TableRow key={idx} className="border-b-stone-200">
                                                <TableCell className="py-4"><Skeleton className="h-6 w-8" /></TableCell>
                                                <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-6 w-12 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        teamRanks.map((rank, idx) => (
                                            <TableRow key={`${rank.teamId}-${idx}`} className="cursor-pointer hover:bg-stone-50 transition-colors border-b-stone-200">
                                                <TableCell className="font-bold" style={{ fontFamily: "'Formula 1', monospace" }}>
                                                    {rank.position ?? "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-1 h-4 rounded-full"
                                                            style={{ backgroundColor: rank.teamColor || "#ccc" }}
                                                        />
                                                        <span className="font-semibold">{formatTeamName(rank.teamId, language)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-bold tabular-nums">
                                                    {rank.points}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {year === "2018" && (
                            <div className="mt-6">
                                <Alert className="bg-stone-50 text-stone-800 border-stone-200">
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>{language === 'ko' ? '2018 시즌 Force India 안내' : '2018 Season Force India Notice'}</AlertTitle>
                                    <AlertDescription className="text-stone-600 leading-relaxed mt-2">
                                        {language === 'ko' 
                                            ? '기존 Force India 팀은 시즌 중 법정관리로 인해 챔피언십에서 제외(Excluded)되어 전반기에 획득한 59점이 모두 몰수되었습니다. 벨기에 GP부터는 자산을 인수한 새로운 팀인 Racing Point Force India가 0점부터 새롭게 참가하여 점수를 기록했습니다.' 
                                            : 'The original Force India team was excluded from the championship mid-season due to administration, forfeiting all points. From the Belgian GP onwards, the new Racing Point Force India team entered as a new constructor, starting with 0 points.'}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
