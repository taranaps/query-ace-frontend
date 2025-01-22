import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/apiConfig";

export const GET = async({ params }: { params: { id: string } }) => {
  const questionId = params.id;
  try {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`);
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching question", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
};
