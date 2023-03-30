import { IQuizResponse } from "./quiz-response.model";

export interface ITestResponse {
    testId: string,
    testCategoryId:string[] ;
    categoryNames: string[];
    comment: string;
    isActive?: boolean;
    isDeleted?: boolean;
    quizzes?: IQuizResponse[];
    title?: string;
    label?: string;
}
export class TestResponse implements ITestResponse{
  testId: string;
  testCategoryId:string [];
  categoryNames: string[];
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  quizzes?: IQuizResponse[];
  title?: string;
  label?: string;
  constructor(
    testId: string,
    testCategoryId: string[],
    categoryNames: string[],
    comment: string,
    isActive: boolean,
    isDeleted: boolean,
    quizzes?: IQuizResponse[],
    title?: string,
    label?: string
  ) {
    this.testId = testId;
    this.testCategoryId = testCategoryId;
    this.categoryNames = categoryNames;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.quizzes = quizzes;
    this.title = title;
    this.label = label;
  }
}
