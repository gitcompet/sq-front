export interface IQuestionResponse {
  questionId: string;
  comment: string;
  domainId: string;
  subDomainId: string;
  level: number;
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
}
export class QuestionResponse implements IQuestionResponse {
  questionId: string;
  comment: string;
  domainId: string;
  subDomainId: string;
  level: number;
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
  constructor(
    questionId: string,
    domainId: string,
    subDomainId: string,
    level: number,
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
    this.domainId = domainId;
    this.subDomainId = subDomainId;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted
  };
}
