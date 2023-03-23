export const environment = {
  production: true,
  baseUrl:"http://145.239.0.38:9999",
  apiVersion: '/api/v1',
  authPaths: {
    base: '/Auth',
    login: '/login',
    refresh: '/refresh',
  },
  userPaths: {
    base: '/User',
    export: '/exports'
  },
  quizPaths: {
    base: '/Quiz',
  },
  testPaths: {
    base: '/Test',
  },
  testUserPaths: {
    base: '/TestUser',
    quizTest: '/TestCompose',
    quizQuestion: '/QuizCompose'
  },
  questionPaths: {
    base: '/Question',
  },
  languagesPath: '/Languages/getLanguagess',
  languagePath: '/Languages/getLanguage',
  languagePostPath: '/Languages/postLanguage',
  languageRemovePath: '/Languages/removeLanguage',
  languageUpdatePath: '/Languages/updateLanguage',
};
