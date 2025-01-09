import axiosInstance from '@/app/lib/axios';
import { SystemLog } from 'types/system-log';

export async function fetchUserNames(): Promise<string[]> {
    try {
        const response = await axiosInstance.get('/api/v1/queryapplication/admin/users-names');
        if (!response.data) {
            return [];
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching user names:', error);
        return [];
    }
  }