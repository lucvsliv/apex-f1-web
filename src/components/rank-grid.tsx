"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/api/client";

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

type DriverRank = {
    position: number;
    driverId: string;
    name: string;
    team: string;
    points: number;
};

type TeamRank = {
    position: number;
    teamId: string;
    name: string;
    points: number;
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
    const [year, setYear] = React.useState<string>("2025");
    const [driverRanks, setDriverRanks] = React.useState<DriverRank[]>([]);
    const [teamRanks, setTeamRanks] = React.useState<TeamRank[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchRanks = async () => {
            setIsLoading(true);
            try {
                // Mocking data for now as we don't have real ranking API yet
                // In real scenario, we would call:
                // const driverRes = await api.get(`/seasons/${year}/driver-ranks`);
                // const teamRes = await api.get(`/seasons/${year}/team-ranks`);

                const mockDrivers: DriverRank[] = [
                    { position: 1, driverId: "max_verstappen", name: "Max Verstappen", team: "Red Bull Racing", points: 454 },
                    { position: 2, driverId: "lando_norris", name: "Lando Norris", team: "McLaren", points: 331 },
                    { position: 3, driverId: "charles_leclerc", name: "Charles Leclerc", team: "Ferrari", points: 307 },
                    { position: 4, driverId: "oscar_piastri", name: "Oscar Piastri", team: "McLaren", points: 262 },
                    { position: 5, driverId: "carlos_sainz", name: "Carlos Sainz", team: "Ferrari", points: 244 },
                    { position: 6, driverId: "lewis_hamilton", name: "Lewis Hamilton", team: "Mercedes", points: 190 },
                    { position: 7, driverId: "george_russell", name: "George Russell", team: "Mercedes", points: 180 },
                    { position: 8, driverId: "sergio_perez", name: "Sergio Perez", team: "Red Bull Racing", points: 151 },
                    { position: 9, driverId: "fernando_alonso", name: "Fernando Alonso", team: "Aston Martin", points: 62 },
                    { position: 10, driverId: "nico_hulkenberg", name: "Nico Hulkenberg", team: "Haas", points: 31 },
                ];

                const mockTeams: TeamRank[] = [
                    { position: 1, teamId: "mclaren", name: "McLaren", points: 593 },
                    { position: 2, teamId: "ferrari", name: "Ferrari", points: 557 },
                    { position: 3, teamId: "redbullracing", name: "Red Bull Racing", points: 544 },
                    { position: 4, teamId: "mercedes", name: "Mercedes", points: 382 },
                    { position: 5, teamId: "astonmartin", name: "Aston Martin", points: 86 },
                    { position: 6, teamId: "alpine", name: "Alpine", points: 49 },
                    { position: 7, teamId: "haas", name: "Haas", points: 46 },
                    { position: 8, teamId: "racingbulls", name: "Racing Bulls", points: 44 },
                    { position: 9, teamId: "williams", name: "Williams", points: 17 },
                    { position: 10, teamId: "kicksauber", name: "Kick Sauber", points: 0 },
                ];

                setDriverRanks(mockDrivers);
                setTeamRanks(mockTeams);
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
                        <BreadcrumbLink href="/dashboard" className="text-sm">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/ranks" className="text-sm">Ranks</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-[100px] text-sm">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="border-stone-200">
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
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

            <div className="mx-6 sm:pb-5 pb-5 sm:pb-15">
                <Tabs defaultValue="drivers" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="drivers">Drivers Ranking</TabsTrigger>
                        <TabsTrigger value="teams">Teams Ranking</TabsTrigger>
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
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10">Loading ranks...</TableCell>
                                        </TableRow>
                                    ) : (
                                        driverRanks.map((rank) => (
                                            <TableRow key={rank.driverId} className="cursor-pointer hover:bg-stone-50 transition-colors border-b-stone-200">
                                                <TableCell className="font-bold" style={{ fontFamily: "'Formula 1', monospace" }}>
                                                    {rank.position}
                                                </TableCell>
                                                <TableCell className="font-semibold">{rank.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-1 h-4 rounded-full"
                                                            style={{ backgroundColor: TEAM_COLORS[TEAM_DISPLAY_MAP[rank.team] || rank.team] || "#ccc" }}
                                                        />
                                                        {TEAM_DISPLAY_MAP[rank.team] || rank.team}
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
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-10">Loading ranks...</TableCell>
                                        </TableRow>
                                    ) : (
                                        teamRanks.map((rank) => (
                                            <TableRow key={rank.teamId} className="cursor-pointer hover:bg-stone-50 transition-colors border-b-stone-200">
                                                <TableCell className="font-bold" style={{ fontFamily: "'Formula 1', monospace" }}>
                                                    {rank.position}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-1 h-4 rounded-full"
                                                            style={{ backgroundColor: TEAM_COLORS[TEAM_DISPLAY_MAP[rank.name] || rank.name] || "#ccc" }}
                                                        />
                                                        <span className="font-semibold">{rank.name}</span>
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
                </Tabs>
            </div>
        </div>
    );
}
