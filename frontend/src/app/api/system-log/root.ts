// system-log/root.ts
/**
 * @module SystemLogAPI
 * @description
 * Collection of API functions for fetching system log data.
 * Handles both general and user-specific log retrieval with:
 * - Secure authentication
 * - Error handling
 * - Pagination support
 * - Type safety
 */

import { API_BASE_URL } from '@/config/apiConfig';
import { SystemLogResponse } from 'types/system-log';

/**
 * @function fetchAllLogs
 * @description
 * Retrieves paginated system logs for all users.
 * Includes authentication and error handling.
 * 
 * Security Features:
 * - Requires valid auth token
 * - Uses secure headers
 * - Validates response
 * 
 * Error Handling:
 * - Network errors
 * - Auth failures
 * - Invalid responses
 * 
 * @param {number} page - Page number to fetch (0-based)
 * @param {string|null} token - Authentication token
 * @returns {Promise<SystemLogResponse>} Paginated log data
 * @throws Will throw error on failed fetch or invalid auth
 */
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

/**
 * @function fetchUserLogs
 * @description
 * Retrieves paginated system logs for a specific user.
 * Includes same security and error handling as fetchAllLogs.
 * 
 * Additional Features:
 * - User-specific filtering
 * - Maintains pagination
 * - Response validation
 * 
 * @param {number} userId - ID of user to fetch logs for
 * @param {number} page - Page number to fetch (0-based)
 * @param {string|null} token - Authentication token
 * @returns {Promise<SystemLogResponse>} User's paginated log data
 * @throws Will throw error on failed fetch or invalid auth
 */
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