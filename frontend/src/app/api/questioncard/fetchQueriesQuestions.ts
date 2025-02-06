import { API_BASE_URL } from "@/config/apiConfig";

export const fetchQueriesQuestions = async() => {
  const url = `${API_BASE_URL}/queries`;
  const token = await localStorage.getItem("token");
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
