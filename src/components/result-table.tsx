"use client"

import * as React from "react"
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel, useReactTable, } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react"

// date type
export type RaceResult = {
    position: number
    point: number
    number: number
    driver: string
    team: string
    time: string
    laps: number
}

// data (hard-coded, should be received by api)
const data: RaceResult[] = [
    { position: 1, point: 25, number: 4, driver: "Lando Norris", team: "McLaren", time: "1:17.252", laps: 21 },
    { position: 2, point: 18, number: 55, driver: "Carlos Sainz", team: "Williams", time: "+0.149s", laps: 25 },
    { position: 3, point: 15, number: 16, driver: "Charles Leclerc", team: "Ferrari", time: "+0.209s", laps: 21 },
    { position: 4, point: 12, number: 81, driver: "Oscar Piastri", team: "McLaren", time: "+0.418s", laps: 20 },
    { position: 5, point: 10, number: 1, driver: "Max Verstappen", team: "Red Bull Racing", time: "+0.444s", laps: 21 },
    { position: 6, point: 8, number: 23, driver: "Alexander Albon", team: "Williams", time: "+0.461s", laps: 18 },
    { position: 7, point: 6, number: 63, driver: "George Russell", team: "Mercedes", time: "+0.464s", laps: 26 },
    { position: 8, point: 4, number: 14, driver: "Fernando Alonso", team: "Aston Martin", time: "+0.484s", laps: 23 },
    { position: 9, point: 2, number: 6, driver: "Isack Hadjar", team: "Racing Bulls", time: "+0.595s", laps: 25 },
    { position: 10, point: 1, number: 18, driver: "Lance Stroll", team: "Aston Martin", time: "+0.805s", laps: 20 },
    { position: 11, point: 0, number: 22, driver: "Yuki Tsunoda", team: "Racing Bulls", time: "+0.809s", laps: 23 },
    { position: 12, point: 0, number: 44, driver: "Lewis Hamilton", team: "Ferrari", time: "+0.819s", laps: 20 },
    { position: 13, point: 0, number: 7, driver: "Jack Doohan", team: "Alpine", time: "+0.980s", laps: 20 },
    { position: 14, point: 0, number: 12, driver: "Kimi Antonelli", team: "Mercedes", time: "+1.138s", laps: 25 },
    { position: 15, point: 0, number: 5, driver: "Gabriel Bortoleto", team: "Kick Sauber", time: "+1.186s", laps: 22 },
    { position: 16, point: 0, number: 30, driver: "Liam Lawson", team: "Red Bull Racing", time: "+1.203s", laps: 22 },
    { position: 17, point: 0, number: 10, driver: "Pierre Gasly", team: "Alpine", time: "+1.253s", laps: 23 },
    { position: 18, point: 0, number: 27, driver: "Nico Hulkenberg", team: "Kick Sauber", time: "+1.334s", laps: 18 },
    { position: 19, point: 0, number: 31, driver: "Esteban Ocon", team: "Haas", time: "+1.887s", laps: 16 },
    { position: 20, point: 0, number: 87, driver: "Oliver Bearman", team: "Haas", time: "+2.060s", laps: 12 },
]

const getDriverImageUrl = (driver: string) => {
    const [firstName, lastName] = driver.split(" ");
    const firstPart = firstName.slice(0, 3).toLowerCase();
    const lastPart = lastName.slice(0, 3).toLowerCase();
    return `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_auto/content/dam/fom-website/2018-redesign-assets/drivers/2025/${firstPart}${lastPart}01.png`;
};

