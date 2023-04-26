
export interface IQuizScore {
  userId: string;
  quizScore: number;
  quizId: string;
}
export class QuizScore implements IQuizScore {
  userId: string;
  quizScore: number;
  quizId: string;
  constructor(userId: string, quizScore: number,quizId:string) {
    this.userId = userId;
    this.quizScore = quizScore;
    this.quizId = quizId;
  }
}
