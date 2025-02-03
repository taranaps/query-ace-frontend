import { API_BASE_URL } from "@/config/apiConfig";

const fetchAllTagDetails = async (): Promise<{ tagGroupName: string, tagNames: string[] }[]> => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/queryapplication/queries/tags/details');
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


export const removeTagFromBackend = async (queryId: number, tagId: number): Promise<{ success: boolean; message?: string }> =>{
    try {
        const response = await fetch(`http://localhost:8080/api/v1/queryapplication/queries/${queryId}/tags/${tagId}/remove`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            return {success:true,message:"tag  deleted successfully"}
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData?.message || "Failed to delete tag" };
        }
    } catch (error) {
        console.error("Error removing tag:", error);
        return { success: false, message: "An error occurred while removing the tag" };
    }
};
