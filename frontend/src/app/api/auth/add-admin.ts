import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/apiConfig";

export const POST = async(request: Request) => {
  const body = await request.json();

  const authHeader = request.headers.get("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/super-admin/add-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error adding admin", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
};
