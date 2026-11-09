import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

const EMPTY = {
  title: '', type: 'film', year: '', director: '', runtime: '', genre: '', rating: '', price: 0,
  synopsis: '', trailer_url: '', story_text: '', acting_text: '', cinematography_text: '',
  impact_text: '', easter_eggs: '', recommendation: '', poster_url: '', backdrop_url: '',
}
const LONG = ['synopsis', 'story_text', 'acting_text', 'cinematography_text', 'impact_text', 'easter_eggs', 'recommendation']
const MAX_MB = 2
const TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function Admin() {
  const { user, role } = useAuth()
  const [movies, setMovies] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const load = () =>
    supabase.from('movies').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setMovies(data ?? []))
  useEffect(() => { load() }, [])

  if (!user) return <p className="p-24 text-center"><Link to="/login" className="underline">Нэвтэрнэ үү</Link></p>
  if (role !== 'admin') return <p className="p-24 text-center">Зөвхөн админ хандах эрхтэй.</p>

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function pickFile(e) {
    const f = e.target.files[0]
    if (!f) return
    if (!TYPES.includes(f.type)) return setMsg('Зөвхөн JPG, PNG, WEBP зураг оруулна.')
    if (f.size > MAX_MB * 1024 * 1024) return setMsg(`Зургийн хэмжээ ${MAX_MB}MB-аас бага байна.`)
    setMsg(''); setFile(f); setPreview(URL.createObjectURL(f))
  }

  async function save(e) {
    e.preventDefault()
    if (!form.title.trim()) return setMsg('Киноны нэр оруулна уу.')
    if (form.year && (form.year < 1888 || form.year > 2100)) return setMsg('Он буруу байна.')
    if (form.rating && (form.rating < 0 || form.rating > 5)) return setMsg('Үнэлгээ 0-5 хооронд байна.')
    setBusy(true)
    let poster_url = form.poster_url
    if (file) {
      const path = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
      const { error: upErr } = await supabase.storage.from('posters').upload(path, file)
      if (upErr) { setBusy(false); return setMsg('Зураг хуулж чадсангүй.') }
      poster_url = supabase.storage.from('posters').getPublicUrl(path).data.publicUrl
    }
    const row = {
      ...form, poster_url,
      year: form.year || null, runtime: form.runtime || null,
      rating: form.rating || 0, price: Number(form.price) || 0,
    }
    delete row.id; delete row.created_at
    const { error } = editId
      ? await supabase.from('movies').update(row).eq('id', editId)
      : await supabase.from('movies').insert(row)
    setBusy(false)
    if (error) return setMsg('Хадгалж чадсангүй: ' + error.message)
    setMsg(editId ? 'Кино шинэчлэгдлээ.' : 'Кино нэмэгдлээ.')
    reset(); load()
  }

  function reset() { setForm(EMPTY); setEditId(null); setFile(null); setPreview('') }

  function edit(m) {
    setEditId(m.id); setFile(null); setPreview(m.poster_url || '')
    setForm({ ...EMPTY, ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, m[k] ?? EMPTY[k]])) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function remove(m) {
    if (!window.confirm(`"${m.title}" киног устгах уу? Буцаах боломжгүй.`)) return
    const { error } = await supabase.from('movies').delete().eq('id', m.id)
    setMsg(error ? 'Устгаж чадсангүй.' : 'Кино устгагдлаа.')
    load()
  }

  const inp = 'w-full rounded bg-white/10 p-2 text-sm outline-none focus:ring-1 focus:ring-white'
  return (
    <main className="mx-auto max-w-5xl px-6 pb-20 pt-28">
      <h1 className="mb-6 text-3xl font-bold">Админ: кино удирдах</h1>

      <form onSubmit={save} className="mb-10 grid gap-3 md:grid-cols-2">
        <input className={inp} placeholder="Нэр" value={form.title} onChange={set('title')} />
        <select className={inp} value={form.type} onChange={set('type')}>
          <option value="film" className="text-black">Film</option>
          <option value="series" className="text-black">Serial</option>
        </select>
        <input className={inp} type="number" placeholder="Он" value={form.year} onChange={set('year')} />
        <input className={inp} placeholder="Найруулагч" value={form.director} onChange={set('director')} />
        <input className={inp} type="number" placeholder="Үргэлжлэх хугацаа (мин)" value={form.runtime} onChange={set('runtime')} />
        <input className={inp} placeholder="Төрөл (Horror, Animation...)" value={form.genre} onChange={set('genre')} />
        <input className={inp} type="number" step="0.1" placeholder="Үнэлгээ (0-5)" value={form.rating} onChange={set('rating')} />
        <input className={inp} type="number" placeholder="Үнэ (₮)" value={form.price} onChange={set('price')} />
        <input className={`${inp} md:col-span-2`} placeholder="Trailer линк (YouTube)" value={form.trailer_url} onChange={set('trailer_url')} />
        {LONG.map((k) => (
          <textarea key={k} rows={3} className={`${inp} md:col-span-2`} placeholder={k} value={form[k]} onChange={set(k)} />
        ))}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm text-white/60">Poster зураг (JPG/PNG/WEBP, {MAX_MB}MB хүртэл)</label>
          <input type="file" accept={TYPES.join(',')} onChange={pickFile} className="text-sm" />
          {preview && <img src={preview} alt="Урьдчилан харах" className="mt-3 h-40 rounded" />}
        </div>
        <div className="flex items-center gap-3 md:col-span-2">
          <button disabled={busy} className="rounded-lg bg-sith px-5 py-2 font-bold">{busy ? 'Хадгалж байна…' : editId ? 'Хадгалах' : 'Кино нэмэх'}</button>
          {editId && <button type="button" onClick={reset} className="rounded-lg border border-white/40 px-4 py-2 text-sm">Болих</button>}
          {msg && <span className="text-sm text-white/70">{msg}</span>}
        </div>
      </form>

      <table className="w-full text-left text-sm">
        <thead className="text-white/50"><tr><th className="py-2">Нэр</th><th>Төрөл</th><th>Он</th><th /></tr></thead>
        <tbody>
          {movies.length === 0 && <tr><td colSpan="4" className="py-6 text-white/60">Кино байхгүй байна. Дээрх формоор эхний киногоо нэмнэ үү.</td></tr>}
          {movies.map((m) => (
            <tr key={m.id} className="border-t border-white/10">
              <td className="py-2">{m.title}</td><td>{m.type}</td><td>{m.year}</td>
              <td className="space-x-3 text-right">
                <button onClick={() => edit(m)} className="underline">Засах</button>
                <button onClick={() => remove(m)} className="text-sith underline">Устгах</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
