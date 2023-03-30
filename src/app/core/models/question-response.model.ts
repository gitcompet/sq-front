export interface IQuestionResponse {
  questionId: string;
  comment: string;
  domainId: string;
  domainNames:string[];
  subDomainId:string[];
  subDomainNames:string[];
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
  domainId: string;
  domainNames:string[];
  subDomainId:string[];
  subDomainNames:string[];
  level: number;
  answers: string[];
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
  constructor(
    questionId: string,
    domainId: string,
    subDomainId: string[],
    level: number,
    answers: string[],
    isActive: boolean,
    isDeleted: boolean,
    comment: string,
    domainNames:string[],
    subDomainNames:string[],
    title?: string,
    label?: string
  ){
    this.questionId = questionId;
    this.title = title;
    this.label = label;
    this.level = level;
    this.domainId = domainId;
    this.subDomainId = subDomainId;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.domainNames = domainNames;
    this.subDomainNames = subDomainNames;
    this.answers = answers;
  };
}
