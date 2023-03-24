import { IQuestionResponse } from "./question-response.model";
import { IQuestion } from "./question.model";

export interface IQuizResponse {
    quizId: string,
    title:string ;
    domainId:string;
    subDomainId:string ;
    weight: number ;
    comment: string;
    isActive: boolean,
    isDeleted: boolean,
    questions? : IQuestionResponse[]
}
export class QuizResponse implements IQuizResponse{
  quizId: string;
  title: string;
  domainId: string;
  weight: number ;
  subDomainId: string;
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  questions? : IQuestionResponse[]
  constructor(
    quizId: string,
    title: string,
    domainId: string,
    subDomainId: string,
    comment: string,
    isActive: boolean,
    isDeleted: boolean,
    weight: number,
    questions? : IQuestionResponse[]

  ) {
    this.quizId = quizId;
    this.title = title;
    this.domainId = domainId;
    this.subDomainId = subDomainId;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.weight = weight;
    this.questions = questions
  }
}
