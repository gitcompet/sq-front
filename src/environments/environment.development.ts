export const environment = {
  baseUrl: 'https://localhost:5001',
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
    userQuiz: '/QuizUser',
    quizQuestion: '/QuizCompose'
  },
  questionPaths: {
    base: '/Question',
    answer: '/Answer',
    answerUser: '/AnswerUser',
    userQuestion: '/QuestionUser',
    questionAnswers: '/AnswerQuestion'
  },
  categoryPaths: {
    base: '/Domain',
    domainCompose: '/DomainCompose'
  },
  languagesPaths: {
    base: '/Language'
  },
};
