import { config } from 'src/config';

const API_BASE_URL = config.api.baseUrl;

export interface UserProfile {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  profile_picture?: string;
  facebook?: string;
  twitter?: string;
  github?: string;
  dribbble?: string;
}

export const userAPI = {
  async getCurrentUser(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return response.json();
  },

  async updateUser(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to update user: ${response.status} ${text}`);
    }

    return response.json();
  },

  async uploadProfilePicture(file: File): Promise<{ profile_picture: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/user/profile-picture`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to upload profile picture: ${response.status} ${text}`);
    }

    return response.json();
  },
};

export default userAPI;
