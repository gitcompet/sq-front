export const environment = {
  production: true,
  baseUrl: 'http://145.239.0.38:9999',
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
    testCategories: '/TestCategoryCompose',
  },
  testUserPaths: {
    base: '/TestUser',
    quizTest: '/TestCompose',
    quizQuestion: '/QuizCompose'
  },
  questionPaths: {
    base: '/Question',
  },
  categoryPaths: {
    base: '/Domain',
    domainCompose: '/DomainCompose'
  },
  languagesPaths: {
    base: '/Language'
  },
};
