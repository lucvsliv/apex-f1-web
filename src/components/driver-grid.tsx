"use client";

import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { drivers } from "@/data/drivers";
import { useRouter } from "next/navigation";
import {teams} from "@/data/teams";

type Driver = {
    number: number;
    firstName: string;
    lastName: string;
    team: string;
    teamColor: string;
    img: string;
    position: number;
};

export default function DriverGrid() {
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
                <h1 className="text-4xl font-bold">DRIVERS {year}</h1>
            </div>

            {/* 드라이버들 */}
            <div className="relative w-full pt-5 p-15 rounded-xl overflow-hidden pb-15">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {drivers.map((driver, index) => {
                        const showText = windowWidth >= 400; // 400px 이하이면 텍스트 숨김
                        return (
                            <Card
                                key={driver.number}
                                className="relative flex flex-col p-4 rounded-lg transition-all bg-gradient-to-t border-b-0 border-gray-200 overflow-hidden min-h-[180px] cursor-pointer hover:shadow-xl"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animationFillMode: "backwards",
                                }}
                                onClick={() => router.push(`/drivers/${driver.number}`)}
                            >
                                <CardContent className={`flex flex-col justify-start gap-2 p-0 bg-transparent shadow-none w-full px-2 pt-2 ${!showText ? "items-center" : ""}`}>
                                    {showText && (
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={teams.find(t => t.shortName === driver.team)?.img}
                                                    alt={driver.team}
                                                    className="w-5 h-5"
                                                />
                                                <p className="text-sm">{driver.team}</p>
                                            </div>
                                            <p className="text-xl font-bold">{driver.firstName} {driver.lastName}</p>
                                            <p className="font-bold text-xl text-gray-600">{driver.number}</p>
                                        </div>
                                    )}
                                </CardContent>

                                <img
                                    src={driver.img}
                                    alt={driver.lastName}
                                    className="w-30 h-30 rounded-[0.175rem] absolute bottom-0 right-4 pointer-events-none"
                                />

                                <div
                                    className="absolute bottom-0 left-0 w-full h-1 pointer-events-none"
                                    style={{ backgroundColor: driver.teamColor }}
                                />
                                {/* 선수 국기 */}
                                <div className="absolute top-2 right-2 pt-5 pr-4">
                                    <div className="flex items-center gap-1.5 text-sm font-medium">
                                        <img
                                            src={`https://flagcdn.com/w2560/${driver.countryCodeISO.toLowerCase()}.png`}
                                            className="inline-block h-4 w-6 rounded-[0.175rem]"
                                            alt={driver.countryCode}
                                        />
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
