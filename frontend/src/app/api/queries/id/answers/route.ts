import { API_BASE_URL } from "@/config/apiConfig";
import { NextResponse } from "next/server";
import { log } from "node:console";

export async function POST(request: Request) {
    try {

        const requestBody = await request.json();

        const { answer, userId, queryId } = requestBody[0];

        console.log(JSON.stringify({
            answer,
            userId,
            queryId,
        }));

        const response = await fetch(`${API_BASE_URL}/queries/id/answers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify([{
                answer,
                userId,
                queryId,
            }]),
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: "Failed to add answer" },
                { status: response.status }
            );
        }

        const responseBody = await response.json();
        return NextResponse.json(responseBody, { status: response.status });

    } catch (error: unknown) {
        return NextResponse.json(
            { message: "An error occurred while processing the request" },
            { status: 500 }
        );
    }
}
