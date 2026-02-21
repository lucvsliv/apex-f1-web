// app/dashboard/schedules/page.tsx
import { TeamCard } from "@/components/team-card"
import { schedules } from "@/data/schedules"

export default function Page() {
    return (
        <div className="flex-1">
            <TeamCard schedules={schedules} />
        </div>
    )
}
