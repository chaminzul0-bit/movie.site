import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

const Section = ({ title, text }) =>
  text ? (
    <div className="mb-5 rounded-2xl border-l-4 border-sith bg-white/5 p-5">
      <h3 className="heading mb-2 text-xl text-gold">{title}</h3>
      <p className="text-sm leading-relaxed text-white/80">{text}</p>
    </div>
  ) : null

export default function MovieDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ rating: 5, body: '' })
  const [msg, setMsg] = useState('')

  const loadReviews = () =>
    supabase.from('reviews').select('*').eq('movie_id', id).order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data ?? []))

  useEffect(() => {
    supabase.from('movies')
      .select('*, movie_cast(role_name, cast_members(name, photo_url))')
      .eq('id', id).single()
      .then(({ data }) => { setMovie(data); setLoading(false) })
    loadReviews()
  }, [id])

  async function submitReview(e) {
    e.preventDefault()
    if (form.body.trim().length < 3) return setMsg('Сэтгэгдлээ 3-аас дээш тэмдэгтээр бичнэ үү.')
    const { error } = await supabase.from('reviews').insert({
      movie_id: id, user_id: user.id, rating: Number(form.rating), body: form.body.trim(),
    })
    if (error) return setMsg('Сэтгэгдэл нэмж чадсангүй.')
    setForm({ rating: 5, body: '' }); setMsg('Сэтгэгдэл нэмэгдлээ.'); loadReviews()
  }

  if (loading) return <p className="p-24 text-center">Ачаалж байна…</p>
  if (!movie) return <p className="p-24 text-center">Кино олдсонгүй. <Link to="/" className="underline">Бүх кино</Link></p>

  return (
    <main className="pb-16">
      <div className="relative flex h-[55vh] min-h-[320px] items-end overflow-hidden px-6 pb-10 md:px-20">
        <img src={movie.backdrop_url || '/hero.jpg'} alt="" className="absolute inset-0 h-full w-full object-cover object-top opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/40 to-transparent" />
        <div className="rise relative">
          <h1 className="heading text-6xl text-gold md:text-8xl">{movie.title}</h1>
          <p className="mt-2 text-sm text-white/80">({movie.year}) найруулагч {movie.director}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {movie.genre && <span className="rounded-full border border-white/30 px-3 py-1">{movie.genre}</span>}
            {movie.runtime && <span className="rounded-full border border-white/30 px-3 py-1">{movie.runtime} мин</span>}
            <span className="rounded-full bg-gold px-3 py-1 font-bold text-black">★ {movie.rating}/5</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[240px_1fr] md:px-10">
        <aside className="md:-mt-24">
          <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-neutral-800 shadow-2xl ring-1 ring-white/20">
            {movie.poster_url
              ? <img src={movie.poster_url} alt={movie.title} className="h-full w-full object-cover" />
              : <div className="heading flex h-full items-center justify-center bg-gradient-to-br from-sith/70 to-black p-4 text-center text-3xl">{movie.title}</div>}
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <button className="btn btn-red">Үзэх · {movie.price ? `${movie.price}₮` : 'Үнэгүй'}</button>
            {movie.trailer_url && <a href={movie.trailer_url} target="_blank" rel="noreferrer" className="btn btn-line">Трейлер үзэх</a>}
          </div>
        </aside>

        <div>
          {movie.gallery?.length > 0 && (
            <div className="no-scrollbar mb-8 flex gap-3 overflow-x-auto">
              {movie.gallery.map((src) => <img key={src} src={src} alt="" className="h-36 rounded-xl object-cover" />)}
            </div>
          )}
          <Section title="Агуулга" text={movie.synopsis} />
          <div className="grid gap-x-5 lg:grid-cols-2">
            <Section title="Сюжет ба зохиол" text={movie.story_text} />
            <Section title="Жүжиглэлт ба дүрүүд" text={movie.acting_text} />
            <Section title="Найруулга ба зураглал" text={movie.cinematography_text} />
            <Section title="Нөлөө ба урам зориг" text={movie.impact_text} />
            <Section title="Нууц зүйлс (Easter eggs)" text={movie.easter_eggs} />
            <Section title="Зөвлөмж" text={movie.recommendation} />
          </div>

          {movie.movie_cast?.length > 0 && (
            <div className="mb-8">
              <h3 className="heading mb-3 text-2xl">Жүжигчид</h3>
              <ul className="grid gap-2 text-sm sm:grid-cols-2">
                {movie.movie_cast.map((c, i) => (
                  <li key={i} className="rounded-xl bg-white/5 px-4 py-2">{c.role_name} <span className="text-white/50">· {c.cast_members?.name}</span></li>
                ))}
              </ul>
            </div>
          )}

          <h3 className="heading mb-3 text-2xl">Сэтгэгдэл</h3>
          {user ? (
            <form onSubmit={submitReview} className="mb-6 flex flex-col gap-3">
              <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-28 rounded-full bg-white/10 px-3 py-2 text-sm">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n} className="text-black">{n} ★</option>)}
              </select>
              <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={3} placeholder="Сэтгэгдлээ бичнэ үү" className="rounded-2xl bg-white/10 p-3 text-sm outline-none focus:ring-1 focus:ring-gold" />
              <button className="btn btn-line self-start">Сэтгэгдэл нэмэх</button>
              {msg && <p className="text-sm text-white/70">{msg}</p>}
            </form>
          ) : <p className="mb-6 text-sm text-white/60"><Link to="/login" className="text-gold underline">Нэвтэрч</Link> сэтгэгдэл бичнэ үү.</p>}
          {reviews.length === 0 && <p className="text-sm text-white/60">Сэтгэгдэл алга байна. Анхных нь болоорой.</p>}
          {reviews.map((r) => (
            <div key={r.id} className="mb-3 rounded-2xl bg-white/5 p-4 text-sm">
              <span className="text-gold">{'★'.repeat(r.rating)}</span> <span className="text-white/80">{r.body}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
