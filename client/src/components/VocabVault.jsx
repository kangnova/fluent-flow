import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, X, AlertCircle } from 'lucide-react';

const VocabVault = () => {
  // State Utama
  const [vocabList, setVocabList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vocabToDelete, setVocabToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    word: '',
    definition: '',
    example: '', // mapping to example_sentence in DB
    tags: '',
    source: '' // mapping to source_url in DB
  });

  // 1. Fetch Data dari Backend
  const fetchVocab = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/vocab');
      const data = await response.json();
      setVocabList(data);
    } catch (err) {
      console.error('Error fetching vocab:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVocab();
  }, []);

  // Handle Form Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ word: '', definition: '', example: '', tags: '', source: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (vocab) => {
    setIsEditing(true);
    setEditId(vocab.id);
    setFormData({
      word: vocab.word,
      definition: vocab.definition,
      example: vocab.example_sentence,
      tags: vocab.tags,
      source: vocab.source_url || ''
    });
    setIsModalOpen(true);
  };

  // Add or Update Vocab (POST/PUT to API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `http://localhost:5000/api/vocab/${editId}` 
        : 'http://localhost:5000/api/vocab';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: formData.word,
          definition: formData.definition,
          example_sentence: formData.example,
          tags: formData.tags,
          source_url: formData.source
        }),
      });

      if (response.ok) {
        fetchVocab(); // Refresh list
        setFormData({ word: '', definition: '', example: '', tags: '', source: '' });
        setIsModalOpen(false);
        setIsEditing(false);
        setEditId(null);
      }
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} vocab:`, err);
    }
  };

  // Delete Logic (DELETE from API)
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/vocab/${vocabToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchVocab(); // Refresh list
        setIsDeleteModalOpen(false);
        setVocabToDelete(null);
      }
    } catch (err) {
      console.error('Error deleting vocab:', err);
    }
  };

  // Search Logic
  const filteredVocab = vocabList.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Vocab Vault
          </h2>
          <p className="text-slate-400 mt-2">Manage your technical English vocabulary.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Word</span>
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search by word or tags..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10 transition-all text-slate-200"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-800/20 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Word</th>
              <th className="px-6 py-4 font-semibold">Definition & Example</th>
              <th className="px-6 py-4 font-semibold">Tags</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredVocab.map((item) => (
              <tr key={item.id} className="hover:bg-slate-700/30 transition-colors group">
                <td className="px-6 py-6 align-top">
                  <span className="text-lg font-bold text-sky-400 block">{item.word}</span>
                  <span className="text-xs text-slate-500 mt-1 block">{item.source_url || 'No source'}</span>
                </td>
                <td className="px-6 py-6 align-top max-w-md">
                  <p className="text-slate-200 text-sm leading-relaxed mb-2">{item.definition}</p>
                  <p className="text-xs text-slate-500 italic border-l-2 border-slate-700 pl-3 py-1">
                    "{item.example_sentence}"
                  </p>
                </td>
                <td className="px-6 py-6 align-top">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="bg-slate-700/50 text-slate-400 text-[10px] px-2 py-1 rounded-md border border-slate-600/50">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-6 align-top text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => openEditModal(item)}
                      className="p-2 text-slate-500 hover:text-sky-400 hover:bg-sky-400/10 rounded-lg transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => confirmDelete(item)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                    <span>Loading your vocabulary...</span>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && filteredVocab.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center text-slate-500">
                  No vocabulary found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-slate-800 border border-slate-700 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold">{isEditing ? 'Edit Vocabulary' : 'Add New Vocabulary'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 ml-1">Word</label>
                <input required type="text" name="word" value={formData.word} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-slate-200" placeholder="e.g., Props" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 ml-1">Tags (comma separated)</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-slate-200" placeholder="e.g., React, UI" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 ml-1">Source (Optional)</label>
                  <input type="text" name="source" value={formData.source} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-slate-200" placeholder="e.g., Documentation" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 ml-1">Definition</label>
                <textarea required name="definition" value={formData.definition} onChange={handleChange} rows="3" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-slate-200 resize-none" placeholder="Explain the meaning..."></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1 ml-1">Example Sentence</label>
                <textarea name="example" value={formData.example} onChange={handleChange} rows="2" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 text-slate-200 resize-none" placeholder="Use it in a sentence..."></textarea>
              </div>
              <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                {isEditing ? 'Update Word' : 'Save to Vault'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-white">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Vocabulary?</h3>
              <p className="text-slate-400 mb-8">
                Are you sure you want to delete <span className="text-white font-semibold">"{vocabToDelete?.word}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-500/20"
                >
                  Delete Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabVault;
