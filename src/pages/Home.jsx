import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Row from '../components/Row'

const FEATURES = [
  ['🎬', 'Дэлгэрэнгүй мэдээлэл', 'Кино бүрт тойм, жүжигчид, нууц зүйлс'],
  ['🔎', 'Хурдан хайлт', 'Нэрээр хайж, төрлөөр нь ялгана'],
  ['📱', 'Бүх төхөөрөмж дээр', 'Утас, таблет, компьютер дээр сайхан ажиллана'],
]

export default function Home() {
  const [movies, setMovies] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('movies').select('*').order('year', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError('Кино ачаалж чадсангүй. Дахин оролдоно уу.')
        else setMovies(data)
        setLoading(false)
      })
  }, [])

  const filtered = movies.filter((m) => m.title.toLowerCase().includes(q.toLowerCase()))
  const films = filtered.filter((m) => m.type === 'film')
  const series = filtered.filter((m) => m.type === 'series')

  return (
    <main>
      <header className="relative h-[62vh] min-h-[360px] overflow-hidden md:h-[80vh]">
        <img src="/hero.jpg" alt="Pulp Fiction хөрөг" className="h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-black/50" />
      </header>

      <section className="rise relative z-10 -mt-24 grid gap-10 px-6 md:-mt-32 md:grid-cols-2 md:px-20">
        <div>
          <h1 className="heading text-5xl leading-none text-gold md:text-7xl">Бүх кино<br />нэг дор<span className="text-sith">!</span></h1>
          <p className="mt-4 max-w-md text-white/70">Аймшгаас адал явдал хүртэл. Трейлер, дэлгэрэнгүй тайлбар, жүжигчдийн бүрэлдэхүүнийг нэг дороос үзээрэй.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Кино хайх..."
              className="w-64 rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-sm outline-none backdrop-blur transition focus:border-gold"
            />
            <a href="#films" className="btn btn-red">Сонгох</a>
          </div>
        </div>
        <div className="grid gap-3 self-end">
          <h2 className="heading text-2xl">Яагаад бид?</h2>
          {FEATURES.map(([icon, t, d]) => (
            <div key={t} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-sith/60">
              <span className="text-2xl">{icon}</span>
              <div><p className="font-bold">{t}</p><p className="text-sm text-white/60">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {loading && <p className="p-20 text-center text-white/60">Ачаалж байна…</p>}
      {error && <p className="p-20 text-center text-sith">{error}</p>}
      {!loading && !error && (
        <>
          <Row id="films" title="Кинонууд" movies={films} />
          <Row id="serials" title="Цувралууд" movies={series} bg="bg-gradient-to-b from-[#0b0b0b] via-[#2a0508] to-[#0b0b0b]" />
        </>
      )}
    </main>
  )
}
