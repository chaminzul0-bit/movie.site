import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('guest')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return setRole('guest')
    supabase.from('profiles').select('role').eq('id', user.id).single()
      .then(({ data }) => setRole(data?.role ?? 'user'))
  }, [user])

  return <AuthContext.Provider value={{ user, role }}>{children}</AuthContext.Provider>
}
