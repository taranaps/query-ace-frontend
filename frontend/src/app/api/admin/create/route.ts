import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/apiConfig';

export async function POST(request: Request) {
    const body = await request.json();
    console.log("body-------",body);

    try {
        const response = await fetch(`http://localhost:8080/admin/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: body.firstName,
                email: body.email,
                location: body.location,
                username: body.username,
                password: body.password,
                userRole: body.userRole,
            }),
        });
        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: "Error creating user", error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "An unknown error occurred" },
            { status: 500 }
        );
    }
}
