'use client'

import { useState } from 'react'

export function DemoLessonButton() {
  const [complete, setComplete] = useState(false)
  return (
    <button
      type="button"
      className="lr-complete-button"
      onClick={() => setComplete(true)}
      disabled={complete}
    >
      {complete ? '✓ Marked complete in preview' : 'Mark as complete'}
    </button>
  )
}
