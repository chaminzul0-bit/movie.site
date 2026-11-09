import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const nav = useNavigate()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (password.length < 6) return setMsg('Нууц үг 6-аас дээш тэмдэгттэй байна.')
    const fn = mode === 'signin' ? supabase.auth.signInWithPassword : supabase.auth.signUp
    const { error } = await fn.call(supabase.auth, { email, password })
    if (error) return setMsg(error.message)
    if (mode === 'signup') return setMsg('Бүртгэл амжилттай. Имэйлээ баталгаажуулна уу.')
    nav('/')
  }

  const input = 'w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm outline-none transition focus:border-gold'
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <img src="/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-black/70" />
      <form onSubmit={submit} className="rise relative w-full max-w-sm space-y-4 rounded-3xl border border-white/10 bg-black/60 p-8 backdrop-blur">
        <Link to="/" className="heading text-3xl text-gold">Кино<span className="text-sith">.</span></Link>
        <h1 className="heading text-4xl">{mode === 'signin' ? 'Нэвтрэх' : 'Бүртгүүлэх'}</h1>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={input} />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Нууц үг" className={input} />
        <button className="btn btn-red w-full">{mode === 'signin' ? 'Нэвтрэх' : 'Бүртгүүлэх'}</button>
        {msg && <p className="text-sm text-white/70">{msg}</p>}
        <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-sm text-white/60 underline">
          {mode === 'signin' ? 'Бүртгэлгүй юу? Бүртгүүлэх' : 'Бүртгэлтэй юу? Нэвтрэх'}
        </button>
      </form>
    </main>
  )
}
