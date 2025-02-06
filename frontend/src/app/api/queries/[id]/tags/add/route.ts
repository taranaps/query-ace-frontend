import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get("Authorization");
  if (!token) {
    return NextResponse.json(
      { message: "Authorization token missing" },
      { status: 401 }
    );
  }

  try {
    const params = await context.params;
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
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}