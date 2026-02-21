// app/page.tsx
import F1Dashboard from "@/components/apex-dashboard";
import { teams } from "@/data/teams";
import { drivers } from "@/data/drivers";

export default function HomePage() {
    return (
        <main className="w-full min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-6">2025 F1 Dashboard</h1>
            <F1Dashboard teams={teams} drivers={drivers} />
        </main>
    );
}
