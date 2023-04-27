import { IDomain } from "./domain.model";
import { IQuizResponse } from "./quiz-response.model";

export interface ITestResponse {
    testId: string,
    testUserId: string,
    userId: string;
    testCategoryComposeId: string[];
    categories: IDomain[];
    comment: string;
    quizzes: IQuizResponse[];
    isActive?: boolean;
    isDeleted?: boolean;
    title?: string;
    label?: string;
}
export class TestResponse implements ITestResponse{
  testId: string;
  testUserId: string;
  userId: string;
  testCategoryComposeId: string[];
  categories: IDomain[];
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  quizzes: IQuizResponse[];
  title?: string;
  label?: string;
  constructor(
    testId: string,
    testUserId:string,
    userId: string,
    testCategoryComposeId:string[],
    categories: IDomain[],
    comment: string,
    isActive: boolean,
    isDeleted: boolean,
    quizzes: IQuizResponse[],
    title?: string,
    label?: string
  ) {
    this.testId = testId;
    this.testUserId = testUserId;
    this.userId = userId;
    this.testCategoryComposeId = testCategoryComposeId;
    this.categories = categories;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.quizzes = quizzes;
    this.title = title;
    this.label = label;
  }
}
