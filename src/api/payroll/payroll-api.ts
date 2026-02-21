import { PayrollPeriod, PayrollSchedule } from 'src/types/payroll';
import { config } from 'src/config';
import { apiFetch } from 'src/api/http';

const API_BASE_URL = config.api.baseUrl;

interface ListPayrollPeriodsParams {
    skip?: number;
    limit?: number;
    status?: string;
}

interface ListPayrollSchedulesParams {
    skip?: number;
    limit?: number;
    status?: string;
}

export const payrollAPI = {
    /**
     * Create a new payroll period
     */
    async createPayrollPeriod(data: Partial<PayrollPeriod>): Promise<PayrollPeriod> {
        const response = await apiFetch('/payroll/periods', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to create payroll period: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Get payroll period by ID
     */
    async getPayrollPeriod(periodId: string): Promise<PayrollPeriod> {
        const response = await apiFetch(`/payroll/periods/${periodId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch payroll period: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * List all payroll periods with pagination and filtering
     */
    async listPayrollPeriods(params?: ListPayrollPeriodsParams): Promise<PayrollPeriod[]> {
        const queryParams = new URLSearchParams();

        if (params?.skip !== undefined) {
            queryParams.append('skip', String(params.skip));
        }
        if (params?.limit !== undefined) {
            queryParams.append('limit', String(params.limit));
        }
        if (params?.status !== undefined) {
            queryParams.append('status', params.status);
        }

        const path = queryParams.toString()
            ? `/payroll/periods?${queryParams.toString()}`
            : '/payroll/periods';

        const response = await apiFetch(path);

        if (!response.ok) {
            throw new Error(`Failed to fetch payroll periods: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Update payroll period
     */
    async updatePayrollPeriod(periodId: string, data: Partial<PayrollPeriod>): Promise<PayrollPeriod> {
        const response = await apiFetch(`/payroll/periods/${periodId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to update payroll period: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Delete payroll period
     */
    async deletePayrollPeriod(periodId: string): Promise<void> {
        const response = await apiFetch(`/payroll/periods/${periodId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete payroll period: ${response.statusText}`);
        }
    },

    /**
     * Get current or active payroll period
     */
    async getActivePayrollPeriod(): Promise<PayrollPeriod> {
        const response = await apiFetch('/payroll/periods/active/current');

        if (!response.ok) {
            throw new Error(`Failed to fetch active payroll period: ${response.statusText}`);
        }

        return response.json();
    },

    // ==================== Payroll Schedule Methods ====================

    /**
     * Create a new payroll schedule
     */
    async createPayrollSchedule(
        data: Partial<PayrollSchedule>
    ): Promise<PayrollSchedule> {
        const response = await apiFetch('/payroll/schedule', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to create payroll schedule: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Get payroll schedule by ID
     */
    async getPayrollSchedule(scheduleId: string): Promise<PayrollSchedule> {
        const response = await apiFetch(`/payroll/schedule/${scheduleId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch payroll schedule: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * List all payroll schedules with pagination and filtering
     */
    async listPayrollSchedules(params?: ListPayrollSchedulesParams): Promise<PayrollSchedule[]> {
        const queryParams = new URLSearchParams();

        if (params?.skip !== undefined) {
            queryParams.append('skip', String(params.skip));
        }
        if (params?.limit !== undefined) {
            queryParams.append('limit', String(params.limit));
        }
        if (params?.status !== undefined) {
            queryParams.append('status', params.status);
        }

        const path = queryParams.toString()
            ? `/payroll/schedules?${queryParams.toString()}`
            : '/payroll/schedules';

        const response = await apiFetch(path);

        if (!response.ok) {
            throw new Error(`Failed to fetch payroll schedules: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Update payroll schedule
     */
    async updatePayrollSchedule(
        scheduleId: string,
        data: Partial<PayrollSchedule>
    ): Promise<PayrollSchedule> {
        const response = await apiFetch(`/payroll/schedule/${scheduleId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to update payroll schedule: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Delete payroll schedule
     */
    async deletePayrollSchedule(scheduleId: string): Promise<void> {
        const response = await apiFetch(`/payroll/schedule/${scheduleId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete payroll schedule: ${response.statusText}`);
        }
    },
};
