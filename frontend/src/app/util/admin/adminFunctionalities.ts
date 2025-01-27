import { API_BASE_URL } from "@/config/apiConfig";

interface AdminData {
    firstName: string;
    email: string;
    username: string;
    password: string;
}
export const handleAddAdmin = async(adminData: AdminData) => {
  try {
    const token = localStorage.getItem('token'); 
    
    const payload = {
      firstName: adminData.firstName,
      email: adminData.email,
      username: adminData.username,
      password: adminData.password,
      location: "BANGLORE",
      userRole: "ADMIN" 

    };
    console.log('Request Payload:', payload);

    const response = await fetch(`${API_BASE_URL}/admin/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error Response:', errorText);
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.detail || errorText);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
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
