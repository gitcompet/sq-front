import { IDomain } from "./domain.model";
import { IQuizResponse } from "./quiz-response.model";

export interface ITestResponse {
    testId: string,
    categories: IDomain[];
    comment: string;
    isActive?: boolean;
    isDeleted?: boolean;
    quizzes?: IQuizResponse[];
    title?: string;
    label?: string;
}
export class TestResponse implements ITestResponse{
  testId: string;
  categories: IDomain[];
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  quizzes?: IQuizResponse[];
  title?: string;
  label?: string;
  constructor(
    testId: string,
    categories: IDomain[],
    comment: string,
    isActive: boolean,
    isDeleted: boolean,
    quizzes?: IQuizResponse[],
    title?: string,
    label?: string
  ) {
    this.testId = testId;
    this.categories = categories;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.quizzes = quizzes;
    this.title = title;
    this.label = label;
  }
}
