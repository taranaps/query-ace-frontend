import { API_BASE_URL } from "@/config/apiConfig";

export const handleAddAdmin = async(adminData: {
    firstName: string;
    email: string;
    location: string;
    username: string;
    password: string;
    userRole: string;
}) => {
  try {
    const token = localStorage.getItem('token'); 

    const url = `${API_BASE_URL}/admin/create`;  
    const response = await fetch(url, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        ...adminData,
        userRole: adminData.userRole 
      }),
    });

    if (response.ok) {
      return true;
    } else {
      const errorResult = await response.json();
      console.error("Failed to create admin:", errorResult);
      return false;
    }
  } catch (error) {
    console.error("Error creating admin:", error);
    return false;
  }
};

export const handleEditAdmin = async(id: string, adminData: Partial<{
  firstName: string;
  email: string;
  username: string;
}>) => {
try {
  const token = localStorage.getItem('token');
  const url = `/api/admin/users/${id}`;  

  const response = await fetch(url, {
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(adminData),
  });

    if (response.ok) {
      return true;
    } else {
      const errorResult = await response.json();
      console.error("Failed to update admin:", errorResult);
      return false;
    }
  } catch (error) {
    console.error("Error updating admin:", error);
    return false;
  }
};
