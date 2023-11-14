export interface QuestionType {
    type: string,
    visible_type: string
}

export interface TestQuestion {
    test_id: number,
    question: string,
    question_type: string,
    answers: Array<any>,
}

export interface TestQuestionAnswer {
    question_id: number,
    answer: string,
    is_correct: boolean
}