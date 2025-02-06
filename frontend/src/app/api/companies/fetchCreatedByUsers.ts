import { API_BASE_URL } from "@/config/apiConfig";

export const fetchCreatedByUsers = async(): Promise<string[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return [];
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/users-names`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate response format
    if (!Array.isArray(data) || !data.every(item =>
      typeof item === "object" &&
      typeof item.username === "string"
    )) {
      throw new Error("Invalid user data format");
    }

    // Extract usernames from objects
    return data.map(user => user.username);

  } catch (error) {
    console.error("Error fetching created by users:", error);
    return [];
  }
};
