/**
 * @module fetchQueryUsingKeyword
 * @description
 * API module that handles searching queries based on keywords.
 * Features:
 * - Sends POST request to search endpoint
 * - Handles response validation
 * - Provides error handling
 * - Returns typed results
 */

import searchQueryResult from "@/app/interface/query/searchQueryResult";

/**
 * @function fetchQueryUsingKeyword
 * @description
 * Makes a POST request to search queries using a keyword.
 * Handles:
 * - Making API request
 * - Response validation
 * - Error cases
 * - Type safety
 * 
 * Error cases handled:
 * - Network errors
 * - Invalid responses
 * - Server errors
 * - Non-200 status codes
 * 
 * @param {string} keyword - Search term to find matching queries
 * @returns {Promise<searchQueryResult[]>} Array of matching query results
 * @throws {Error} When request fails or response is invalid
 */
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

