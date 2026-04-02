import { useState } from 'react'
import Layout from './components/Layout'
import { CheckCircle2, Circle, Settings } from 'lucide-react'

// Sub-komponen Dashboard (Akan dipindah ke file tersendiri di fase berikutnya)
const Dashboard = ({ count, setCount }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <header>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
        Overview
      </h2>
      <p className="text-slate-400 mt-2">Track your daily English practice and progress.</p>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Daily Checklist Card */}
      <section className="lg:col-span-2 bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Today's Daily Quest</h3>
          <span className="text-xs bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full border border-sky-400/20">
            2/3 Completed
          </span>
        </div>
        
        <div className="space-y-4">
          {[
            { task: 'Read 1 Technical Documentation', done: true },
            { task: '10 Minutes Self-Talk Session', done: true },
            { task: 'Update Vocab Vault', done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30 hover:border-sky-500/30 transition-all cursor-pointer group">
              {item.done ? (
                <CheckCircle2 size={24} className="text-emerald-400 fill-emerald-400/10" />
              ) : (
                <Circle size={24} className="text-slate-600 group-hover:text-sky-400 transition-colors" />
              )}
              <span className={item.done ? 'text-slate-500 line-through' : 'text-slate-200'}>
                {item.task}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-xl flex flex-col justify-between">
        <div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">LEARNING STREAK</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-black text-sky-400">07</span>
            <span className="text-slate-500 font-bold uppercase text-xs tracking-tighter">Days🔥</span>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 mb-4 tracking-widest uppercase">State Practice</p>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-white">{count}</span>
            <button 
              onClick={() => setCount(count + 1)}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95"
            >
              Learn!
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
);

// Placeholder untuk fitur lainnya
const Placeholder = ({ title }) => (
  <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-3xl animate-in fade-in zoom-in duration-500">
    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
      <Settings className="text-slate-600 animate-spin" size={40} />
    </div>
    <h2 className="text-2xl font-bold text-slate-300 mb-2">{title}</h2>
    <p className="text-slate-500 max-w-md">
      This feature is coming soon in the next development phase. We're building something awesome for your English learning!
    </p>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [count, setCount] = useState(0);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard count={count} setCount={setCount} />;
      case 'vocab':
        return <Placeholder title="Vocab Vault" />;
      case 'journal':
        return <Placeholder title="Self-Talk Journal" />;
      case 'progress':
        return <Placeholder title="Progress Tracking" />;
      default:
        return <Dashboard count={count} setCount={setCount} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}

export default App
