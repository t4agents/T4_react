import { config } from 'src/config';

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
    const response = await fetch(`${API_BASE_URL}/tenant`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tenant: ${response.statusText}`);
    }

    return response.json();
  },

  async updateTenant(data: Partial<Tenant>): Promise<Tenant> {
    const response = await fetch(`${API_BASE_URL}/tenant`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
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
