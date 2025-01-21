import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/apiConfig';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization');

    const response = await fetch(`${API_BASE_URL}/queries/trending`, {
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch trending queries" },
      { status: 500 }
    );
  }
}