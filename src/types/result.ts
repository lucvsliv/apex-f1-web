// src/types/result.ts
export interface RaceResult {
    position: string;
    driverId: string;
    driverName: string;
    driverNumber: string;
    constructorId: string;
    laps: number | null;
    timeOrGap: string | null;
    points: number | null;
    status: string | null;
}
