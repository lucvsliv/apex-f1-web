"use client";

import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cars } from "@/data/cars";
import { teams } from "@/data/teams";
import { useRouter } from "next/navigation";

export default function CarGrid() {
    const [windowWidth, setWindowWidth] = React.useState<number>(0);
    const [year, setYear] = React.useState<string>("2025"); // 기본 연도
    const router = useRouter();

    React.useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


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
                <h1 className="text-4xl font-bold">CARS {year}</h1>
            </div>

            {/* 팀 차들 */}
            <div className="relative w-full pt-5 p-15 rounded-xl overflow-hidden pb-15">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
                    {cars.map((car, index) => {
                        const showText = windowWidth >= 400;
                        const team = teams.find(t => t.shortName === car.team);
                        return (
                            <Card
                                key={car.team}
                                className="relative flex flex-col p-4 rounded-lg transition-all bg-gradient-to-t border-b-0 border-gray-200 overflow-hidden min-h-[180px] cursor-pointer hover:shadow-xl"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animationFillMode: "backwards",
                                }}
                                onClick={() => router.push(`/cars/${car.team.toLowerCase()}`)}
                            >
                                <CardContent className={`flex flex-col justify-start gap-2 p-0 bg-transparent shadow-none w-full px-2 pt-2 ${!showText ? "items-center" : ""}`}>
                                    {showText && (
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                {team?.img && (
                                                    <img
                                                        src={team.img}
                                                        alt={team.name}
                                                        className="w-5 h-5"
                                                    />
                                                )}
                                                <p className="text-sm">{team?.shortName}</p>
                                            </div>
                                            <p className="text-xl font-bold">{car.year} Car</p>
                                        </div>
                                    )}
                                </CardContent>

                                <img
                                    src={car.img}
                                    alt={`${car.team} Car`}
                                    className="w-full h-40 object-contain rounded-[0.175rem] mt-2"
                                />

                                <div
                                    className="absolute bottom-0 left-0 w-full h-1 pointer-events-none"
                                    style={{ backgroundColor: team?.color }}
                                />
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
