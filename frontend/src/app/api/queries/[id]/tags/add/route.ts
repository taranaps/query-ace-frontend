import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";

export const POST = async(request: Request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    const requestBody = await request.json();

    console.log("yaaaaaaaaaaaaaaa");

    console.log(JSON.stringify(requestBody));

    const response = await fetch(`${API_BASE_URL}/queries/${id}/tags/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return NextResponse.json(
        { message: "Tags successfully added to the query" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: `Failed to add tags to the query. Status: ${response.status}` },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
};
