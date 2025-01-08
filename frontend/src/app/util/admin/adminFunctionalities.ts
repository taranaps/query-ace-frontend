import { AdminData } from "@/app/components/add-admin-popup/AddAdminPopup";


export const handleAddAdmin = async (adminData: {
    id: number,
    firstName: string;
    email: string;
    location: string;
    username: string;
    password: string;
    userRole: string;
}) => {
    try {
        const url = `/api/admin/create`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(adminData),
        });

        console.log("Request Data:", JSON.stringify(adminData));

        if (response.ok) {
            const result = await response.json();
            console.log("New admin created successfully:", result);
            alert("Admin created successfully!");
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


export const handleSubmitEdit = async (adminData: {
    id: number
    firstName: string;
    email: string;
    username: string;
}) => {

    console.log("Request Data:", JSON.stringify(adminData));

    try {
        console.log("Submitting admin data for edit:", adminData);

        const response = await fetch(`/api/admin/edit/${adminData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminData),
        });

        const responseBody = await response.json();

        console.log('Response Body:', responseBody);

        if (!response.ok) {
            console.error("Failed to update user. Error:");
        } else {
            console.log("User updated successfully:");
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error updating user:", error.message);
        } else {
            console.error("Unknown error occurred while updating user:", error);
        }
    }
};
