"use client"

import * as React from "react"
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, useReactTable, } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react"

import { RaceResult } from "@/types/result"
import { Schedule } from "@/types/schedule"
import { useLanguage } from "@/contexts/language-context"
import { formatDriverName, formatTeamName, formatGrandPrixId, formatGpName, translateCountry } from "@/lib/utils"

const isFutureRace = (schedule: any) => {
    const raceSession = schedule.sessions?.find((s: any) => s.name === "Race");
    if (!raceSession) return false;
    const timeMatch = raceSession.time.match(/^(\d{4})\.(\d{2})\.(\d{2})/);
    if (timeMatch) {
        // e.g. "2024-03-02T23:59:59" to allow same day to be clickable
        const raceDate = new Date(`${timeMatch[1]}-${timeMatch[2]}-${timeMatch[3]}T23:59:59`);
        return raceDate > new Date();
    }
    return false;
};

const getDriverImageUrl = (driver: string) => {
    if (!driver) return "";
    const [firstName, lastName] = driver.split(" ");
    if (!lastName) return "";
    const firstPart = firstName.slice(0, 3).toLowerCase();
    const lastPart = lastName.slice(0, 3).toLowerCase();
    return `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_auto/content/dam/fom-website/2018-redesign-assets/drivers/2025/${firstPart}${lastPart}01.png`;
};

const translateDate = (dateStr: string) => {
    if (!dateStr) return "";
    const months: Record<string, string> = {
        "Jan": "1월", "Feb": "2월", "Mar": "3월", "Apr": "4월", "May": "5월", "Jun": "6월",
        "Jul": "7월", "Aug": "8월", "Sep": "9월", "Oct": "10월", "Nov": "11월", "Dec": "12월"
    };
    let koDate = dateStr;
    for (const [eng, kor] of Object.entries(months)) {
        koDate = koDate.replace(new RegExp(eng, 'gi'), kor);
    }
    koDate = koDate.replace(/-/g, "~");
    if (/\d$/.test(koDate)) koDate += "일";
    return koDate;
};

