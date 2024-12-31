import QuestionData from "@/app/components/interface/query/queryQuestionInterface";


export default async function postQueryWithoutAnswers(
  questionData: QuestionData[],
) {
  const url = 'http://localhost:8080/api/v1/queryapplication/queries';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to post data`);
  }
}
