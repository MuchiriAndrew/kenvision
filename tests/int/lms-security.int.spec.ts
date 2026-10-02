import { describe, expect, it, vi } from 'vitest'
import type { Access, PayloadRequest } from 'payload'
import { enrolledLessonsOnly, enrolledModulesOnly } from '@/access'
import { assertLessonBelongsToCourse, calculateCourseProgress } from '@/lib/lms-security'

function accessRequest(user: unknown, find = vi.fn()) {
  return { user, payload: { find } } as unknown as PayloadRequest
}

async function runAccess(access: Access, req: PayloadRequest) {
  return access({ req } as Parameters<Access>[0])
}

describe('LMS learner access', () => {
  it('denies module and lesson reads to anonymous visitors', async () => {
    const find = vi.fn()
    const req = accessRequest(null, find)
    await expect(runAccess(enrolledModulesOnly, req)).resolves.toBe(false)
    await expect(runAccess(enrolledLessonsOnly, req)).resolves.toBe(false)
    expect(find).not.toHaveBeenCalled()
  })

  it('limits lesson reads to published modules from active or completed enrolments', async () => {
    const find = vi.fn()
      .mockResolvedValueOnce({ docs: [{ course: 44 }, { course: { id: 52 } }] })
      .mockResolvedValueOnce({ docs: [{ id: 80 }, { id: 81 }] })
    const req = accessRequest({ id: 7, role: 'student' }, find)
    await expect(runAccess(enrolledLessonsOnly, req)).resolves.toEqual({
      and: [
        { module: { in: [80, 81] } },
        { _status: { equals: 'published' } },
      ],
    })
    expect(find).toHaveBeenNthCalledWith(1, expect.objectContaining({
      collection: 'enrollments',
      where: { and: [{ student: { equals: 7 } }, { status: { in: ['active', 'completed'] } }] },
      overrideAccess: true,
    }))
    expect(find).toHaveBeenNthCalledWith(2, expect.objectContaining({
      collection: 'course-modules',
      where: { and: [{ course: { in: [44, 52] } }, { _status: { equals: 'published' } }] },
      overrideAccess: true,
    }))
  })

  it('returns only the learner’s enrolled module IDs', async () => {
    const find = vi.fn()
      .mockResolvedValueOnce({ docs: [{ course: 44 }] })
      .mockResolvedValueOnce({ docs: [{ id: 80 }] })
    await expect(runAccess(enrolledModulesOnly, accessRequest({ id: 7, role: 'student' }, find)))
      .resolves.toEqual({ id: { in: [80] } })
  })

  it('denies lesson access when the learner has no active or completed enrolment', async () => {
    const find = vi.fn().mockResolvedValueOnce({ docs: [] })
    await expect(runAccess(enrolledLessonsOnly, accessRequest({ id: 7, role: 'student' }, find)))
      .resolves.toBe(false)
    expect(find).toHaveBeenCalledTimes(1)
  })
})

describe('LMS progress validation', () => {
  it('rejects progress for lessons outside the enrolled course', async () => {
    const findByID = vi.fn()
      .mockResolvedValueOnce({ module: 81 })
      .mockResolvedValueOnce({ course: 52 })
    const req = { payload: { findByID } } as unknown as PayloadRequest
    await expect(assertLessonBelongsToCourse(req, 10, 44))
      .rejects.toThrow('The lesson must belong to the actively enrolled course.')
  })

  it('calculates completion only from completed lessons in the enrolled course', () => {
    expect(calculateCourseProgress([1, 2, 3], [
      { lesson: 1, completed: true },
      { lesson: { id: 2 }, completed: false },
      { lesson: 99, completed: true },
    ])).toBe(33)
  })

  it('does not mark an empty course complete', () => {
    expect(calculateCourseProgress([], [{ lesson: 1, completed: true }])).toBe(0)
  })
})