export function ResultTable() {
    const { language } = useLanguage()
    const [year, setYear] = React.useState<string>("2026")
    const [schedules, setSchedules] = React.useState<any[]>([]);
    const [raceId, setRaceId] = React.useState<string>("");
    const [results, setResults] = React.useState<RaceResult[]>([]);
    const [selectedRace, setSelectedRace] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const prevYearRef = React.useRef<string | null>(null);

    const columns = React.useMemo<ColumnDef<RaceResult>[]>(() => {
        const teamColors: Record<string, string> = {
            "mercedes": "#00D7B6",
            "red_bull": "#4781D7",
            "ferrari": "#ED1131",
            "mclaren": "#F47600",
            "alpine": "#00A1E8",
            "rb": "#6C98FF",
            "aston_martin": "#229971",
            "williams": "#1868DB",
            "sauber": "#01C00E",
            "haas": "#9C9FA2",
        };

        return [
            {
                accessorKey: "position",
                header: "POS",
                cell: ({ row }) => (
                    <div className="font-bold" style={{ fontFamily: "'Formula 1', monospace" }}>
                        {row.original.position}
                    </div>
                ),
            },
            {
                accessorKey: "driverName",
                header: "DRIVER",
                cell: ({ row }) => (
                    <div className="font-semibold">
                        {formatDriverName(row.original.driverId, language)}
                    </div>
                )
            },
            {
                accessorKey: "constructorId",
                header: "TEAM",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-1 h-4 rounded-full"
                            style={{ backgroundColor: teamColors[row.original.constructorId] || "#ccc" }}
                        />
                        <span className="font-semibold">
                            {formatTeamName(row.original.constructorId, language)}
                        </span>
                    </div>
                )
            },
            {
                accessorKey: "timeOrGap",
                header: () => <div className="text-right">TIME / GAP</div>,
                cell: ({ row, table }) => {
                    const parseTime = (timeStr: string | null) => {
                        if (!timeStr || timeStr.toLowerCase().includes("lap")) return null;
                        const parts = timeStr.split(':');
                        let ms = 0;
                        if (parts.length === 3) {
                            const [h, m, s] = parts;
                            ms += parseInt(h) * 3600000;
                            ms += parseInt(m) * 60000;
                            ms += parseFloat(s) * 1000;
                        } else if (parts.length === 2) {
                            const [m, s] = parts;
                            ms += parseInt(m) * 60000;
                            ms += parseFloat(s) * 1000;
                        } else {
                            if (isNaN(parseFloat(timeStr))) return null;
                            ms = parseFloat(timeStr) * 1000;
                        }
                        return Math.round(ms);
                    };

                    const currTime = parseTime(row.original.timeOrGap);
                    if (!currTime || row.index === 0) {
                        return <div className="text-right tabular-nums">{row.original.timeOrGap}</div>;
                    }

                    const prevRow = table.getRowModel().rows[row.index - 1];
                    const prevTime = prevRow ? parseTime(prevRow.original.timeOrGap) : null;

                    if (currTime !== null && prevTime !== null) {
                        const diff = currTime - prevTime;
                        const formattedDiff = `+${(diff / 1000).toFixed(3)}s`;
                        return <div className="text-right tabular-nums">{formattedDiff}</div>;
                    }

                    return <div className="text-right tabular-nums">{row.original.timeOrGap}</div>;
                }
            },
            {
                accessorKey: "laps",
                header: () => <div className="text-right">LAPS</div>,
                cell: ({ row }) => <div className="text-right tabular-nums">{row.original.laps}</div>
            },
        ];
    }, [language]);

    React.useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                const response = await fetch(`${baseUrl}/api/v1/races/schedules?year=${year}`);
                if (!response.ok) throw new Error("Failed to fetch schedules");
                const data = await response.json();
                setSchedules(data);
                if (data.length > 0) {
                    if (prevYearRef.current !== year) {
                        if (prevYearRef.current === null) {
                            const pastRaces = data.filter((s: any) => !isFutureRace(s));
                            if (pastRaces.length > 0) {
                                setRaceId(pastRaces[pastRaces.length - 1].id.toString());
                            } else {
                                setRaceId(data[0].id.toString());
                            }
                        } else {
                            setRaceId(data[0].id.toString());
                        }
                        prevYearRef.current = year;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch schedules:", error);
            }
        };
        fetchSchedules();
    }, [year]);

    React.useEffect(() => {
        if (!raceId) return;
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                const response = await fetch(`${baseUrl}/api/v1/races/${raceId}/results`);
                if (!response.ok) throw new Error("Failed to fetch results");
                const data = await response.json();
                setResults(data);
                setSelectedRace(schedules.find(s => s.id.toString() === raceId));
            } catch (error) {
                console.error("Failed to fetch results:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, [raceId, schedules]);

    const table = useReactTable({
        data: results,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div>
            {/* Breadcrumb Area */}
            <Breadcrumb className="mx-7 mt-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard" className="text-sm">{language === 'ko' ? '홈' : 'Home'}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/results" className="text-sm">{language === 'ko' ? '경기 결과' : 'Results'}</BreadcrumbLink>
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
                                <SelectItem value="2023">2023</SelectItem>
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={raceId} onValueChange={setRaceId}>
                            <SelectTrigger className="w-fit text-sm">
                                <SelectValue placeholder="Grand Prix" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-200">
                                {schedules.map((schedule) => {
                                    const disabled = isFutureRace(schedule);
                                    return (
                                        <SelectItem
                                            key={schedule.id}
                                            value={schedule.id.toString()}
                                            disabled={disabled}
                                            className={disabled ? "text-stone-400" : ""}
                                        >
                                            {formatGrandPrixId(schedule.grandPrixId, language, false)}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value="Race">
                            <SelectTrigger className="w-fit text-sm">
                                <SelectValue placeholder="Session" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-200">
                                <SelectItem value="Race">{language === 'ko' ? '레이스' : 'Race'}</SelectItem>
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 대회 정보 영역 */}
            <div className="text-left px-8 sm:pb-5 pt-10 sm:pt-15 pb-10">
                <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>FORMULA 1</p>
                <h1 className="text-4xl font-bold uppercase">
                    {selectedRace?.grandPrixId ? formatGrandPrixId(selectedRace.grandPrixId, language) : formatGpName(`GRAND PRIX ${year}`, language)}
                </h1>
                <p className="text-xl font-bold text-gray-500 mt-3">RACE</p>
                <p className="text-gray-400 mt-3 italic">
                    {language === 'ko' && selectedRace?.date
                        ? translateDate(selectedRace.date)
                        : selectedRace?.date}
                </p>
                <p className="text-gray-400 italic">
                    {selectedRace?.circuit}
                </p>
                {/* Country Code & Flag */}
                <div className="flex items-center gap-1.5 text-sm font-medium">
                    <p className="text-gray-400 italic">
                        {selectedRace?.city}, {translateCountry(selectedRace?.country, language)}
                    </p>
                    {selectedRace && (
                        <img
                            src={`https://flagcdn.com/w2560/${selectedRace.countryCodeISO.toLowerCase()}.png`}
                            className="inline-block h-4 w-6 rounded-[0.175rem]"
                            alt={selectedRace.country}
                        />
                    )}
                </div>
            </div>

            {/* 테이블 & 서킷 정보 */}
            <div className="mx-6 sm:pb-5 pb-5 sm:pb-15 max-w-2xl">
                {/* 순위 정보 */}
                <div className="w-full">
                    {/* 테이블 박스 */}
                    <div className="overflow-hidden rounded-md border border-gray-200">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow key={hg.id} className="border-gray-200 bg-stone-100">
                                        {hg.headers.map((header, idx) => (
                                            <TableHead
                                                key={header.id}
                                                className={idx === 0 ? "pl-4" : ""}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 10 }).map((_, idx) => (
                                        <TableRow key={idx} className="border border-gray-200">
                                            <TableCell className="pl-4 py-4"><Skeleton className="h-6 w-8" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-12 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : table.getRowModel().rows.map((row) => {
                                    // 팀 색상 정의 (연하게)
                                    const teamColors: Record<string, string> = {
                                        "mercedes": "#00D7B6",
                                        "red_bull": "#4781D7",
                                        "ferrari": "#ED1131",
                                        "mclaren": "#F47600",
                                        "alpine": "#00A1E8",
                                        "rb": "#6C98FF",
                                        "aston_martin": "#229971",
                                        "williams": "#1868DB",
                                        "sauber": "#01C00E",
                                        "haas": "#9C9FA2",
                                    };

                                    const positionNum = parseInt(row.original.position);
                                    const isPodium = !isNaN(positionNum) && positionNum <= 3;
                                    const teamColor = teamColors[row.original.constructorId] || "#cccccc";
                                    const bgGradient = isPodium
                                        ? `linear-gradient(to right, ${teamColor}30 0%, ${teamColor}00 60%)`
                                        : undefined;

                                    const glow = isPodium
                                        ? "inset 0 0 20px 5px rgba(255,255,255,0.2)"
                                        : undefined;

                                    return (
                                        <TableRow
                                            key={row.id}
                                            className="border border-gray-200 transition-all duration-300"
                                        // style={{
                                        //     background: bgGradient,
                                        //     boxShadow: glow,
                                        // }}
                                        >
                                            {row.getVisibleCells().map((cell, idx) => (
                                                <TableCell key={cell.id} className={idx === 0 ? "pl-4" : ""}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>

                        </Table>
                    </div>

                    {/* 페이지네이션 */}
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="border-gray-200"
                        ><ArrowLeftToLine /></Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="border-gray-200"
                        ><ArrowRightToLine /></Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
