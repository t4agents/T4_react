export interface PayrollPeriod {
    id?: string;
    name: string;
    start_date: string;
    end_date: string;
    status?: 'draft' | 'in_progress' | 'completed' | 'archived';
    description?: string;
    pay_date?: string;
    created_at?: string;
    updated_at?: string;
}
