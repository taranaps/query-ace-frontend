import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/apiConfig';

export async function POST(request: Request) {
    try {
        const url = new URL(request.url);
        const idMatch = url.pathname.match(/\/queries\/answers\/(\d+)\/copy/);

        if (!idMatch || !idMatch[1]) {
            return NextResponse.json(
                { message: 'Invalid URL format. ID not found.' },
                { status: 400 }
            );
        }

        const id = idMatch[1];
        const body = await request.json();

        if (!body.firstName || !body.email || !body.location || !body.username || !body.password || !body.userRole) {
            return NextResponse.json(
                { message: 'Invalid request body format' },
                { status: 400 }
            );
        }

        console.log("Request body:", body);

        const response = await fetch(`${API_BASE_URL}/queries/answers/${id}/copy`, {
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
                { message: "Error processing POST request", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "An unknown error occurred" },
            { status: 500 }
        );
    }
}
