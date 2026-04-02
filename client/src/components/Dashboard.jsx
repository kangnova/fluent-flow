import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Flame } from 'lucide-react';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalVocab: 0, currentStreak: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const tasks = [
    { id: 'Reading', label: 'Read 1 Technical Documentation' },
    { id: 'Self-Talk', label: '10 Minutes Self-Talk Session' },
    { id: 'Vocab-Update', label: 'Update Vocab Vault' },
  ];

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [logsRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/practice/today'),
        fetch('http://localhost:5000/api/stats')
      ]);
      
      const logsData = await logsRes.json();
      const statsData = await statsRes.json();
      
      setLogs(logsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const toggleTask = async (activityType) => {
    const isDone = logs.some(log => log.activity_type === activityType);
    if (isDone) return;

    try {
      const response = await fetch('http://localhost:5000/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_type: activityType,
          duration_minutes: activityType === 'Self-Talk' ? 10 : 0,
          content: `Completed ${activityType} session`
        }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error logging practice:', err);
    }
  };

  const completedCount = tasks.filter(t => logs.some(l => l.activity_type === t.id)).length;

  return (
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
            <h3 className="text-xl font-semibold text-white">Today's Daily Quest</h3>
            <span className="text-xs bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full border border-sky-400/20">
              {completedCount}/{tasks.length} Completed
            </span>
          </div>
          
          <div className="space-y-4">
            {tasks.map((task) => {
              const isDone = logs.some(log => log.activity_type === task.id);
              return (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer group ${
                    isDone 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-slate-900/50 border-slate-700/30 hover:border-sky-500/30'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 size={24} className="text-emerald-400 fill-emerald-400/10" />
                  ) : (
                    <Circle size={24} className="text-slate-600 group-hover:text-sky-400 transition-colors" />
                  )}
                  <span className={isDone ? 'text-slate-500 line-through' : 'text-slate-200'}>
                    {task.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-widest">Learning Streak</h3>
              <Flame size={20} className="text-orange-500 animate-pulse" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-6xl font-black text-sky-400 font-mono">
                {stats.currentStreak.toString().padStart(2, '0')}
              </span>
              <span className="text-slate-500 font-bold uppercase text-xs tracking-tighter">Days Progress</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 mb-4 tracking-widest uppercase">Consistency is Key</p>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700/50 text-center">
              <p className="text-sm text-slate-300">
                You've mastered <span className="text-sky-400 font-bold">{stats.totalVocab}</span> words so far. Keep flowing!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
