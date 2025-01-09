// app/api/system-log/root.ts
import axiosInstance from '@/app/lib/axios';
import { SystemLog } from 'types/system-log';

export async function fetchAllLogs(page: number = 0): Promise<SystemLog[]> {
  try {
    const response = await axiosInstance.get(`/api/v1/queryapplication/logs?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
}

export async function fetchUserLogs(userId: number, page: number = 0): Promise<SystemLog[]> {
  try {
    const response = await axiosInstance.get(`/api/v1/queryapplication/logs/user/${userId}?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user logs:', error);
    throw error;
  }
}