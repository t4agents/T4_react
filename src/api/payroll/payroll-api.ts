import { PayrollPeriod } from 'src/types/payroll';
import { config } from 'src/config';

const API_BASE_URL = config.api.baseUrl;

interface ListPayrollPeriodsParams {
  skip?: number;
  limit?: number;
  status?: string;
}

export const payrollAPI = {
  /**
   * Create a new payroll period
   */
  async createPayrollPeriod(data: Partial<PayrollPeriod>): Promise<PayrollPeriod> {
    const response = await fetch(`${API_BASE_URL}/payroll-periods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_BASE_URL}/payroll-periods/${periodId}`);

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

    const url = queryParams.toString()
      ? `${API_BASE_URL}/payroll-periods?${queryParams.toString()}`
      : `${API_BASE_URL}/payroll-periods`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch payroll periods: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Update payroll period
   */
  async updatePayrollPeriod(periodId: string, data: Partial<PayrollPeriod>): Promise<PayrollPeriod> {
    const response = await fetch(`${API_BASE_URL}/payroll-periods/${periodId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`${API_BASE_URL}/payroll-periods/${periodId}`, {
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
    const response = await fetch(`${API_BASE_URL}/payroll-periods/active/current`);

    if (!response.ok) {
      throw new Error(`Failed to fetch active payroll period: ${response.statusText}`);
    }

    return response.json();
  },
};
