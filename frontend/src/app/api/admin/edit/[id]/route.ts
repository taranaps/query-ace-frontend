import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/apiConfig';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        const requestBody = await request.json();

        console.log(JSON.stringify({
            firstName: requestBody.firstName,
            email: requestBody.email,
            username: requestBody.username
        }));


        const response = await fetch(`${API_BASE_URL}/admin/edit/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: requestBody.firstName,
                email: requestBody.email,
                username: requestBody.username
            }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to update user." },
                { status: response.status }
            );
        }

        const data = await response.json();

        console.log(data);

        return NextResponse.json(
            { message: "User updated successfully.", data },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in PATCH handler:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
