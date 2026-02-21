// src/types/schedule.ts
export interface Schedule {
    isCurrent: boolean
    round: string
    countryCode: string
    countryCodeISO: string
    name: string
    date: string
    circuit: string
    country: string
    city: string
    sessions: { name: string; time: string }[]
}