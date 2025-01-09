

export async function fetchCompanies() {
  try {
      // Fetch the companies from the backend
      const response = await fetch('http://localhost:8080/api/v1/queryapplication/queries/companies', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              // If you need to add Authorization header, do so here
              // 'Authorization': `Bearer ${yourToken}`,
          },
      });

      // Check if the response was successful
      if (!response.ok) {
          throw new Error('Failed to fetch companies');
      }

      // Parse and return the response data
      const data = await response.json();
      return data; // This should be a list of company names or company objects depending on the API response
  } catch (error: unknown) {
      if (error instanceof Error) {
          console.error('Error fetching companies:', error.message);
          return []; // Return an empty array in case of error
      }
      console.error('An unknown error occurred while fetching companies');
      return []; // Return an empty array in case of unknown error
  }
}
