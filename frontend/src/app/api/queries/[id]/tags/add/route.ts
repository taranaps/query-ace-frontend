import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";

export const POST = async(request: Request, { params }: { params: { id: string } }) => {
  const token = localStorage.getItem('token');

  try {
    if (!token) {
      throw new Error('Authorization token missing');
    }

    const { id } = params;
    const requestBody = await request.json();
    const response = await fetch(`${API_BASE_URL}/queries/${id}/tags/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`

      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return NextResponse.json(
        { message: "Tags successfully added to the query" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: `Failed to add tags to the query. Status: ${response.status}` },
      { status: response.status }
    );
  } catch {
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
};
