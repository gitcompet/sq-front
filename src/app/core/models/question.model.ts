export interface IQuestion {
  questionId: string;
  domainId: string;
  subDomainId: string;
  level: number;
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
}
export class Question implements IQuestion {
  questionId: string;
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
    title?: string,
    label?: string
  ){
    this.questionId = questionId;
    this.title = title;
    this.label = label;
    this.level = level;
    this.domainId = domainId;
    this.subDomainId = subDomainId;
    this.isActive = isActive;
    this.isDeleted = isDeleted
  };
}
