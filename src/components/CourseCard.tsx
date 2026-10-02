import Link from 'next/link'
import { formatPrice, type Course } from '@/data/courses'

const images: Record<string, string> = {
  'Security Systems': 'https://images.unsplash.com/photo-1589935447067-5531094415d1?auto=format&fit=crop&w=900&q=85',
  'Automotive Technology': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=85',
  'Facilities & Property': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85',
  'Electrical & Power': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=85',
  'ICT & Technical': 'https://images.unsplash.com/photo-1594915440248-1e419eba6611?auto=format&fit=crop&w=900&q=85',
  'Professional & Management': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85',
}

export function CourseCard({ course, featured = false }: { course: Course; featured?: boolean }) {
  return <Link href={`/training/${course.id}`} className="course-card">
    <div className="course-card__image"><img src={course.image || images[course.category] || images['ICT & Technical']} alt="" loading="lazy" />{featured&&<span className="course-card__badge">Featured</span>}</div>
    <div className="course-card__body">
      <span className="course-card__category">{course.category}</span>
      <h3>{course.title}</h3>
      <div className="course-card__tags">{course.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="course-card__bottom"><div><strong>{formatPrice(course.price)}</strong>{course.was && <del>{formatPrice(course.was)}</del>}</div><span>View course →</span></div>
    </div>
  </Link>
}
