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
    isClosed: boolean;
    hasTimer: boolean;
    questions : IQuestionResponse[];
    title?: string;
    label?: string;
    testUserId?:string;
    quizUserId?:string;
    timer?: boolean;
}
export class QuizResponse implements IQuizResponse{
  quizId: string;
  weight: number ;
  domains:IDomain[];
  subDomains:IDomain[];
  comment: string;
  isActive: boolean;
  isDeleted: boolean;
  isClosed: boolean;
  hasTimer: boolean;
  questions : IQuestionResponse[];
  title?: string;
  label?: string;
  timer?: boolean;

  constructor(
    quizId: string,
    subDomains:IDomain[],
    comment: string,
    isActive: boolean,
    isDeleted: boolean,
    isClosed: boolean,
    hasTimer:boolean,
    weight: number,
    domains:IDomain[],
    questions : IQuestionResponse[],
    title?: string,
    label?: string,
    timer?: boolean,

  ) {
    this.quizId = quizId;
    this.title = title;
    this.label = label;
    this.domains = domains;
    this.subDomains = subDomains;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.isClosed = isClosed;
    this.hasTimer = hasTimer;
    this.timer = timer
    this.weight = weight;
    this.questions = questions;
  }
}
