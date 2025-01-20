import searchQueryResult from "@/app/interface/query/searchQueryResult";

export const fetchQueryUsingKeyword = async(keyword: string): Promise<searchQueryResult[]> => {
  const url = "http://localhost:8080/api/v1/queryapplication/queries/search";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch queries. HTTP status: ${response.status}`);
    }

    const data: searchQueryResult[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching queries:", error);
    throw error;
  }
};
