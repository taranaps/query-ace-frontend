import QueryTagInterface from "./queryTagInterface";

interface PostQueryQuestionInetface {
    question: string;
    userId: number;
    tags: QueryTagInterface[];
}

export default PostQueryQuestionInetface;

