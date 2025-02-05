/**
 * @module fetchQueryWithAnswers
 * @description
 * API function that retrieves a query along with its answers.
 * Features:
 * - Input validation
 * - Detailed error logging
 * - Status code handling
 * - Type checking
 * - Graceful error recovery
 */

/**
 * @function fetchQueryWithAnswers
 * @description
 * Gets detailed information about a query including its answers.
 * Handles multiple scenarios:
 * - Validates input ID
 * - Handles 404 not found cases
 * - Processes server errors
 * - Manages network failures
 *
 * Error Handling:
 * - Returns null for invalid ID
 * - Returns null for 404 errors
 * - Returns null for network failures
 * - Logs all errors for debugging
 *
 * @param {number} id - ID of the query to fetch
 * @returns {Promise<Object|null>} Query data with answers or null if error
 */
export const fetchQueryWithAnswers = async(id: number) => {
  if (!id || typeof id !== "number") {
    console.error("Invalid ID passed to fetch function:", id);
    return null;
  }
  const token = await localStorage.getItem("token");
  const url = `http://localhost:8080/api/v1/queryapplication/queries/${id}/with-answers`;
  try {
    if (!token) throw new Error("No authentication token found");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,

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
