export interface ITest {
    testId: string,
    testCategoryId:string[] ;
    comment: string;
    isActive?: boolean,
    isDeleted?: boolean,
    title?: string;
    label?: string;

}
export class Test implements ITest{
  testId: string;
  testCategoryId:string[] ;
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
  constructor(
    testId: string,
    testCategoryId: string[],
    comment: string,
    isActive: boolean,
    isDeleted: boolean,
    title?: string,
    label?: string,
  ) {
    this.testId = testId;
    this.testCategoryId = testCategoryId;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.title = title;
    this.label = label;
  }
}
