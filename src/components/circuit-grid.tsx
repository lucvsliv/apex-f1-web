"use client";

import * as React from "react";
import { circuits } from "@/data/circuits";
import { schedules } from "@/data/schedules";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export default function CircuitGrid() {
    const [selectedCircuitId, setSelectedCircuitId] = React.useState<number | null>(null);
    const [year, setYear] = React.useState<string>("2025"); // 기본 연도

    const handleCardClick = (id: number) => setSelectedCircuitId(id);
    const handleClose = () => setSelectedCircuitId(null);

    const selectedCircuit = circuits.find(c => c.id === selectedCircuitId);
    const selectedSchedule = selectedCircuit ? schedules.find(s => s.circuit === selectedCircuit.name && s.date.includes(year)) : null;

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
                        <BreadcrumbLink href="/dashboard/cars" className="text-sm">Cars</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={year} onValueChange={(val) => setYear(val)}>
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
            <div className="text-left px-8 sm:pb-5 pt-10 sm:pt-15 pb-10">
                <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>FORMULA 1</p>
                <h1 className="text-4xl font-bold">CIRCUITS {year}</h1> {/* 선택한 연도 적용 */}
            </div>

            {/* 서킷 정보 */}
            <div className="w-full pt-5 px-6 sm:pb-5 pb-5 sm:pb-15">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                    {circuits.map(circuit => (
                        <Card
                            key={circuit.id}
                            className="relative cursor-pointer hover:shadow-xl transition border-gray-200"
                            onClick={() => handleCardClick(circuit.id)}
                        >
                            {/* CardHeader */}
                            <CardHeader className="px-5 pb-2">
                                <p className="font-bold text-xl">{circuit.name}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>{circuit.city}, {circuit.country}</span>
                                    <img
                                        src={`https://flagcdn.com/w2560/${circuit.countryCodeISO.toLowerCase()}.png`}
                                        className="inline-block h-4 w-6 rounded-[0.175rem]"
                                        alt={circuit.countryCodeISO}/>
                                </div>
                            </CardHeader>

                            {/* 이미지 */}
                            <CardContent className="p-0">
                                <div className="w-full aspect-[16/9] overflow-hidden rounded-b-lg">
                                    <img
                                        src={circuit.img}
                                        alt={circuit.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </CardContent>

                        </Card>
                    ))}
                </div>

                {/* 모달 */}
                {selectedCircuit && selectedSchedule && (
                    <Dialog open={true} onOpenChange={handleClose}>
                        <DialogContent className="max-w-lg border-gray-200">
                            <DialogHeader>
                                <DialogTitle>{selectedCircuit.name}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-2">
                                <p className="text-sm text-gray-600 mb-2">
                                    Location: {selectedCircuit.city}, {selectedCircuit.country}
                                </p>
                                <p className="text-sm font-semibold mb-2">Sessions:</p>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                    {selectedSchedule.sessions.map((session, index) => (
                                        <li key={index}>
                                            {session.name}: {session.time}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <DialogClose className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                                Close
                            </DialogClose>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}
