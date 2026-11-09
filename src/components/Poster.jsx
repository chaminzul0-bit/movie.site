import { Link } from 'react-router-dom'

export default function Poster({ movie, large = false }) {
  return (
    <Link
      to={`/movie/${movie.id}`}
      className={`group relative shrink-0 snap-center transition duration-300 hover:-translate-y-2 ${large ? 'w-44 md:w-60' : 'w-36 md:w-48'}`}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-neutral-800 shadow-lg ring-1 ring-white/10 transition group-hover:shadow-[0_0_30px_rgba(229,38,43,.5)] group-hover:ring-sith">
        {movie.poster_url
          ? <img src={movie.poster_url} alt={movie.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" loading="lazy" />
          : <div className="heading flex h-full items-center justify-center bg-gradient-to-br from-sith/70 to-black p-3 text-center text-2xl">{movie.title}</div>}
        {movie.rating > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-bold text-gold backdrop-blur">★ {movie.rating}</span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-3 pt-10 opacity-0 transition group-hover:opacity-100">
          <p className="text-sm font-bold">{movie.title}</p>
          <p className="text-xs text-white/60">{movie.year}</p>
        </div>
      </div>
    </Link>
  )
}
