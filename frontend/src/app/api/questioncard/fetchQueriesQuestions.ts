export default async function fetchQueriesQuestions() {
    const url = 'http://localhost:8080/api/v1/queryapplication/queries';
  
    try {
      const response = await fetch(url, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Fetched data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
