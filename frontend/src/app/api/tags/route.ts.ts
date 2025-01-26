const fetchAllTagDetails = async (): Promise<{ tagGroupName: string, tagNames: string[] }[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return [];
    }

    const response = await fetch("http://localhost:8080/api/v1/queryapplication/queries/tags/details", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate response format
    if (!Array.isArray(data) || !data.every(item => 
      typeof item.tagGroupName === 'string' && 
      Array.isArray(item.tagNames)
    )) {
      throw new Error('Invalid tag data format');
    }
    
    return data;
  } catch (error) {
    console.error("An error occurred while fetching tags:", error);
    return [];
  }
};

export default fetchAllTagDetails;
