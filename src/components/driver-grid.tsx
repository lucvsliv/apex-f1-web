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
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemHeader,
    ItemTitle,
} from "@/components/ui/item";

type SeasonDriverSummary = {
    driverId: string;
    name: string;
    team: string;
    country: string;
    number: number | null;
};

// 💡 팀명을 간략하게 보여주기 위한 표시용 사전 (이미지 URL 조합과는 무관함)
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

export default function DriverGrid() {
    const router = useRouter();
    const [year, setYear] = React.useState<string>("2026");
    const [drivers, setDrivers] = React.useState<SeasonDriverSummary[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        const fetchDrivers = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/seasons/${year}/drivers`);

                if (response.data) {
                    setDrivers(response.data);
                }
            } catch (error) {
                console.error("Error fetching drivers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDrivers();
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
                        <BreadcrumbLink href="/dashboard/schedules" className="text-sm">Drivers</BreadcrumbLink>
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

            {/* 그랑프리 년도 타이틀 */}
            <div className="text-left p-15 pb-10">
                <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>FORMULA 1</p>
                <h1 className="text-4xl font-bold">DRIVERS {year}</h1>
            </div>

            {/* 드라이버 아이템 리스트 */}
            <div className="w-full pt-5 p-15 pb-15">
                {isLoading ? (
                    <div className="flex justify-center py-20 text-gray-500">
                        Loading drivers...
                    </div>
                ) : (
                    <ItemGroup className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6">
                        {drivers.map((driver) => {
                            const imagePath = `/profile/${year}-${driver.driverId}.png`;

                            return (
                                <Item
                                    key={driver.driverId}
                                    variant="outline"
                                    className="cursor-pointer hover:shadow-lg transition-shadow border-stone-200 duration-200"
                                    onClick={() => router.push(`/dashboard/drivers/${year}/${driver.driverId}`)}
                                >
                                    <ItemHeader>
                                        <Image
                                            src={imagePath}
                                            alt={driver.name}
                                            width={300}
                                            height={300}
                                            className="aspect-square w-full rounded-sm object-cover object-top"
                                        />
                                    </ItemHeader>
                                    <ItemContent className="overflow-hidden">
                                        <ItemTitle className="flex items-center justify-between gap-2">
                                            <span
                                                className="font-bold text-sm truncate flex-1"
                                                title={driver.name}
                                            >
                                                {driver.name}
                                            </span>
                                            {driver.number && (
                                                <span className="text-gray-400 text-sm flex-shrink-0">
                                                    #{driver.number}
                                                </span>
                                            )}
                                        </ItemTitle>
                                        <ItemDescription className="text-xs mt-1 truncate" title={driver.team}>
                                            <span className="font-semibold text-gray-700">
                                                {TEAM_DISPLAY_MAP[driver.team] || driver.team}
                                            </span>
                                        </ItemDescription>
                                    </ItemContent>
                                </Item>
                            );
                        })}
                    </ItemGroup>
                )}
            </div>
        </div>
    );
}