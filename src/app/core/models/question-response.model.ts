export interface IQuestionResponse {
  questionId: string;
  title: string;
  comment: string;
  domainId: string;
  subDomainId: string;
  level: number;
  isActive: boolean;
  isDeleted: boolean;
}
export class QuestionResponse implements IQuestionResponse {
  questionId: string;
  title: string;
  comment: string;
  domainId: string;
  subDomainId: string;
  level: number;
  isActive: boolean;
  isDeleted: boolean;
  constructor(
    questionId: string,
    title: string,
    domainId: string,
    subDomainId: string,
    level: number,
    isActive: boolean,
    isDeleted: boolean,
    comment: string
  ){
    this.questionId = questionId;
    this.title = title;
    this.level = level;
    this.domainId = domainId;
    this.subDomainId = subDomainId;
    this.comment = comment;
    this.isActive = isActive;
    this.isDeleted = isDeleted
  };
}
