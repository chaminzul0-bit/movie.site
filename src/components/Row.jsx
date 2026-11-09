import { useRef } from 'react'
import Poster from './Poster'

export default function Row({ id, title, movies, bg = '' }) {
  const ref = useRef(null)
  const scroll = (dir) => ref.current.scrollBy({ left: dir * 320, behavior: 'smooth' })
  const btn = 'flex h-10 w-12 items-center justify-center rounded-full border border-white/40 text-lg transition hover:border-gold hover:bg-gold hover:text-black'
  return (
    <section id={id} className={`px-6 py-14 md:px-20 ${bg}`}>
      <div className="mb-8 flex items-center gap-5">
        <h2 className="heading text-5xl md:text-6xl">{title}<span className="text-sith">.</span></h2>
        <div className="ml-auto flex gap-2 md:ml-4">
          <button aria-label="Өмнөх" onClick={() => scroll(-1)} className={btn}>←</button>
          <button aria-label="Дараах" onClick={() => scroll(1)} className={btn}>→</button>
        </div>
      </div>
      {movies.length === 0
        ? <p className="text-white/60">Илэрц олдсонгүй. Хайлтаа өөрчлөөд үзнэ үү.</p>
        : (
          <div ref={ref} className="no-scrollbar flex snap-x items-end gap-6 overflow-x-auto px-1 pb-6 pt-3">
            {movies.map((m, i) => <Poster key={m.id} movie={m} large={i === 0} />)}
          </div>
        )}
    </section>
  )
}
