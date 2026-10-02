import type { PayloadRequest } from 'payload'

function relationshipID(value: unknown): string | number | undefined {
  if (typeof value === 'object' && value !== null && 'id' in value) {
    const id = (value as { id?: string | number }).id
    return id === undefined ? undefined : id
  }
  return typeof value === 'string' || typeof value === 'number' ? value : undefined
}

export async function assertLessonBelongsToCourse(
  req: PayloadRequest,
  lessonValue: unknown,
  courseValue: unknown,
): Promise<void> {
  const lessonID = relationshipID(lessonValue)
  const courseID = relationshipID(courseValue)
  if (lessonID === undefined || courseID === undefined) {
    throw new Error('A lesson and enrolled course are required to update progress.')
  }
  const lesson = await req.payload.findByID({
    collection: 'lessons',
    id: lessonID,
    depth: 0,
    overrideAccess: true,
  })
  const moduleID = relationshipID(lesson.module)
  if (moduleID === undefined) throw new Error('The lesson must belong to the actively enrolled course.')
  const courseModule = await req.payload.findByID({
    collection: 'course-modules',
    id: moduleID,
    depth: 0,
    overrideAccess: true,
  })
  const moduleCourseID = relationshipID(courseModule.course)
  if (String(moduleCourseID) !== String(courseID)) {
    throw new Error('The lesson must belong to the actively enrolled course.')
  }
}

export function calculateCourseProgress(
  lessonIDs: Iterable<string | number>,
  progress: Array<{ lesson: unknown; completed?: boolean | null }>,
): number {
  const courseLessons = new Set([...lessonIDs].map(String))
  if (!courseLessons.size) return 0
  const completedLessons = new Set(
    progress
      .filter((entry) => entry.completed)
      .map((entry) => relationshipID(entry.lesson))
      .filter((id): id is string | number => id !== undefined)
      .map(String)
      .filter((id) => courseLessons.has(id)),
  )
  return Math.round((completedLessons.size / courseLessons.size) * 100)
}
