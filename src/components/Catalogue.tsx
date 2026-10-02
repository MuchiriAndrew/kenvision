'use client'

import { useMemo, useState } from 'react'
import { CourseCard } from '@/components/CourseCard'
import { categories, type Course, type CourseCategory } from '@/data/courses'

const pageSize = 6

export function Catalogue({ courses, initialCategory = 'All' }: { courses: Course[]; initialCategory?: CourseCategory | 'All' }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CourseCategory | 'All'>(initialCategory)
  const [delivery, setDelivery] = useState('All')
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const list = courses.filter((course) => {
      const matchesQuery = !query || course.title.toLowerCase().includes(query) || course.category.toLowerCase().includes(query) || course.tags.some((tag) => tag.toLowerCase().includes(query))
      const matchesCategory = category === 'All' || course.category === category
      const matchesDelivery = delivery === 'All' || !course.deliveryModes?.length || course.deliveryModes.includes(delivery)
      return matchesQuery && matchesCategory && matchesDelivery
    })
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [courses, search, category, delivery, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const selectCategory = (value: CourseCategory | 'All') => { setCategory(value); setPage(1) }
  const clear = () => { setSearch(''); setCategory('All'); setDelivery('All'); setSort('featured'); setPage(1) }
  const changePage = (value: number) => { setPage(value); document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' }) }

  return <>
    <div className="catalogue-toolbar">
      <label className="catalogue-search"><span className="sr-only">Search training programmes</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search training programmes..." /></label>
      <label><span className="sr-only">Training category</span><select value={category} onChange={(event) => selectCategory(event.target.value as CourseCategory | 'All')}><option value="All">All Categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span className="sr-only">Delivery mode</span><select value={delivery} onChange={(event) => { setDelivery(event.target.value); setPage(1) }}><option value="All">All Delivery</option><option>In-Person</option><option>Online</option></select></label>
      <label><span className="sr-only">Sort programmes</span><select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1) }}><option value="featured">Sort: Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="az">A–Z</option></select></label>
      {(search || category !== 'All' || delivery !== 'All' || sort !== 'featured') && <button type="button" className="catalogue-clear" onClick={clear}>Clear filters</button>}
    </div>
    <div className="catalogue-pills">{(['All', ...categories] as const).map((item) => <button type="button" className={category === item ? 'active' : ''} key={item} onClick={() => selectCategory(item)}>{item} <span>{item === 'All' ? courses.length : courses.filter((course) => course.category === item).length}</span></button>)}</div>
    <p className="catalogue-count">Showing {filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} programmes{category !== 'All' ? ` in ${category}` : ''}{search ? ` matching “${search}”` : ''}</p>
    {visible.length ? <div className="course-grid catalogue-grid">{visible.map((course) => <CourseCard key={course.id} course={course} />)}</div> : <div className="empty-state"><h2>No programmes match your search.</h2><p>Try adjusting your filters.</p><button className="btn-secondary" onClick={clear}>Clear filters</button></div>}
    {totalPages > 1 && <nav className="catalogue-pagination" aria-label="Catalogue pages"><button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>← Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} className={number === currentPage ? 'active' : ''} aria-current={number === currentPage ? 'page' : undefined} onClick={() => changePage(number)}>{number}</button>)}<button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>Next →</button></nav>}
  </>
}
