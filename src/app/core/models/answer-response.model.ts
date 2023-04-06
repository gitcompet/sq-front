
export interface IAnswerResponse {
  answerId: string;
  quizUserId: string;
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
}
export class AnswerResponse implements IAnswerResponse {
  answerId: string;
  quizUserId: string;
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
  constructor(
    answerId: string,
    quizUserId: string,
    isActive: boolean,
    isDeleted: boolean,
    comment: string,
    title?: string,
    label?: string
  ){
    this.answerId = answerId;
    this.quizUserId = quizUserId;
    this.title = title;
    this.label = label;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
  };
}
