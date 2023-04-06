
export interface IQuizScore {
  userId: string;
  quizScore: number;
}
export class QuizScore implements IQuizScore {
  userId: string;
  quizScore: number;
  constructor(userId: string, quizScore: number) {
    this.userId = userId;
    this.quizScore = quizScore;
  }
}
