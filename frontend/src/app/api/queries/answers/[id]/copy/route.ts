import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";

export const POST = async(request: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const response = await fetch(`${API_BASE_URL}/queries/answers/${id}/copy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return NextResponse.json({ message: "Successfully copied the answer" }, { status: response.status });
    }
    return NextResponse.json(
      { message: `Failed to copy answer. Status: ${response.status}` },
      { status: response.status }
    );
  } catch {
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
};
