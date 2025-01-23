export const fetchCompanies = async() => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/queryapplication/queries/companies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch companies");
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching companies:", error.message);
      return [];
    }
    console.error("An unknown error occurred while fetching companies");
    return [];
  }
};
