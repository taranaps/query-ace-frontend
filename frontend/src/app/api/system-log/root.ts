import { API_BASE_URL } from '@/config/apiConfig';
import { SystemLogResponse } from 'types/system-log';

export const fetchAllLogs = async (page: number, token: string | null): Promise<SystemLogResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/logs?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch logs');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const fetchUserLogs = async (userId: number, page: number, token: string | null): Promise<SystemLogResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/logs/user/${userId}?page=${page}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user logs');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};