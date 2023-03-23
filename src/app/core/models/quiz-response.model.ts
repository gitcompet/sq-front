import { Question } from "./question.model";

export interface IQuizResponse {
    quizId: string,
    title:string ;
    domainId:string;
    subDomainId:string ;
    weight: number ;
    comment: string;
    isActive: boolean,
    isDeleted: boolean,
    questions? : Question[]
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
  constructor(
    quizId: string,
    title: string,
    domainId: string,
    subDomainId: string,
    comment: string,
    isActive: boolean,
    isDeleted: boolean,
    weight: number

  ) {
    this.quizId = quizId;
    this.title = title;
    this.domainId = domainId;
    this.subDomainId = subDomainId;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.weight = weight;
  }
}
