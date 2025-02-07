import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";

export const POST = async(request: Request) => {
  const token = request.headers.get("Authorization");
  if (!token) {
    return NextResponse.json(
      { message: "Authorization token missing" },
      { status: 401 }
    );
  }
  try {
    const requestBody = await request.json();
    const response = await fetch(`${API_BASE_URL}/queries/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return NextResponse.json(
        { message: "Queries and answers successfully added" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: `Failed to add queries and answers. Status: ${response.status}` },
      { status: response.status }
    );
  } catch {
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
};
