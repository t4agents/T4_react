import { Employee } from 'src/types/employee';
import { config } from 'src/config';
import { auth } from "src/lib/firebase";
const user = auth.currentUser;
const token = await user?.getIdToken();

const API_BASE_URL = config.api.baseUrl;

interface ListEmployeesParams {
    skip?: number;
    limit?: number;
}

interface SearchEmployeesParams {
    first_name: string;
    last_name: string;
}

export const employeeAPI = {
    /**
     * Create a new employee
     */
    async createEmployee(data: Partial<Employee>): Promise<Employee> {
        const response = await fetch(`${API_BASE_URL}/employee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to create employee: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Get employee by ID
     */
    async getEmployee(employeeId: string): Promise<Employee> {
        const response = await fetch(`${API_BASE_URL}/employee/${employeeId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch employee: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * List all employees with pagination
     */
    async listEmployees(params?: ListEmployeesParams): Promise<Employee[]> {
        const queryParams = new URLSearchParams();
        if (params?.skip !== undefined) {
            queryParams.append('skip', String(params.skip));
        }
        if (params?.limit !== undefined) {
            queryParams.append('limit', String(params.limit));
        }

        const url = queryParams.toString()
            ? `${API_BASE_URL}/employee?${queryParams.toString()}`
            : `${API_BASE_URL}/employee`;

        // const response = await fetch(url);
        
        // console.log('Employee API - listEmployees - token:', token);

        const response = await fetch(url, {headers: {Authorization: `Bearer ${token}`,},});

        if (!response.ok) {
            throw new Error(`Failed to fetch employees: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Search employees by name
     */
    async searchEmployees(params: SearchEmployeesParams): Promise<Employee[]> {
        const queryParams = new URLSearchParams({
            first_name: params.first_name,
            last_name: params.last_name,
        });

        const response = await fetch(`${API_BASE_URL}/employee/search/by-name?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error(`Failed to search employees: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Update employee
     */
    async updateEmployee(employeeId: string, data: Partial<Employee>): Promise<Employee> {
        const response = await fetch(`${API_BASE_URL}/employee/${employeeId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to update employee: ${response.statusText}`);
        }

        return response.json();
    },

    /**
     * Delete employee
     */
    async deleteEmployee(employeeId: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/employee/${employeeId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete employee: ${response.statusText}`);
        }
    },

    /**
     * Get total employee count
     */
    async getEmployeeCount(): Promise<number> {
        const response = await fetch(`${API_BASE_URL}/employee/stats/count`, {headers: {Authorization: `Bearer ${token}`,},});

        if (!response.ok) {
            throw new Error(`Failed to fetch employee count: ${response.statusText}`);
        }

        const data = await response.json();
        return data.count || 0;
    },
};
