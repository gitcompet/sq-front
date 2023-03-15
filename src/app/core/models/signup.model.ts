export interface SignUp {
  login:string ;
  email:string ;
  firstName:string ;
  lastName:string ;
  password:string;
  confirmPassword?:string;
  comment?: string
  languageId?: string
  typeUserId?: string
}
