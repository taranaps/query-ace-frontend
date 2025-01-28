import QueryTagInterface from "./queryTagInterface";
import FetchQueryAnswerInterface from "./fetchQueryAnswerInterface";

interface searchQueryResult {
    customer: string;
    id: number;
    question: string;
    usersId: number;
    usersUsername: string;
    email: string;
    firstName: string;
    roleRoleName: string;
    tags: QueryTagInterface[];
    queryCreatedAt: string;
    queryUpdatedAt: string;
    answers: FetchQueryAnswerInterface[];
}

export default searchQueryResult;
