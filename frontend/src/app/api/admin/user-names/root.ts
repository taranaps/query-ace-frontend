import axiosInstance from "@/app/lib/axios";

export const fetchUserNames = async(): Promise<string[]> => {
  try {
    const response = await axiosInstance.get("/api/v1/queryapplication/admin/users-names");
    if (!response.data) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching user names:", error);
    return [];
  }
};
