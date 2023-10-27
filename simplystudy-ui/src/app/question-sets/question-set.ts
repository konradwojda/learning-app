import { Course } from "../courses/course"

export interface QuestionSet {
    id: string,
    name: string,
    description: string,
    course: Course | null,
    questions: any,
    owner: string,
    is_private: boolean | null,
}