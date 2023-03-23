export interface IQuestion {
  questionId: string;
  title: string;
  domainId: string;
  subDomainId: string;
  level: number;
  isActive: boolean;
  isDeleted: boolean;
}
export class Question implements IQuestion {
  questionId: string;
  title: string;
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
    isDeleted: boolean
  ){
    this.questionId = questionId;
    this.title = title;
    this.level = level;
    this.domainId = domainId;
    this.subDomainId = subDomainId;
    this.title = title;
    this.isActive = isActive;
    this.isDeleted = isDeleted
  };
}
