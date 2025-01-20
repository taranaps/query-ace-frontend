import QueryTagInterface from "@/app/interface/query/queryTagInterface";
import { API_BASE_URL } from "@/config/apiConfig";

export const handleDeleteQuery = async(id: number) => {
  try {
    const response = await fetch(`/api/queries/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(`Failed to delete query. Status: ${response.status}, Message: ${response.statusText}`);
      return false;
    }
    console.log(`Query with ID ${id} deleted successfully.`);
    return true;
  } catch (error) {
    console.error("Error deleting query:", error);
  }
};

export const handleDeleteQueryAnswer = async(id: number) => {
  try {
    const response = await fetch(`/api/queries/answers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Failed to delete query answer. Status: ${response.status}, Message: ${response.statusText}`);
      return false;
    }
    console.log(`Query answer with ID ${id} deleted successfully.`);
    return true;
  } catch (error) {
    console.error("Error deleting query answer:", error);
  }
};

export const handleEditQuery = async(
  id: number,
  newAnswer: string,
  userId: number,
  queryId: number
) => {
  try {
    const response = await fetch(`/api/queries/answers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          "answer": newAnswer,
          "userId": userId,
          "queryId": queryId,
        },
      ]),
    });

    if (response.ok) {
      console.log("Edit query answer successful");
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

export const handleCopyQuery = async(id: number) => {
  try {
    const response = await fetch(`/api/queries/answers/${id}/copy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.error(`Failed to copy query. Status: ${response.status}, Message: ${response.statusText}`);
      return;
    }

    const result = await response.json();
    console.log("Copy query result:", result);
  } catch (error) {
    console.error("Error copying query:", error);
  }
};

export const handleAddNewQueryAnswer = async(
  answer: string,
  userId: number,
  queryId: number
) => {
  try {

    const requestBody = [
      {
        answer,
        userId,
        queryId,
      }
    ];

    console.log(JSON.stringify(requestBody));

    const response = await fetch("/api/queries/id/answers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error adding query answer:", errorResponse);
      return { success: false, message: "Failed to add query answer" };
    }

    const responseData = await response.json();
    console.log("New query answer added:", responseData);
    return { success: true, data: responseData };
  } catch (error: unknown) {
    console.error("Error occurred while adding query answer:", error);
    return { success: false, message: "An error occurred while processing the request" };
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
    const response = await fetch("/api/queries/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queries),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData);
      alert(`Failed to add queries: ${errorData.message || "Unknown error"}`);
      return false;
    }

    const responseData = await response.json();
    console.log("Response Data:", responseData);
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

    console.log("API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch filtered queries. Status: ${response.status}, Message: ${response.statusText}`);
      return { success: false, message: "Failed to fetch filtered queries" };
    }

    const responseData = await response.json();
    console.log("Filtered queries:", responseData);
    return { success: true, data: responseData };

  } catch (error) {
    console.error("Error during fetching filtered queries:", error);
    return { success: false, message: "An error occurred while processing the request" };
  }
};
