import { config } from 'src/config';
import { apiFetch } from 'src/api/http';

const API_BASE_URL = config.api.baseUrl;

export interface Tenant {
  id?: string;
  name?: string;
  organization_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
}

export const tenantAPI = {
  async getCurrentTenant(): Promise<Tenant> {
    const response = await apiFetch('/tenant', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tenant: ${response.statusText}`);
    }

    return response.json();
  },

  async updateTenant(data: Partial<Tenant>): Promise<Tenant> {
    const response = await apiFetch('/tenant', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to update tenant: ${response.status} ${text}`);
    }

    return response.json();
  },
};

export default tenantAPI;
