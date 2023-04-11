export interface ITestQuiz {
    testId: string;
    quizId:string ;
    isClosed: boolean;
    timer: boolean;
}
export class TestQuiz implements ITestQuiz{
  testId: string;
  quizId:string;
  isClosed: boolean;
  timer: boolean;
  constructor(
    testId: string,
    quizId:string ,
    isClosed: boolean,
    timer: boolean
  ) {
    this.testId = testId;
    this.quizId = quizId;
    this.isClosed = isClosed;
    this.timer= timer;
  }
}
