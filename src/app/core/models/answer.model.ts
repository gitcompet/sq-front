export interface IAnswer {
  answerId: string;
  questionUserId: string;
}
export class Answer implements IAnswer {
  answerId: string;
  questionUserId: string;
  constructor(answerId: string, questionUserId: string) {
    this.answerId = answerId;
    this.questionUserId = questionUserId;
  }
}
