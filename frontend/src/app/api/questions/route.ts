// src/app/api/questions/route.ts

import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/apiConfig';

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const response = await fetch(`${API_BASE_URL}/questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: "Error creating question", error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "An unknown error occurred" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const query = new URL(request.url).searchParams;

    // Read query parameters for pagination/sorting
    const pageNo = query.get("pageNo") || "0";
    const pageSize = query.get("pageSize") || "3";
    const sortBy = query.get("sortBy") || "id";
    const sortDir = query.get("sortDir") || "asc";

    try {
        const response = await fetch(
            `${API_BASE_URL}/questions/paged?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: "Error fetching questions", error: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { message: "An unknown error occurred" },
            { status: 500 }
        );
    }
}
