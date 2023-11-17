export interface Test {
    id: number,
    name: string,
    questions_count: number,
    question_set: any,
    questions: Array<any> | null,
}