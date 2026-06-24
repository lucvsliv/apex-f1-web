"use client";

import * as React from "react";
import { circuits as staticCircuits } from "@/data/circuits";
import api from "@/lib/api/client";
import { useLanguage } from "@/contexts/language-context";
import { translateCircuitName, translateCity, translateCountry } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CircuitGrid() {
    const { language } = useLanguage();
    const [selectedCircuitId, setSelectedCircuitId] = React.useState<string | null>(null);
    const [year, setYear] = React.useState<string>("2026"); // Default year to 2026
    const [schedules, setSchedules] = React.useState<any[]>([]);
    const [circuits, setCircuits] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const years = Array.from({ length: 2026 - 2000 + 1 }, (_, i) => (2026 - i).toString());

    React.useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [schedulesRes, circuitsRes] = await Promise.all([
                    api.get(`/races/schedules?year=${year}`),
                    api.get(`/seasons/${year}/circuits`)
                ]);
                if (schedulesRes.data) setSchedules(schedulesRes.data);
                if (circuitsRes.data) setCircuits(circuitsRes.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [year]);

    const handleCardClick = (id: string) => setSelectedCircuitId(id);
    const handleClose = () => setSelectedCircuitId(null);

    const selectedCircuit = circuits.find(c => c.id === selectedCircuitId);
    // Since API returns schedules for the selected year, we can match by circuit ID or name
    const selectedSchedule = selectedCircuit ? schedules.find(s => s.circuit === selectedCircuit.fullName || s.circuit === selectedCircuit.name) : null;

    const getCircuitImage = (circuit: any) => {
        if (year === "2026") {
            const exceptions: Record<string, string> = {
                "Miami Gardens": "miami",
                "Montmeló": "catalunya",
                "Spa": "spafrancorchamps",
                "Budapest": "hungaroring",
                "São Paulo": "interlagos",
                "Abu Dhabi": "yasmarinacircuit"
            };

            // Check exception map first (by circuit.id or circuit.city)
            let cleanedCity = exceptions[circuit.id] || exceptions[circuit.city];

            if (!cleanedCity) {
                cleanedCity = circuit.city.toLowerCase().replace(/[\s-]/g, '');
            }

            return `https://media.formula1.com/image/upload/c_fit,h_704/q_auto/v1740000000/common/f1/2026/track/2026track${cleanedCity}detailed.webp`;
        }
        const staticCircuit = staticCircuits.find(c => c.name === circuit.fullName || c.city === circuit.city || c.name === circuit.name);
        return staticCircuit?.img || "/images/circuit-placeholder.png";
    };

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
                        <BreadcrumbLink href="/dashboard/circuits" className="text-sm">
                            {language === 'ko' ? '서킷 정보' : 'Circuits'}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={year} onValueChange={(val) => setYear(val)}>
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

            {/* 그랑프리 년도 정보 */}
            <div className="text-left px-8 sm:pb-5 pt-10 sm:pt-15 pb-10">
                <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>FORMULA 1</p>
                <h1 className="text-4xl font-bold">CIRCUITS {year}</h1> {/* 선택한 연도 적용 */}
            </div>

            {/* 서킷 정보 */}
            <div className="w-full pt-5 px-6 sm:pb-5 pb-5 sm:pb-15">
                {isLoading ? (
                    <div className="flex justify-center py-20 text-gray-500">
                        Loading circuits...
                    </div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                        {circuits.map(circuit => (
                            <Card
                                key={circuit.id}
                                className="relative cursor-pointer hover:shadow-xl transition border-stone-200"
                                onClick={() => handleCardClick(circuit.id)}
                            >
                                {/* CardHeader */}
                                <CardHeader className="px-5 pb-2">
                                    <p className="font-bold text-xl">{translateCircuitName(circuit.fullName, language)}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>{translateCity(circuit.city, language)}, {translateCountry(circuit.country, language)}</span>
                                        <img
                                            src={`https://flagcdn.com/w2560/${circuit.countryCodeISO.toLowerCase()}.png`}
                                            className="inline-block h-4 w-6 rounded-[0.175rem]"
                                            alt={circuit.countryCodeISO} />
                                    </div>
                                </CardHeader>

                                {/* 이미지 */}
                                <CardContent className="p-0">
                                    <div className="w-full aspect-[16/9] overflow-hidden rounded-b-lg">
                                        <img
                                            src={getCircuitImage(circuit)}
                                            alt={circuit.fullName}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/images/circuit-placeholder.png";
                                            }}
                                        />
                                    </div>
                                </CardContent>

                            </Card>
                        ))}
                    </div>
                )}

                {/* 모달 */}
                {selectedCircuit && selectedSchedule && (
                    <Dialog open={true} onOpenChange={handleClose}>
                        <DialogContent className="max-w-lg border-stone-200">
                            <DialogHeader>
                                <DialogTitle>{translateCircuitName(selectedCircuit.fullName, language)}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-2">
                                <p className="text-sm text-gray-600 mb-2">
                                    Location: {translateCity(selectedCircuit.city, language)}, {translateCountry(selectedCircuit.country, language)}
                                </p>
                                <p className="text-sm font-semibold mb-2">Sessions:</p>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {selectedSchedule.sessions.map((session: any, index: number) => (
                                        <li key={index}>
                                            {session.name}: {session.time}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <DialogClose className="mt-4 px-4 py-2 bg-stone-200 rounded hover:bg-stone-300">
                                Close
                            </DialogClose>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}
