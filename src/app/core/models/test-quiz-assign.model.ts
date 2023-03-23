export interface ITestQuiz {
    testId: string;
    quizId:string ;
}
export class TestQuiz implements ITestQuiz{
  testId: string;
  quizId:string;
  constructor(
    testId: string,
    quizId:string ,
  ) {
    this.testId = testId;
    this.quizId = quizId;
  }
}
