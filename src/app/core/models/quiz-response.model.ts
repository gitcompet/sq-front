import { IDomain } from "./domain.model";
import { IQuestionResponse } from "./question-response.model";

export interface IQuizResponse {
    quizId: string,
    domains:IDomain[];
    subDomains:IDomain[];
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
  weight: number ;
  domains:IDomain[];
  subDomains:IDomain[];
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  questions? : IQuestionResponse[];
  title?: string;
  label?: string;
  constructor(
    quizId: string,
    subDomains:IDomain[],
    comment: string,
    isActive: boolean,
    isDeleted: boolean,
    weight: number,
    domains:IDomain[],
    questions? : IQuestionResponse[],
    title?: string,
    label?: string,

  ) {
    this.quizId = quizId;
    this.title = title;
    this.label = label;
    this.domains = domains;
    this.subDomains = subDomains;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.weight = weight;
    this.questions = questions;
  }
}
