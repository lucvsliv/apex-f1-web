// app/dashboard/schedules/page.tsx
import { ScheduleCard } from "@/components/schedule-card"
import { schedules } from "@/data/schedules"

export default function Page() {
    return (
        <div className="flex-1">
            <ScheduleCard schedules={schedules} />
        </div>
    )
}
