import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";

export const POST = async(request: Request) => {
  try {
    const requestBody = await request.json();

    const response = await fetch(`${API_BASE_URL}/generatereport/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const responseData = await response.json();
      return NextResponse.json(responseData, { status: 200 });
    }

    const errorData = await response.json();
    return NextResponse.json(
      { message: `Failed to fetch data. Status: ${response.status}`, details: errorData },
      { status: response.status }
    );
  } catch {
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
};
