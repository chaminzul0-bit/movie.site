import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

export default function Navbar() {
  const { user, role } = useAuth()
  const link = 'text-sm font-medium text-white/80 transition hover:text-gold'
  return (
    <nav className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent px-6 py-4 backdrop-blur-[2px] md:px-16">
      <Link to="/" className="heading text-3xl text-gold">Кино<span className="text-sith">.</span></Link>
      <div className="flex items-center gap-5 md:gap-10">
        <a href="/#films" className={link}>Кино</a>
        <a href="/#serials" className={link}>Цуврал</a>
        {role === 'admin' && <Link to="/admin" className={link}>Админ</Link>}
        {user
          ? <button onClick={() => supabase.auth.signOut()} className="btn btn-line !py-1.5">Гарах</button>
          : <Link to="/login" className="btn btn-red !py-1.5">Нэвтрэх</Link>}
      </div>
    </nav>
  )
}
