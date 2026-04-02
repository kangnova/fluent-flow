import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-sky-400 mb-2">FluentFlow</h1>
        <p className="text-slate-400">Master English through Self-Talk & Tech Focus</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Welcome Card */}
        <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Welcome back, Rin! 👋</h2>
          <p className="text-slate-300 mb-6">
            Ready to practice your English today? Let's start with your daily checklist.
          </p>
          <div className="flex gap-4">
            <button className="bg-sky-500 hover:bg-sky-600 px-6 py-2 rounded-lg font-medium transition-colors">
              Start Practice
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg font-medium transition-colors">
              View Vocab
            </button>
          </div>
        </section>

        {/* Counter Card (Learning State) */}
        <section className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-center items-center">
          <h3 className="text-slate-400 uppercase tracking-widest text-sm mb-4">React State Practice</h3>
          <p className="text-5xl font-bold mb-6 text-sky-400">{count}</p>
          <button 
            onClick={() => setCount(count + 1)}
            className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-400/30 px-8 py-3 rounded-full font-bold transition-all"
          >
            Practice Click!
          </button>
        </section>
      </main>

      <footer className="mt-16 text-center text-slate-500 text-sm">
        <p>&copy; 2026 FluentFlow - Built with React & Tailwind</p>
      </footer>
    </div>
  )
}

export default App
