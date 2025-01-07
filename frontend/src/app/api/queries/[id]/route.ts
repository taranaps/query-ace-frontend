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
export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ message: 'ID is required' }, { status: 400 });
        }

        const response = await fetch(`${API_BASE_URL}/queries/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return NextResponse.json(
                { message: 'Query deleted successfully' },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { message: 'Failed to delete query' },
            { status: response.status }
        );
    } catch (error: unknown) {
        return NextResponse.json(
            { message: 'An error occurred while processing the request' },
            { status: 500 }
        );
    }
}
