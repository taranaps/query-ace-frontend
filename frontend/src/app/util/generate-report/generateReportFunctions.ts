import { API_BASE_URL } from "@/config/apiConfig";

export const handleGenerateReportSearch = async(
  searchData: string[],
  options?: { signal?: AbortSignal }
) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/generatereport/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(searchData),
      ...options // Spread the options here
    });

    if (response.ok) {
      const responseData = await response.json();
      return { success: true, data: responseData };
    }

    const errorData = await response.json();
    return { success: false, message: errorData.message || `Request failed with status ${response.status}` };
  } catch (error) {
    console.error("Request error:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error occurred" };
  }
};