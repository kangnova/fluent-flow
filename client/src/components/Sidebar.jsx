import { LayoutDashboard, BookOpen, PenTool, BarChart3, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vocab', label: 'Vocab Vault', icon: BookOpen },
    { id: 'journal', label: 'Self-Talk Journal', icon: PenTool },
    { id: 'progress', label: 'Progress Tracking', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-800 h-screen fixed left-0 top-0 border-r border-slate-700 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-sky-400">FluentFlow</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Self-Taught English</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
              ? 'bg-sky-500/10 text-sky-400 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.2)]' 
              : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:bg-slate-700 hover:text-slate-200 rounded-xl transition-all">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
