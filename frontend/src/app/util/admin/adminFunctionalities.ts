export const handleAddAdmin = async(adminData: {
    firstName: string;
    email: string;
    location: string;
    username: string;
    password: string;
    userRole: "SUPER_ADMIN" | "ADMIN";
}) => {
  try {
    const url = "/api/admin/create";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });

    console.log(JSON.stringify(adminData));

    if (response.ok) {
      const result = await response.json();
      console.log("New admin created successfully:", result);
    } else {
      const errorResult = await response.json();
      console.error("Failed to create admin:", errorResult);
      alert(`Error: ${errorResult.message || "Failed to create admin."}`);
    }
  } catch (error) {
    console.error("Error creating admin:", error);
    alert("An unexpected error occurred while creating the admin.");
  }
};

export const handleEditAdmin = async(
  id: string,
  adminData: Partial<{
    firstName: string;
    email: string;
    username: string;
}>) => {
  try {
    const url = `/api/admin/users/${id}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });

    console.log(JSON.stringify(adminData));

    if (response.ok) {
      const result = await response.json();
      console.log("Admin updated successfully:", result);
    } else {
      const errorResult = await response.json();
      console.error("Failed to update admin:", errorResult);
      alert(`Error: ${errorResult.message || "Failed to update admin."}`);
    }
  } catch (error) {
    console.error("Error updating admin:", error);
    alert("An unexpected error occurred while updating the admin.");
  }
};
