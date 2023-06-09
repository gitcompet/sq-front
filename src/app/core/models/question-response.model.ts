import { IAnswerResponse } from "./answer-response.model";
import { IDomain } from "./domain.model";

export interface IQuestionResponse {
  questionId: string;
  questionUserId: string;
  quizUserId: string;
  comment: string;
  domains: IDomain[];
  subDomains: IDomain[];
  questionDomainComposeId: string[];
  questionsubDomainComposeId: string[];
  level: number;
  duration: number;
  answers: IAnswerResponse[],
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
  maxValidationDate?: string;
}
export class QuestionResponse implements IQuestionResponse {
  questionId: string;
  questionUserId: string;
  quizUserId: string;
  comment: string;
  domains: IDomain[];
  subDomains: IDomain[];
  questionDomainComposeId: string[];
  questionsubDomainComposeId: string[];
  level: number;
  duration: number;
  answers: IAnswerResponse[];
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
  constructor(
    questionId: string,
    questionUserId: string,
    quizUserId: string,
    domains: IDomain[],
    subDomains: IDomain[],
    questionDomainComposeId: string[],
    questionsubDomainComposeId: string[],
    level: number,
    duration: number,
    answers: IAnswerResponse[],
    isActive: boolean,
    isDeleted: boolean,
    comment: string,
    title?: string,
    label?: string
  ){
    this.questionId = questionId;
    this.questionUserId = questionUserId;
    this.quizUserId = quizUserId;
    this.title = title;
    this.label = label;
    this.level = level;
    this.duration = duration;
    this.domains = domains;
    this.subDomains = subDomains;
    this.questionDomainComposeId = questionDomainComposeId;
    this.questionsubDomainComposeId=questionsubDomainComposeId;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.answers = answers;
  };
}
