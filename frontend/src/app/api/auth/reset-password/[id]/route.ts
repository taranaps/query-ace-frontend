import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/apiConfig";

export const GET = async(request: Request) => {
  const url = new URL(request.url);
  const hashId = url.pathname.split("/").pop();

  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/${hashId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching password reset link", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
};

export const POST = async(request: Request) => {
  const url = new URL(request.url);
  const token = url.pathname.split("/").pop();

  const { newPassword, confirmNewPassword } = await request.json();

  if (!newPassword || !confirmNewPassword) {
    return NextResponse.json(
      { message: "Both new password and confirmation password are required" },
      { status: 400 }
    );
  }

  if (newPassword !== confirmNewPassword) {
    return NextResponse.json(
      { message: "Passwords do not match" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword, confirmNewPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error resetting password", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
};
