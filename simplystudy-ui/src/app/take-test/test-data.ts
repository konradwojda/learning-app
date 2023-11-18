export interface TestQuestion {
    id: number,
    question: string,
    question_type: string,
    question_choices: Array<any>,
    is_true: boolean | null,
    user_answer: string | Array<string|number> | number | boolean,
    user_answer_correct: boolean | null,
  }
  
  export interface TestToTake {
    id: number,
    name: string,
    questions_count: number,
    question_set: any,
    questions: Array<TestQuestion>,
  }