'use client'

import { useMemo, useState } from 'react'
import { CourseCard } from '@/components/CourseCard'
import { categories, type Course, type CourseCategory } from '@/data/courses'

export function Catalogue({ courses, initialCategory = 'All' }: { courses: Course[]; initialCategory?: CourseCategory | 'All' }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CourseCategory | 'All'>(initialCategory)
  const [sort, setSort] = useState('featured')

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const list = courses.filter((course) => {
      const matchesQuery = !query || course.title.toLowerCase().includes(query) || course.category.toLowerCase().includes(query) || course.tags.some((tag) => tag.toLowerCase().includes(query))
      return matchesQuery && (category === 'All' || course.category === category)
    })
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [courses, search, category, sort])

  return <>
    <div className="catalogue-controls">
      <label className="catalogue-search"><span className="sr-only">Search training programmes</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search programmes, topics or skills" /></label>
      <label><span className="sr-only">Training area</span><select value={category} onChange={(event) => setCategory(event.target.value as CourseCategory | 'All')}><option value="All">All training areas</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span className="sr-only">Sort programmes</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="az">A–Z</option></select></label>
    </div>
    <p className="catalogue-count">Showing {filtered.length} of {courses.length} programmes</p>
    {filtered.length ? <div className="course-grid">{filtered.map((course) => <CourseCard key={course.id} course={course} />)}</div> : <div className="empty-state"><h2>No programmes found</h2><p>Try another search or training area.</p><button className="btn-secondary" onClick={() => { setSearch(''); setCategory('All') }}>Clear filters</button></div>}
  </>
}
