import QueryAnswerInterface from "@/app/interface/query/postQueryAnswerInterface";
import QueryQuestionInetface from "@/app/interface/query/postQueryQuestionInterface";

export const postQueryWithAnswers = async(
  questionData: QueryQuestionInetface[],
  answersData: QueryAnswerInterface[]
) => {
  const baseUrl = "http://localhost:8080/api/v1/queryapplication/queries";

  try {
    const queryResponse = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(questionData),
    });

    if (!queryResponse.ok) {
      throw new Error(`HTTP error while posting query! Status: ${queryResponse.status}`);
    }

    const queryResponseData = await queryResponse.json();
    const queryId = queryResponseData[0];

    if (!queryId) {
      throw new Error("No ID found in the query response.");
    }

    if (answersData.length > 0) {
      const answersUrl = `${baseUrl}/${queryId}/answers`;

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
        throw new Error(`HTTP error while posting answers! Status: ${answersResponse.status}`);
      }

      return await answersResponse.json();
    }

    return queryResponseData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to complete the operation: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};
