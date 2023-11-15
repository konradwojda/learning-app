export interface Test {
    id: number,
    name: string,
    questions_count: number,
    question_set: number,
    questions: Array<any> | null,
}