import { useState } from 'react'
import Layout from './components/Layout'
import VocabVault from './components/VocabVault'
import Dashboard from './components/Dashboard'
import Journal from './components/Journal'
import { Settings } from 'lucide-react'

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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'vocab':
        return <VocabVault />;
      case 'journal':
        return <Journal />;
      case 'progress':
        return <Placeholder title="Progress Tracking" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}

export default App;
