import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function F1Dashboard({ teams, drivers }: { teams: typeof teams; drivers: typeof drivers }) {
    return (
        <div className="w-full max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">

            {/* Teams Section */}
            <div className="lg:w-1/3 w-full">
                <h2 className="text-2xl font-bold mb-4">Teams</h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
                    {teams.map((team, idx) => (
                        <Card key={idx} className="w-full rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                            <CardHeader className="px-3 flex items-center gap-3" style={{ minHeight: "64px" }}>
                                <img src={team.img} alt={team.shortName} className="w-11 h-11 rounded-md" />
                                <div className="flex flex-col justify-center">
                                    <CardTitle className="text-xl font-semibold">{team.shortName}</CardTitle>
                                    <CardDescription className="text-sm text-gray-600">{team.name}</CardDescription>
                                </div>
                            </CardHeader>
                            <div className="border-t border-dashed border-gray-300" />
                            <CardContent className="pt-0 px-3 pb-3">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Team Color</span>
                                    <div
                                        className="w-6 h-6 rounded-[0.375rem] border border-gray-200"
                                        style={{ backgroundColor: team.color }}
                                    />
                                </div>
                                {/* 드라이버 버튼 */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {team.drivers.map(driver => (
                                        <Button key={driver.number} variant="outline" size="sm" asChild>
                                            <Link href={`/drivers/${driver.number}`} className="flex items-center gap-1">
                                                <img src={driver.img} alt={driver.lastName} className="w-5 h-5 rounded-sm" />
                                                {driver.firstName} {driver.lastName}
                                            </Link>
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Drivers Section */}
            <div className="lg:w-2/3 w-full">
                <h2 className="text-2xl font-bold mb-4">Drivers</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {drivers.map((driver, index) => {
                        const isRightColumn = index % 2 === 1;
                        return (
                            <Card
                                key={driver.number}
                                className={`relative flex flex-col p-2 rounded-lg shadow-md transition-all animate-fadeIn border-gray-200`}
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animationFillMode: "backwards",
                                    transform: isRightColumn ? "translateY(2.75rem)" : "none",
                                    backgroundImage: `linear-gradient(to top, ${driver.teamColor}50 0%, ${driver.teamColor}00 30%)`
                                }}
                            >
                                <CardContent className="flex flex-col justify-start gap-2 p-0 bg-transparent shadow-none w-full px-2 pt-2">
                                    <div className="flex flex-col">
                                        <p className="text-base">{driver.team}</p>
                                        <p className="text-xl font-bold">{driver.firstName} {driver.lastName}</p>
                                        <p className="font-bold text-xl text-gray-600">{driver.number}</p>
                                    </div>
                                </CardContent>
                                {/* Driver Image */}
                                <img
                                    src={driver.img}
                                    alt={driver.lastName}
                                    className="w-28 h-28 rounded-[0.175rem] absolute bottom-2 right-2"
                                />
                            </Card>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
