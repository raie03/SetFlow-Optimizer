export interface PerformanceData {
    name: string
    performers: string[]
}

export interface PerformanceDetail {
    from_performance: string
    to_performance: string
    overlapping_members: string[]
}

export interface ResultData {
    performancesName: string[]
    overlap_costs: number[]
    total_costs: number[]
    detail: PerformanceDetail[]
}