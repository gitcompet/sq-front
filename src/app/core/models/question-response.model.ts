import { IDomain } from "./domain.model";

export interface IQuestionResponse {
  questionId: string;
  comment: string;
  domains: IDomain[];
  subDomains: IDomain[];
  level: number;
  answers: string[],
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
}
export class QuestionResponse implements IQuestionResponse {
  questionId: string;
  comment: string;
  domains: IDomain[];
  subDomains: IDomain[];
  level: number;
  answers: string[];
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
  constructor(
    questionId: string,
    domains: IDomain[],
    subDomains: IDomain[],
    level: number,
    answers: string[],
    isActive: boolean,
    isDeleted: boolean,
    comment: string,
    title?: string,
    label?: string
  ){
    this.questionId = questionId;
    this.title = title;
    this.label = label;
    this.level = level;
    this.domains = domains;
    this.subDomains = subDomains;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.answers = answers;
  };
}
