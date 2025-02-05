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
    const { answer, userId, queryId } = requestBody[0];
    const response = await fetch(`${API_BASE_URL}/queries/id/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${token}`
      },
      body: JSON.stringify([{
        answer,
        userId,
        queryId,
      }]),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to add answer" },
        { status: response.status }
      );
    }

    const responseBody = await response.json();
    return NextResponse.json(responseBody, { status: response.status });

  } catch {
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
};
