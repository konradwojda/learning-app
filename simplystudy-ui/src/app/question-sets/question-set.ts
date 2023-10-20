import { Course } from "../courses/course"

export interface QuestionSet {
    id: string,
    name: string,
    description: string,
    course: Course,
    questions: any,
    owner: string
}