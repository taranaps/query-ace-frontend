import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";

export const PATCH = async(request: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const requestBody = await request.json();

    const response = await fetch(`${API_BASE_URL}/queries/answers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return NextResponse.json({ message: "Successfully updated the query" }, { status: response.status });
    }

    return NextResponse.json(
      { message: "Failed to update query" },
      { status: response.status }
    );

  } catch {
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
};

export const DELETE = async(
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/queries/answers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return NextResponse.json(
        { message: "Answer deleted successfully" },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: "Failed to delete answer" },
      { status: response.status }
    );
  } catch {
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
};
