export interface PayrollPeriod {
    id?: string;
    payroll_schedule_id: string;
    start_date: string;
    end_date: string;
    pay_date: string;
    status?: 'draft' | 'in_progress' | 'completed' | 'archived';
    created_at?: string;
    updated_at?: string;
}

export interface PayrollSchedule {
    id?: string;
    frequency: string;
    anchor_date: string;
    pay_date_offset_days: number;
    effective_from: string;
    effective_to?: string | null;
    status: 'active' | 'inactive';
    created_at?: string;
    updated_at?: string;
}
