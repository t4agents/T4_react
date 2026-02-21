import { config } from 'src/config';
import { apiFetch } from 'src/api/http';

const API_BASE_URL = config.api.baseUrl;

export interface ClientPayload {
  type: string;
  name: string;
  business_number: string;
  payroll_account_number: string;
  province: string;
  street_address: string;
  city: string;
  postal_code: string;
  phone: string;
  email: string;
  wsib_number?: string;
  eht_account?: string;
  remittance_frequency?: string;
  tax_year_end?: string;
  legal_name?: string;
  operating_name?: string;
  business_type?: string;
  incorporation_date?: string;
  employee_count?: number;
}

export const clientsAPI = {
  async createClient(data: ClientPayload) {
    const response = await apiFetch('/biz-entity', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create client: ${response.status} ${text}`);
    }

    return response.json();
  },

  async listClients() {
    const response = await apiFetch('/biz-entity');
    if (!response.ok) {
      throw new Error(`Failed to fetch clients: ${response.statusText}`);
    }
    return response.json();
  },

  async updateClient(id: string, data: Partial<ClientPayload>) {
    const response = await apiFetch(`/biz-entity/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to update client: ${response.status} ${text}`);
    }

    return response.json();
  },

  async softDeleteClient(id: string) {
    // Call DELETE endpoint which sets is_deleted = true on backend
    const response = await apiFetch(`/biz-entity/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to delete client: ${response.status} ${text}`);
    }

    return response.json();
  },
};

export default clientsAPI;
