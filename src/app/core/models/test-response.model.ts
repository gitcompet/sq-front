export interface ITestResponse {
    testId: string,
    testCategoryId:string ;
    comment: string;
    isActive?: boolean,
    isDeleted?: boolean,
}
export class TestResponse implements ITestResponse{
  testId: string;
  testCategoryId:string ;
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  constructor(
    testId: string,
    testCategoryId: string,
    comment: string,
    isActive: boolean,
    isDeleted: boolean
  ) {
    this.testId = testId;
    this.testCategoryId = testCategoryId;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
  }
}
