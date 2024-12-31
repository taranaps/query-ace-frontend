interface Tag {
    tagName: string;
    tagGroupName: string;
}

interface QuestionData {
    question: string;
    userId: number;
    tags: Tag[];
}

export default QuestionData;