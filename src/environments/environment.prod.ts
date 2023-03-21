export interface IMapping {
  [propertyName: string]: string;
}
export const environment = {
  production: true,
  baseUrl:`${window["env" as keyof Window]["URL_API"]}:${window["env" as keyof Window]['PORT_API']}` || 'default',
  basePath:"/api",
  authPath : "/Auth/login",
  refreshPath : "/Auth/refresh",
  registrationPath : "/User/postUser",
  usersPath: "/User/getUsers",
  languagesPath: "/Languages/getLanguagess",
  languagePath: "/Languages/getLanguages",
  languagePostPath: "/Languages/postLanguages",
  languageRemovePath: "/Languages/removeLanguage",
  languageUpdatePath: "/Languages/updateLanguage",
};
