import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";

export const POST = async(request: Request) => {
  try {
    const { usersUsernames, tags }: { usersUsernames: string[]; tags: string[] } = await request.json();

    if (!Array.isArray(usersUsernames) || !Array.isArray(tags)) {
      return NextResponse.json(
        { message: "Invalid input: usersUsernames and tags must be arrays" },
        { status: 400 }
      );
    }

    const apiUrl = `${API_BASE_URL}/queries/filters`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usersUsernames, tags }),
    });

    if (response.ok) {
      const responseBody = await response.json();
      return NextResponse.json(responseBody, { status: 200 });
    }

    return NextResponse.json(
      {
        message: `Failed to fetch filters. Status: ${response.status}`,
        details: await response.text(),
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("Error fetching filters:", error);
    return NextResponse.json(
      { message: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
};
