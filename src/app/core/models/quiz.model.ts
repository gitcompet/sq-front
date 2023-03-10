import { Question } from "./question.model";

export interface Quiz {
    id: string,
    title:string ;
    domainId:string;
    subdomainId:string ;
    comment: string;
    active: boolean,
    deleted: boolean,
    questions : Question[]
}
