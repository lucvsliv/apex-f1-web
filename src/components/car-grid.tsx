"use client";

import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { SeasonCar } from "@/types/car";
import api from "@/lib/api/client";
import { formatTeamName } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function CarGrid() {
    const [windowWidth, setWindowWidth] = React.useState<number>(0);
    const [year, setYear] = React.useState<string>("2026"); // 기본 연도
    const [cars, setCars] = React.useState<SeasonCar[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const router = useRouter();
    const { language } = useLanguage();

    React.useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    React.useEffect(() => {
        const fetchCars = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/seasons/${year}/cars`);
                setCars(response.data);
            } catch (error) {
                console.error("Failed to fetch cars:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCars();
    }, [year]);


    return (
        <div>
            {/* Breadcrumb */}
            <Breadcrumb className="mx-7 mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-sm">{language === 'ko' ? '홈' : 'Home'}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/cars" className="text-sm">
                            {language === 'ko' ? '레이스카' : 'Cars'}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-fit text-sm">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-200">
                                <SelectItem value="2026">2026</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 그랑프리 년도 정보 */}
            <div className="text-left px-8 sm:pb-5 pt-10 sm:pt-15 pb-10">
                <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>FORMULA 1</p>
                <h1 className="text-4xl font-bold">CARS {year}</h1>
            </div>

            {/* 팀 차들 */}
            <div className="relative w-full pt-5 px-6 sm:pb-5 rounded-xl overflow-hidden pb-5 sm:pb-15">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
                    {isLoading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-[250px] w-full rounded-lg" />
                        ))
                    ) : (
                        cars.map((car, index) => {
                            const showText = windowWidth >= 400;
                            let urlConstructorId = car.constructorId.replace(/[-_]/g, '').toLowerCase();
                            if (urlConstructorId === 'redbull') {
                                urlConstructorId = 'redbullracing';
                            }
                            const imgUrl = `https://media.formula1.com/image/upload/c_lfill,h_224/q_auto/d_common:f1:${year}:fallback:car:${year}fallbackcarright.webp/v1740000001/common/f1/${year}/${urlConstructorId}/${year}${urlConstructorId}carright.webp`;
                            return (
                                <Card
                                    key={car.constructorId}
                                    className="relative flex flex-col p-4 rounded-lg transition-all bg-gradient-to-t border-b-0 border-gray-200 overflow-hidden min-h-[180px] cursor-pointer hover:shadow-xl"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                        animationFillMode: "backwards",
                                    }}
                                    onClick={() => router.push(`/dashboard/teams/${car.constructorId}`)}
                                >
                                    <CardContent className={`flex flex-col justify-start gap-2 p-0 bg-transparent shadow-none w-full px-2 pt-2 ${!showText ? "items-center" : ""}`}>
                                        {showText && (
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm">{formatTeamName(car.constructorId, language)}</p>
                                                </div>
                                                <p className="text-xl font-bold">{car.chassisName}</p>
                                            </div>
                                        )}
                                    </CardContent>

                                    <img
                                        src={imgUrl}
                                        alt={`${formatTeamName(car.constructorId, language)} Car`}
                                        className="w-full h-40 object-contain rounded-[0.175rem] mt-2"
                                    />
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
