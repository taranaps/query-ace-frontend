// src/app/api/queries/route.ts

import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/apiConfig';

export async function GET() {
    try {
        const response = await fetch(`${API_BASE_URL}/queries`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'Failed to fetch queries' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { message: 'Error fetching queries', error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'An unknown error occurred' },
            { status: 500 }
        );
    }
}
