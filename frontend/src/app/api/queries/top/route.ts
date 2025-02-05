import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/apiConfig";

export const GET = async(request: Request) => {
  try {
    const token = request.headers.get("Authorization");
    if (!token) {
      return NextResponse.json(
        { message: "Authorization token missing" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/queries/top`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch trending queries", error },
      { status: 500 }
    );
  }
};
