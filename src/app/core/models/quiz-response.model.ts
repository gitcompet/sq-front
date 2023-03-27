import { IQuestionResponse } from "./question-response.model";

export interface IQuizResponse {
    quizId: string,
    domainId:string[];
    subDomainId:string[];
    weight: number ;
    comment: string;
    isActive: boolean;
    isDeleted: boolean;
    questions? : IQuestionResponse[];
    title?: string;
    label?: string;
}
export class QuizResponse implements IQuizResponse{
  quizId: string;
  domainId: string[];
  weight: number ;
  subDomainId: string[];
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  questions? : IQuestionResponse[];
  title?: string;
  label?: string;
  constructor(
    quizId: string,
    domainId: string[],
    subDomainId: string[],
    comment: string,
    isActive: boolean,
    isDeleted: boolean,
    weight: number,
    questions? : IQuestionResponse[],
    title?: string,
    label?: string

  ) {
    this.quizId = quizId;
    this.title = title;
    this.label = label;
    this.domainId = domainId;
    this.subDomainId = subDomainId;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.weight = weight;
    this.questions = questions
  }
}
