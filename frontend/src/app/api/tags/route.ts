import { API_BASE_URL } from "@/config/apiConfig";

const getAuthToken = (request: Request): string | null => {
  return request.headers.get("Authorization");
};

export const GET = async(request: Request): Promise<{ tagGroupName: string; tagNames: string[] }[] | { error: string }> => {
  const token = getAuthToken(request);
  if (!token) {
    return { error: "Authorization failed" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/queries/tags/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("An error occurred while fetching tags:", error.message || error);
    return { error: "Failed to fetch tag details" };
  }
};

export const DELETE = async(request: Request, queryId: number, tagId: number): Promise<{ success: boolean; message?: string }> => {
  const token = getAuthToken(request);
  if (!token) {
    return { success: false, message: "Authorization failed" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/queries/${queryId}/tags/${tagId}/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return { success: true, message: "Tag deleted successfully" };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData?.message || "Failed to delete tag" };
    }
  } catch (error: any) {
    console.error("Error removing tag:", error.message || error);
    return { success: false, message: "An error occurred while removing the tag" };
  }
};
