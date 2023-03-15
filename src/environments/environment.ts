export const environment = {
  production: true,
  baseUrl:`http://${process.env['URL_API']}:${process.env['PORT_API']}`,
  basePath:"/api",
  authPath : "/Auth/login",
  registrationPath : "/User/postUser",
  usersPath: "/User/getUsers",
  languagesPath: "/Languages/getLanguagess",
  languagePath: "/Languages/getLanguages",
  languagePostPath: "/Languages/postLanguages",
  languageRemovePath: "/Languages/removeLanguage",
  languageUpdatePath: "/Languages/updateLanguage",
};
