import { useState, useEffect } from 'react';
import { Plus, BookOpen, Clock, Calendar, X, MessageSquare, Quote } from 'lucide-react';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    category: 'Daily Activity',
    duration: '10',
    content: ''
  });

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/practice/today'); // Actually we might need a "get all" for journal
      // For now, let's assume we want to see all historical journal entries
      const allResponse = await fetch('http://localhost:5000/api/practice/all'); 
      // Wait, I haven't created /api/practice/all yet. Let's fix backend first or just use today for now.
      // Better: I will add /api/practice/all to backend.
      const data = await allResponse.json();
      setEntries(data.filter(log => log.activity_type.startsWith('Self-Talk') || log.activity_type === 'Journal'));
    } catch (err) {
      console.error('Error fetching journal entries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // I will add the backend endpoint first in the next step, but I'll write the component logic now.
  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_type: `Self-Talk: ${formData.category}`,
          duration_minutes: parseInt(formData.duration),
          content: formData.content
        }),
      });

      if (response.ok) {
        // fetchEntries();
        setIsModalOpen(false);
        setFormData({ category: 'Daily Activity', duration: '10', content: '' });
      }
    } catch (err) {
      console.error('Error saving journal entry:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Self-Talk Journal
          </h2>
          <p className="text-slate-400 mt-2">Reflect on your daily speaking practice sessions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={20} />
          <span>New Session Log</span>
        </button>
      </header>

      {/* Entry List */}
      <div className="grid grid-cols-1 gap-6">
        {entries.length === 0 && !isLoading ? (
          <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-slate-700/50 border-dashed">
            <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500">No journal entries yet. Start your first self-talking session!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 hover:border-indigo-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200">{entry.activity_type.replace('Self-Talk: ', '')}</h3>
                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(entry.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center"><Clock size={12} className="mr-1" /> {entry.duration_minutes} mins</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Quote size={40} className="absolute -top-2 -left-2 text-slate-700/30 -z-10" />
                <p className="text-slate-300 leading-relaxed pl-4 italic">
                  {entry.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-slate-800 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Log Speaking Session</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 ml-1">Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-slate-200 appearance-none"
                  >
                    <option>Daily Activity</option>
                    <option>Technical Explanation</option>
                    <option>Mock Interview</option>
                    <option>Free Flow</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 ml-1">Duration (mins)</label>
                  <input 
                    type="number" 
                    name="duration" 
                    value={formData.duration} 
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 ml-1">What did you talk about?</label>
                <textarea 
                  required
                  name="content" 
                  value={formData.content} 
                  onChange={handleChange}
                  rows="5" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-slate-200 resize-none"
                  placeholder="Summarize your session here..."
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                Save Journal Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
