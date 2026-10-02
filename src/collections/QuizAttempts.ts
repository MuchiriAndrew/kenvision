import type { CollectionConfig } from 'payload'
import { isAdmin, isStaff } from '../access'

export const QuizAttempts: CollectionConfig = {
  slug: 'quiz-attempts',
  admin: { group: 'Learning', useAsTitle: 'id', defaultColumns: ['student', 'quiz', 'score', 'passed', 'createdAt'] },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => isStaff(req.user) ? true : { student: { equals: req.user?.id } },
    update: ({ req }) => isStaff(req.user),
    delete: ({ req }) => isAdmin(req.user),
  },
  hooks: {
    beforeChange: [async ({ data, originalDoc, req }) => {
      if (isStaff(req.user)) return data
      if (!req.user) throw new Error('Sign in is required to submit a quiz.')
      if (originalDoc) throw new Error('Quiz submissions cannot be edited after submission.')
      data.student = req.user.id
      const quizId = data.quiz
      if (!quizId) throw new Error('A quiz is required.')
      const quiz = await req.payload.findByID({ collection: 'quizzes', id: typeof quizId === 'object' ? quizId.id : quizId, user: req.user, overrideAccess: true })
      const answers = Array.isArray(data.answers) ? data.answers : []
      const questions = Array.isArray(quiz.questions) ? quiz.questions : []
      const enrollmentId = data.enrollment
      if (!enrollmentId) throw new Error('An enrolment is required.')
      const enrollment = await req.payload.findByID({ collection: 'enrollments', id: typeof enrollmentId === 'object' ? enrollmentId.id : enrollmentId, user: req.user, overrideAccess: false })
      const studentId = typeof enrollment.student === 'object' ? enrollment.student.id : enrollment.student
      const quizCourse = typeof quiz.course === 'object' ? quiz.course.id : quiz.course
      const enrollmentCourse = typeof enrollment.course === 'object' ? enrollment.course.id : enrollment.course
      if (String(studentId) !== String(req.user.id) || enrollment.status !== 'active' || String(quizCourse) !== String(enrollmentCourse)) throw new Error('An active enrolment for this course is required.')
      const answered = new Set<number>()
      const correct = answers.reduce((total: number, answer: any) => {
        const questionIndex = Number(answer.questionIndex)
        const selectedOption = Number(answer.selectedOption)
        const question = questions[questionIndex]
        if (!Number.isInteger(questionIndex) || !question || answered.has(questionIndex)) return total
        answered.add(questionIndex)
        const optionCount = Array.isArray(question.options) ? question.options.length : 0
        if (!Number.isInteger(selectedOption) || selectedOption < 0 || selectedOption >= optionCount) return total
        return total + (question.correctOption === selectedOption ? 1 : 0)
      }, 0)
      const score = questions.length ? Math.round(correct / questions.length * 100) : 0
      data.score = score
      data.passed = score >= Number(quiz.passingScore ?? 70)
      data.submittedAt = new Date().toISOString()
      return data
    }],
  },
  fields: [
    { name: 'student', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'enrollment', type: 'relationship', relationTo: 'enrollments', required: true },
    { name: 'quiz', type: 'relationship', relationTo: 'quizzes', required: true },
    { name: 'answers', type: 'array', fields: [{ name: 'questionIndex', type: 'number', required: true }, { name: 'selectedOption', type: 'number', required: true }] },
    { name: 'score', type: 'number', min: 0, max: 100, access: { update: ({ req }) => isStaff(req.user) } },
    { name: 'passed', type: 'checkbox', access: { update: ({ req }) => isStaff(req.user) } },
    { name: 'submittedAt', type: 'date', defaultValue: () => new Date().toISOString() },
  ],
  timestamps: true,
}
