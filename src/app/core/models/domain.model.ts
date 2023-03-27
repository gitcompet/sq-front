export interface IDomain {
  domainId: string;
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;
}
export class Domain implements IDomain {
  domainId: string;
  isActive: boolean;
  isDeleted: boolean;
  title?: string;
  label?: string;

  constructor(
    domainId: string,
    isActive: boolean,
    isDeleted: boolean,
    title?: string,
    label?: string
  ) {
    this.domainId = domainId;
    this.isActive = isActive;
    this.isDeleted = isDeleted;
    this.title = title;
    this.label = label;
  }
}
