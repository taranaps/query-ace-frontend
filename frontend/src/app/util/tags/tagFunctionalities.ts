import { API_BASE_URL } from "@/config/apiConfig";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const handleAddNewTag = async(
  tag: {
        tagGroupName: string, tagName: string
    }
) => {

  try {
    const requestBody =  tag ;
    const response = await fetch(`${API_BASE_URL}/queries/tags`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return true;
    }

    console.error(`Failed to add tags. Status: ${response.status}`);
    return false;
  } catch (error) {
    console.error("An error occurred while adding tags:", error);
    return false;
  }

};

export const handleAddNewTagToExistingQuery = async(
  id: string,
  tags: { tagGroupName: string; tagName: string }
) => {
  try {
    const requestBody =  tags;
    const response = await fetch(`${API_BASE_URL}/queries/${id}/tags/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return { success: true, message: "Tags successfully added to the query." };
    }

    console.error(`Failed to add tags. Status: ${response.status}`);
    return { success: false, message: `Failed to add tags. Status: ${response.status}` };
  } catch (error) {
    console.error("An error occurred while adding tags:", error);
    return { success: false, message: "An error occurred while adding tags." };
  }
};

export const fetchAllTagsWithDetails = async() => {
  try {
    const response = await fetch("/api/queries/tags/details", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const { data } = await response.json();  // Extract only the 'data' field from the response
      return data;  // Return the actual tag details
    }

    console.error(`Failed to fetch tags. Status: ${response.status}`);
    return { success: false, message: `Failed to fetch tags. Status: ${response.status}` };
  } catch (error) {
    console.error("An error occurred while fetching tags:", error);
    return { success: false, message: "An error occurred while fetching tags." };
  }
};

export const removeTagFromBackend = async(id: string) => {
  try {
    const response = await fetch(`/api/queries/tags/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      return { success: true, message: "Tag successfully removed." };
    }

    console.error(`Failed to remove tag. Status: ${response.status}`);
    return { success: false, message: `Failed to remove tag. Status: ${response.status}` };
  } catch (error) {
    console.error("An error occurred while removing tag:", error);
    return { success: false, message: "An error occurred while removing tag." };
  }
};
