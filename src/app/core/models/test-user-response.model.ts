export interface ITestUserResponse {
    testId: string,
    testUserId:string ;
    loginId:string ;
    testStatus: number;
}
export class TestUserResponse implements ITestUserResponse{
  testId: string;
  testUserId:string ;
  loginId:string ;
  testStatus: number;

  constructor(
    testId: string,
    testUserId:string,
    loginId:string ,
    testStatus: number)

   {
    this.testId = testId;
    this.testUserId = testUserId;
    this.loginId = loginId;
    this.testStatus = testStatus;
  }
}
