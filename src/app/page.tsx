import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-deep via-emerald to-emerald-light flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Sakinah</h1>
        <p className="text-xl text-white/80 mb-2">Your Muslim Journal & Spiritual Companion</p>
        <p className="text-white/60 mb-10 max-w-md mx-auto">
          A peaceful space for reflection, gratitude, and growth — rooted in faith.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-3 rounded-2xl bg-emerald-gold text-emerald-deep font-semibold hover:bg-white transition-all"
          >
            Begin Your Journey
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}