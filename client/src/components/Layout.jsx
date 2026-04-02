import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex bg-slate-900 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-10 min-h-screen text-slate-100 transition-all">
        {children}
      </main>
    </div>
  );
};

export default Layout;
