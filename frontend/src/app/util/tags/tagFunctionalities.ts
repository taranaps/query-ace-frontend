import { API_BASE_URL } from "@/config/apiConfig";

export const handleAddNewTag = async(
  tag: {
        tagGroupName: string, tagNames: string
    }
) => {

  try {
    const requestBody =  tag ;
    const token = localStorage.getItem('token'); 

    const response = await fetch(`${API_BASE_URL}/queries/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      console.log("Tags successfully added to the query.");
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
    const token = localStorage.getItem('token'); 

    const requestBody =  tags;
    const response = await fetch(`${API_BASE_URL}/queries/${id}/tags/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      console.log("Tags successfully added to the query.");
      return { success: true, message: "Tags successfully added to the query." };
    }

    console.error(`Failed to add tags. Status: ${response.status}`);
    return { success: false, message: `Failed to add tags. Status: ${response.status}` };
  } catch (error) {
    console.error("An error occurred while adding tags:", error);
    return { success: false, message: "An error occurred while adding tags." };
  }
};
