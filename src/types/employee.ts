export interface Employee {
    id: string;
    name?: {
        text?: string;
        image?: string;
    };
    position?: string;
    department?: string;
    employmentType?: 'hourly' | 'salary';
    regularHours?: number;
    hourlyRate?: number;
    overtimeHours?: number;
    overtimeRate?: number;
    salary?: number;
    bonus?: number;
    vacationPay?: number;
    status?: 'in_progress' | 'completed';
}