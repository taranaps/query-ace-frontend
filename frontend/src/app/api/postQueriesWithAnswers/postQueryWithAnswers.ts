export default async function postQueryWithAnswers(data: any) {
  const url = 'http://localhost:8080/api/v1/queryapplication/queries';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json(); // Return the response body if needed
  } catch (error) {
    throw new Error(`Failed to post data`);
  }
}
