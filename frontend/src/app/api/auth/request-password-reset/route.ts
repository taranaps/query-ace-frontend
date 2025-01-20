import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/apiConfig";

export const POST = async(request: Request) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  console.log("Received email:", email);

  if (!email) {
    console.log("No email provided");
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/request-password-reset?email=${email}`,
      {
        method: "POST",
      }
    );

    const contentType = response.headers.get("Content-Type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    console.log("API Response:", data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ message: data }, { status: response.status });
  } catch (error: unknown) {
    console.error("Error occurred during POST:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error requesting password reset", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
};
