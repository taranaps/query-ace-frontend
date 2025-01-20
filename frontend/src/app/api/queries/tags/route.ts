import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";

export const POST = async(request: Request) => {
  try {
    const requestBody = await request.json();

    console.log(JSON.stringify(requestBody));

    const response = await fetch(`${API_BASE_URL}/queries/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return NextResponse.json(
        { message: "Tags successfully added" },
        { status: 200 }
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
