// admin/user-names/root.ts
/**
 * @function fetchUserNames
 * @description
 * Retrieves list of admin usernames for filtering.
 * Includes extensive logging for debugging.
 *
 * Features:
 * - Secure data fetching
 * - Detailed error logging
 * - Response validation
 * - Fallback handling
 *
 * Error Cases:
 * - Returns empty array on error
 * - Logs all error states
 * - Maintains app stability
 *
 * @param {string|null} token - Authentication token
 * @returns {Promise<UserDTO[]>} List of admin users
 */
import { API_BASE_URL } from "src/config/apiConfig";
import { UserDTO } from "types/system-log";
export const fetchUserNames = async(token: string | null): Promise<UserDTO[]> => {
  try {
    console.log("Making request to:", `${API_BASE_URL}/admin/users-names`);
    console.log("With token:", token ? "Token present" : "No token");

    const response = await fetch(`${API_BASE_URL}/admin/users-names`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      console.log("Response not ok:", response.status);
      const errorText = await response.text();
      console.log("Error response:", errorText);
      return [];
    }

    const data = await response.json();
    console.log("Fetched usernames:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user names:", error);
    return [];
  }
};
