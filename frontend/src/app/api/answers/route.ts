import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/apiConfig";
import type { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ questionId: string }> }
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
    const { questionId } = params;
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error saving answer", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ questionId: string }> }
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
    const { questionId } = params;

    const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching answers", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
