export interface Patch {
  path: string,
  op: string,
  value: any
}
export enum OperationType {
  REPLACE = 'replace'
}
