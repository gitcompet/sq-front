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
