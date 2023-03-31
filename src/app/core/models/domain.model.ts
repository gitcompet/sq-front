export interface IDomain {
  domainId: string;
  subDomainId: string,
  isActive: boolean;
  isDeleted: boolean;
  name: string;
  title?: string;
  label?: string;

}
export class Domain implements IDomain {
  domainId: string;
  subDomainId: string;
  isActive: boolean;
  isDeleted: boolean;
  name: string;
  title?: string;
  label?: string;

  constructor(
    domainId: string,
    subDomainId: string,
    isActive: boolean,
    isDeleted: boolean,
    name: string,
    title?: string,
    label?: string,

  ) {
    this.domainId = domainId;
    this.subDomainId = subDomainId;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.title = title;
    this.label = label;
    this.name = name;
  }
}
export enum ElementTypes {
  QUESTION= 'QUESTION',
  QUIZ= 'QUIZ'
}
