import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const requestBody = await request.json();

        console.log(JSON.stringify(requestBody));
        

        const response = await fetch(`${API_BASE_URL}/queries/bulk`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            return NextResponse.json(
                { message: "Queries and answers successfully added" },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: `Failed to add queries and answers. Status: ${response.status}` },
            { status: response.status }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while processing the request" },
            { status: 500 }
        );
    }
}
