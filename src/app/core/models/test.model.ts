export interface ITest {
    testId: string,
    testCategoryId:string ;
    comment: string;
    isActive?: boolean,
    isDeleted?: boolean,
}
export class Test implements ITest{
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
    isDeleted: boolean,
  ) {
    this.testId = testId;
    this.testCategoryId = testCategoryId;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
  }
}
