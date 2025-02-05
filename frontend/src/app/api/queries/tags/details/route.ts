import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";

export const GET = async(request: Request) => {
  const token = request.headers.get("Authorization");
  if (!token) {
    return NextResponse.json(
      { message: "Authorization token missing" },
      { status: 401 }
    );
  }
  try {
    const response = await fetch(`${API_BASE_URL}/queries/tags/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (response.ok) {
      return NextResponse.json(
        { message: "Tags successfully added" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: `Failed to tags. Status: ${response.status}` },
      { status: response.status }
    );
  } catch {
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
};
