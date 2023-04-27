import { IDomain } from "./domain.model";
import { IQuestionResponse } from "./question-response.model";

export interface IQuizResponse {
    quizId: string,
    domains:IDomain[];
    subDomains:IDomain[];
    quizDomainComposeId: string[];
    quizsubDomainComposeId: string[];
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
    score?: number;
}
export interface IQuizDashboard{
   title: string;
   comment: string;
   testName: string;
   userName:string;
   score: number;
   domains?: IDomain[];
   subDomains?: IDomain[];
}
export class QuizResponse implements IQuizResponse{
  quizId: string;
  weight: number ;
  domains:IDomain[];
  quizDomainComposeId: string[];
  quizsubDomainComposeId: string[];
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
    quizDomainComposeId: string[],
    quizsubDomainComposeId: string[],
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
    this.quizDomainComposeId = quizDomainComposeId;
    this.quizsubDomainComposeId = quizsubDomainComposeId;
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
