import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/apiConfig";

export const GET = async(request: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`);
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching user", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
};

export const PATCH = async(request: Request, { params }: { params: { id: string } }) => {
  const token = localStorage.getItem('token');

  try {
    if (!token) {
      throw new Error('Authorization token missing');
    }
    const { id } = params;
    const requestBody = await request.json();
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`

      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error updating user", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
};
