import QueryTagInterface from "@/app/interface/query/queryTagInterface";
import { API_BASE_URL } from "@/config/apiConfig";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const handleDeleteQuery = async(id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      console.error(`Failed to delete query. Status: ${response.status}, Message: ${response.statusText}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting query:", error);
  }
};

export const handleDeleteQueryAnswer = async(answerId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/answers/${answerId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`Failed to delete query answer. Status: ${response.status}, Message: ${response.statusText}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error deleting query answer:", error);
  }
};

export const handleEditQuery = async(
  answerId: number,
  newAnswer: string,
  userId: number,
  queryId: number
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/answers/${answerId}`, {
      method: "PATCH",
      headers:getAuthHeaders(),
      body: JSON.stringify([
        {
          "answer": newAnswer,
          "userId": userId,
          "queryId": queryId,
        },
      ]),
    });

    if (response.ok) {
      return true;
    }

    console.error(
      `Failed to edit answer. Status: ${response.status}, Message: ${response.statusText}`
    );
    return false;
  } catch (error) {
    console.error("Error editing query answer:", error);
    return false;
  }
};

export const handleCopyQuery = async(answerId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/answers/${answerId}/copy`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.error(`Failed to copy query. Status: ${response.status}, Message: ${response.statusText}`);
      return;
    }
  } catch (error) {
    console.error("Error copying query:", error);
  }
};

export const handleAddNewQueryAnswer = async (
  answer: string, 
  userId: number, 
  queryId: number
) => {
  try {
    const payload = [{
      answer: answer,
      userId: userId,
      queryId: queryId
    }];

    const response = await fetch(`${API_BASE_URL}/queries/${queryId}/answers`, {
      method: 'POST',
      headers:getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to add answer');
    }

    const result = await response.json();
    return {
      success: true,
      data: result // Return full array of answer responses
    };
  } catch (error) {
    console.error('Error adding answer:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const handleAddNewBulkQueryAndAnswer = async(
  queries: {
        question: string;
        userId: number;
        tags: QueryTagInterface[];
        answers: { answer: string; userId: number }[];
    }[]
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/bulk`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(queries),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      alert(`Failed to add queries: ${errorData.message || "Unknown error"}`);
      return false;
    }
    alert("Queries and answers added successfully!");
    return true;

  } catch (error) {
    console.error("Error during API request:", error);
    alert("An error occurred while adding the queries and answers.");
  }
};

export const handleFilterQuery = async(
  usersUsernames: string[],
  tags: string[]
) => {
  try {

    const queryParams = new URLSearchParams();
    usersUsernames.forEach(username => queryParams.append("usersUsernames", username));
    tags.forEach(tag => queryParams.append("tags", tag));
    const apiUrl = `${API_BASE_URL}/queries/filters?${queryParams.toString()}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`Failed to fetch filtered queries. Status: ${response.status}, Message: ${response.statusText}`);
      return { success: false, message: "Failed to fetch filtered queries" };
    }

    const responseData = await response.json();
    return { success: true, data: responseData };

  } catch (error) {
    console.error("Error during fetching filtered queries:", error);
    return { success: false, message: "An error occurred while processing the request" };
  }
};
