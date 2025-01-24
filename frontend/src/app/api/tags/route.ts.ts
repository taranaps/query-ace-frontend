const fetchAllTagDetails = async(): Promise<{ tagGroupName: string, tagNames: string[] }[]> => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/queryapplication/queries/tags/details");
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred while fetching tags:", error);
    return [];
  }
};

export default fetchAllTagDetails;
