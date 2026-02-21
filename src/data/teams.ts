import {drivers} from "@/data/drivers";

export function getTeamImageUrl(teamName: string): string {
    // 팀 폴더/파일명은 소문자 + 공백 제거
    const folderName = teamName.toLowerCase().replace(/\s/g, '');
    const fileName = `2025${folderName}logo.webp`;

    return `https://media.formula1.com/image/upload/c_lfill,w_48/q_auto/v1740000000/common/f1/2025/${folderName}/${fileName}`;
}

export const teams = [
    {
        name: "McLaren Formula 1 Team",
        shortName: "McLaren",
        color: "#F47600",
        img: getTeamImageUrl("McLaren"),
        drivers: drivers.filter(d => d.team === "McLaren"),
    },
    {
        name: "Scuderia Ferrari HP",
        shortName: "Ferrari",
        color: "#ED1131",
        img: getTeamImageUrl("Ferrari"),
        drivers: drivers.filter(d => d.team === "Ferrari"),
    },
    {
        name: "Mercedes-AMG PETRONAS Formula One Team",
        shortName: "Mercedes",
        color: "#00D7B6",
        img: getTeamImageUrl("Mercedes"),
        drivers: drivers.filter(d => d.team === "Mercedes"),
    },
    {
        name: "Oracle Red Bull Racing",
        shortName: "Red Bull Racing",
        color: "#4781D7",
        img: getTeamImageUrl("Red Bull Racing"),
        drivers: drivers.filter(d => d.team === "Red Bull Racing"),
    },
    {
        name: "Aston Martin Aramco Formula One Team",
        shortName: "Aston Martin",
        color: "#229971",
        img: getTeamImageUrl("Aston Martin"),
        drivers: drivers.filter(d => d.team === "Aston Martin"),
    },
    {
        name: "BWT Alpine Formula One Team",
        shortName: "Alpine",
        color: "#00A1E8",
        img: getTeamImageUrl("Alpine"),
        drivers: drivers.filter(d => d.team === "Alpine"),
    },
    {
        name: "Atlassian Williams Racing",
        shortName: "Williams",
        color: "#1868DB",
        img: getTeamImageUrl("Williams"),
        drivers: drivers.filter(d => d.team === "Williams"),
    },
    {
        name: "Visa Cash App Racing Bulls Formula One Team",
        shortName: "Racing Bulls",
        color: "#6C98FF",
        img: getTeamImageUrl("Racing Bulls"),
        drivers: drivers.filter(d => d.team === "Racing Bulls"),
    },
    {
        name: "Stake F1 Team Kick Sauber",
        shortName: "Kick Sauber",
        color: "#01C00E",
        img: getTeamImageUrl("Kick Sauber"),
        drivers: drivers.filter(d => d.team === "Kick Sauber"),
    },
    {
        name: "MoneyGram Haas F1 Team",
        shortName: "Haas",
        color: "#9C9FA2",
        img: getTeamImageUrl("Haas"),
        drivers: drivers.filter(d => d.team === "Haas"),
    },
];
