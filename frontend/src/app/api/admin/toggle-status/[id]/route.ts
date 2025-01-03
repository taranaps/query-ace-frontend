import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/apiConfig';

export async function PUT(request: Request) {
    // Extract the URL from the request
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const body = await request.json();

    try {
        const response = await fetch(`${API_BASE_URL}/admin/toggle-status/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
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
}
