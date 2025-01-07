import { fetchUserInterface } from "@/app/interface/user/fetchUserInterface";



export const handleAddAdmin = async (adminData: {
    firstName: string;
    email: string;
    location: string;
    username: string;
    password: string;
    userRole: "SUPER_ADMIN" | "ADMIN";
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

// Edit User Function
export const handleSubmitEdit = async (
    updatedUser: fetchUserInterface,
    setUserData: React.Dispatch<React.SetStateAction<fetchUserInterface[]>>,
    setOpenEditPopup: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        console.log("Submitting update for user:", updatedUser);

        const response = await fetch(`/api/admin/edit/${updatedUser.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });

        console.log("Response status:", response.status);

        const result = await response.json();
        console.log("Response result:", result);

        if (response.ok) {
            console.log("Update successful");
            setUserData((prevData) =>
                prevData.map((user) =>
                    user.id === updatedUser.id ? updatedUser : user
                )
            );
            setOpenEditPopup(false);
            alert("User updated successfully!");
        } else {
            console.error("Failed to update user:", result);
            alert("Failed to update user. Please try again.");
        }
    } catch (error) {
        console.error("Error updating user:", error);
        alert("An unexpected error occurred while updating the user.");
    }
};
