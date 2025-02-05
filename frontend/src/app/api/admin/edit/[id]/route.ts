import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/apiConfig";

export const PATCH = async(request: Request, { params }: { params: { id: string } }) => {

  const token = request.headers.get("Authorization");
  if (!token) {
    return NextResponse.json(
      { message: "Authorization token missing" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;

    const requestBody = await request.json();

    // Validate required fields
    if (!requestBody.firstName || !requestBody.username || !requestBody.email) {
      console.error("Validation failed: Missing fields");
      return NextResponse.json(
        { error: "All fields (firstName, username, email) are required." },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/admin/edit/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: requestBody.firstName,
        username: requestBody.username,
        email: requestBody.email,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Backend API Error:", errorBody);

      return NextResponse.json(
        { error: errorBody.message || "Failed to update user." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Unexpected Error in API Route:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
};