export const columns: ColumnDef<RaceResult>[] = [
    {
        accessorKey: "position",
        header: "POS",
        cell: ({ row }) => (
            <div className="flex items-start relative">
                <span
                    className="text-2xl"
                    style={{ fontFamily: "'Formula 1', monospace" }}
                >{row.original.position}</span>
                <span className="text-xs text-green-600 ml-1 mt-1">+{row.original.point}</span>
            </div>
        ),
    },
    {
        accessorKey: "driver",
        header: "DRIVER",
        cell: ({ row }) => {
            const teamColors: Record<string, string> = {
                "Mercedes": "#00D7B6",
                "Red Bull Racing": "#4781D7",
                "Ferrari": "#ED1131",
                "McLaren": "#F47600",
                "Alpine": "#00A1E8",
                "Racing Bulls": "#6C98FF",
                "Aston Martin": "#229971",
                "Williams": "#1868DB",
                "Kick Sauber": "#01C00E",
                "Haas": "#9C9FA2",
            }

            return (
                <div className="flex items-center gap-2">
                    {/* 드라이버 이미지 + 배경 */}
                    <div
                        className="w-8 h-8 rounded-[0.375rem] flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: teamColors[row.original.team] }}
                    >
                        <img
                            src={getDriverImageUrl(row.original.driver)}
                            alt={row.original.driver}
                            className="w-7 h-7 object-contain"
                        />
                    </div>

                    {/* 드라이버 이름 + 팀/번호 */}
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.driver}</span>
                        <span className="text-gray-500 text-xs flex items-center gap-2">
                            <span>{row.original.number}</span>
                            <span className="border-l border-gray-400 h-4"></span>
                            <span>{row.original.team}</span>
                        </span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "time",
        header: "TIME / GAP",
    },
    {
        accessorKey: "laps",
        header: "LAPS",
    },
];

export function ResultTable() {
    const [year, setYear] = React.useState("2025");
    const [grandPrix, setGrandPrix] = React.useState("Australia");
    const [session, setSession] = React.useState("Practice 1");

    const table = useReactTable({
        data,
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
                        <BreadcrumbLink href="/dashboard" className="text-sm">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/results" className="text-sm">Results</BreadcrumbLink>
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
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={grandPrix} onValueChange={setGrandPrix}>
                            <SelectTrigger className="w-[120px] text-sm">
                                <SelectValue placeholder="Grand Prix" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-200">
                                <SelectItem value="Australia">Australia</SelectItem>
                                <SelectItem value="China">China</SelectItem>
                                <SelectItem value="Japan">Japan</SelectItem>
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <Select value={session} onValueChange={setSession}>
                            <SelectTrigger className="w-[120px] text-sm">
                                <SelectValue placeholder="Session" />
                            </SelectTrigger>
                            <SelectContent className="border-gray-200">
                                <SelectItem value="Practice 1">Practice 1</SelectItem>
                                <SelectItem value="Practice 2">Practice 2</SelectItem>
                                <SelectItem value="Practice 3">Practice 3</SelectItem>
                                <SelectItem value="Qualifying">Qualifying</SelectItem>
                                <SelectItem value="Race">Race</SelectItem>
                            </SelectContent>
                        </Select>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* 대회 정보 영역 */}
            <div className="text-left p-15 pb-10">
                <p className="text-xl" style={{ fontFamily: "'Formula 1', monospace" }}>FORMULA 1</p>
                <h1 className="text-4xl font-bold">{`LOUIS VUITTON ${grandPrix.toUpperCase()} GRAND PRIX ${year}`}</h1>
                <p className="text-xl font-bold text-gray-500 mt-3">{session.toUpperCase()}</p>
                <p className="text-gray-400 mt-3 italic">14 - 16 Mar {year}</p>
                <p className="text-gray-400 italic">Albert Park Grand Prix Circuit</p>
                {/* Country Code & Flag */}
                <div className="flex items-center gap-1.5 text-sm font-medium">
                    <p className="text-gray-400 italic">Melbourne, {grandPrix}</p>
                    <img
                        src={`https://flagcdn.com/w2560/${grandPrix === "Australia" ? "au" : grandPrix === "China" ? "cn" : "jp"}.png`}
                        className="inline-block h-4 w-6 rounded-[0.175rem]"
                        alt={grandPrix}
                    />
                </div>
            </div>

            {/* 테이블 & 서킷 정보 */}
            <div className="flex flex-col lg:flex-row mx-15 gap-20 items-start pb-15">
                {/* 순위 정보 */}
                <div className="flex-1">
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
                                {table.getRowModel().rows.map((row) => {
                                    // 팀 색상 정의 (연하게)
                                    const teamColors: Record<string, string> = {
                                        "Mercedes": "#00D7B6",
                                        "Red Bull Racing": "#4781D7",
                                        "Ferrari": "#ED1131",
                                        "McLaren": "#F47600",
                                        "Alpine": "#00A1E8",
                                        "Racing Bulls": "#6C98FF",
                                        "Aston Martin": "#229971",
                                        "Williams": "#1868DB",
                                        "Kick Sauber": "#01C00E",
                                        "Haas": "#9C9FA2",
                                    };

                                    const isPodium = row.original.position <= 3;
                                    const bgGradient = isPodium
                                        ? `linear-gradient(to right, ${teamColors[row.original.team]}30 0%, ${teamColors[row.original.team]}00 60%)`
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

                {/* 서킷 정보 */}
                <div className="w-full lg:w-1/2 flex-shrink-0">
                    <img
                        src="https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit"
                        alt="Australia Circuit Map"
                        className="rounded-md border-0"
                    />
                </div>
            </div>
        </div>
    )
}
