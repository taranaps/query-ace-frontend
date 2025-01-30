export const fetchCreatedByUsers = async() => {
  const response = await fetch("http://localhost:8080/api/v1/queryapplication/admin/users-names");
  if (response.ok) {
    return response.json();
  } else {
    console.error("Error fetching created by users:", response.status);
    return [];
  }
};
