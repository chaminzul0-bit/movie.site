export default function Footer() {
  const a = 'text-white/50 transition hover:text-gold'
  return (
    <footer className="mt-24 border-t border-white/10 bg-gradient-to-b from-[#0b0b0b] to-[#1a0507] px-6 py-16 md:px-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <span className="heading text-4xl text-gold">Кино<span className="text-sith">.</span></span>
        <div className="flex flex-wrap justify-center gap-8 text-lg md:gap-16">
          <a href="#" className={a}>Үйлчилгээний нөхцөл</a>
          <a href="#" className={a}>Нууцлал</a>
          <a href="#" className={a}>Күүки</a>
          <a href="#" className={a}>Лиценз</a>
        </div>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Кино. Бүх эрх хуулиар хамгаалагдсан.<br />
          Нүүр зураг: «Pulp Fiction» хөрөг, зураач Marko Manev.
        </p>
      </div>
    </footer>
  )
}
