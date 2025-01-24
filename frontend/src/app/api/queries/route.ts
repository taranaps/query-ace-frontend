import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/apiConfig";
import QueryAnswerInterface from "@/app/interface/query/postQueryAnswerInterface";
import QueryQuestionInterface from "@/app/interface/query/postQueryQuestionInterface";

export const POST = async(request: Request) => {
  const body = await request.json();

  const { questionData, answersData }: { questionData: QueryQuestionInterface[]; answersData: QueryAnswerInterface[] } = body;

  try {
    const queryResponse = await fetch(`${API_BASE_URL}/queries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionData),
    });

    if (!queryResponse.ok) {
      return NextResponse.json({ message: "Failed to post query" }, { status: queryResponse.status });
    }

    const queryResponseData = await queryResponse.json();
    const queryId = queryResponseData[0];

    if (!queryId) {
      return NextResponse.json({ message: "No ID found in the query response" }, { status: 500 });
    }

    if (answersData.length > 0) {
      const answersUrl = `${API_BASE_URL}/queries/${queryId}/answers`;

      const answersWithQueryId = answersData.map((answer) => ({
        ...answer,
        queryId,
      }));

      const answersResponse = await fetch(answersUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answersWithQueryId),
      });

      if (!answersResponse.ok) {
        return NextResponse.json({ message: "Failed to post answers" }, { status: answersResponse.status });
      }

      const answersResponseData = await answersResponse.json();
      return NextResponse.json(answersResponseData, { status: answersResponse.status });
    }

    return NextResponse.json(queryResponseData, { status: queryResponse.status });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: "Error in operation", error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "An unknown error occurred" }, { status: 500 });
  }
};

export const GET = async() => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Failed to fetch queries" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error fetching queries", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 }
    );
  }
};
