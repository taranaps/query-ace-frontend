import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/apiConfig';

export async function PATCH(request: Request, { params }: { params: { id: number } }) {
    console.log("PATCH API invoked");
    const token = localStorage.getItem('token');


    try {
        if (!token) {
            throw new Error('Authorization token missing');
          }
        const { id } = params;
        console.log("Params received:", params);
        console.log("Request received with ID:", id);

        const requestBody = await request.json();
        console.log("Request Body:", requestBody);

        if (!requestBody.firstName || !requestBody.username || !requestBody.email) {
            console.error("Validation failed: Missing fields");
            return NextResponse.json(
                { error: 'All fields (firstName, username, email) are required.' },
                { status: 400 }
            );
        }

        console.log("body", JSON.stringify({
            firstName: requestBody.firstName,
            username: requestBody.username,
            email: requestBody.email,
        }));


        const response = await fetch(`${API_BASE_URL}/admin/edit/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`

            },
            body: JSON.stringify({
                firstName: requestBody.firstName,
                username: requestBody.username,
                email: requestBody.email,
            }),
        });

        console.log("Response from external API:", response);

        if (!response.ok) {
            // const errorBody = await response.json();
            // console.error("Backend API Error:", errorBody);

            return NextResponse.json(
                // { error: errorBody.message || 'Failed to update user.' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log("Data received from backend API:", data);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Unexpected Error in API Route:", error);

        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
