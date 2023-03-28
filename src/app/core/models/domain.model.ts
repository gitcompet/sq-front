export interface IDomain {
  domainId: string;
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
  name?: string;
}
export class Domain implements IDomain {
  domainId: string;
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
  name?: string;

  constructor(
    domainId: string,
    isActive: boolean,
    isDeleted: boolean,
    title?: string,
    label?: string,
    name?: string
  ) {
    this.domainId = domainId;
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
