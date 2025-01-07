import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/apiConfig';

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        console.log("Request Body: ", body);

        const { id, firstName, email, username } = body;

        if (!id) {
            return NextResponse.json(
                { error: "User ID is required." },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/admin/edit/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName,
                email,
                username
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Error updating user: ", error);
            return NextResponse.json(
                { error: "Failed to update user." },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log("User updated successfully: ", data);

        return NextResponse.json(
            { message: "User updated successfully.", data },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in PATCH handler: ", error);
        return NextResponse.json(
            { error: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
