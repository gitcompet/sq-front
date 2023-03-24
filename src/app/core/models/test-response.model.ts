import { IQuiz } from "./quiz.model";

export interface ITestResponse {
    testId: string,
    testCategoryId:string ;
    comment: string;
    isActive?: boolean,
    isDeleted?: boolean,
    quizzes?: IQuiz[]
}
export class TestResponse implements ITestResponse{
  testId: string;
  testCategoryId:string ;
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  quizzes?: IQuiz[]
  constructor(
    testId: string,
    testCategoryId: string,
    comment: string,
    isActive: boolean,
    isDeleted: boolean,
    quizzes?: IQuiz[]
  ) {
    this.testId = testId;
    this.testCategoryId = testCategoryId;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.quizzes = quizzes;
  }
}
