export const environment = {
  baseUrl: 'http://localhost:63869',
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
  questionPaths: {
    base: '/Question',
  },
  languagesPath: '/Languages/getLanguagess',
  languagePath: '/Languages/getLanguage',
  languagePostPath: '/Languages/postLanguage',
  languageRemovePath: '/Languages/removeLanguage',
  languageUpdatePath: '/Languages/updateLanguage',
};
