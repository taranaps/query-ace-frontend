export const fetchQueryWithAnswers = async(id: number) => {
  if (!id || typeof id !== "number") {
    console.error("Invalid ID passed to fetch function:", id);
    return null;
  }
  const url = `http://localhost:8080/api/v1/queryapplication/queries/${id}/with-answers`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 404) {
      console.error(`404 error: The resource with ID ${id} was not found.`);
      return null;
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
