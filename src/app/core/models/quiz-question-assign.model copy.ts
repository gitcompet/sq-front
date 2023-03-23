export interface IQuizQuestion {
    quizId:string ;
    questionId: string;
    questionLevel: number;
    questionWeight: number;
}
export class QuizQuestion implements IQuizQuestion{
  quizId:string ;
  questionId: string;
  questionLevel: number;
  questionWeight: number;
  constructor(
    quizId:string ,
    questionId: string,
    questionLevel: number,
    questionWeight: number,
  ) {
    this.questionId = questionId;
    this.quizId = quizId;
    this.questionLevel = questionLevel;
    this.questionWeight = questionWeight;
  }
}
