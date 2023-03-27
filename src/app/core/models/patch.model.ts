export interface Patch {
  id: string,
  operationType?: 0,
  path: string,
  op: string,
  value: any
}
export enum OperationType {
  REPLACE = 'replace'
}
