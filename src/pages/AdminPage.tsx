import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Event, CategorySlug } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Edit2, X, Check, Search, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError } from '../lib/utils';

const AdminPage: React.FC = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'theater' as CategorySlug,
    date: '',
    time: '',
    location: '',
    price: '',
    bannerImage: '',
    isTopEvent: false
  });

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
    } catch (err) {
      setError(handleFirestoreError(err, 'list', 'events'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchEvents();
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'events', editingId), { ...formData, updatedAt: new Date() });
      } else {
        await addDoc(collection(db, 'events'), { ...formData, createdAt: new Date(), updatedAt: new Date() });
      }
      setIsAdding(false);
      setEditingId(null);
      resetForm();
      fetchEvents();
    } catch (err) {
      setError(handleFirestoreError(err, editingId ? 'update' : 'create', 'events'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    setError(null);
    try {
      await deleteDoc(doc(db, 'events', id));
      fetchEvents();
    } catch (err) {
      setError(handleFirestoreError(err, 'delete', 'events'));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'theater',
      date: '',
      time: '',
      location: '',
      price: '',
      bannerImage: '',
      isTopEvent: false
    });
  };

  if (authLoading) return null;
  if (!isAdmin) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <h2 className="text-2xl font-bold text-red-500 uppercase tracking-widest">Access Denied</h2>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter uppercase">Event Manager</h1>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); resetForm(); }}
          className="bg-brand-amber text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-gold transition-colors"
        >
          <Plus className="w-5 h-5" /> NEW EVENT
        </button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 text-sm italic"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-8 rounded-3xl mb-12"
          >
            <div className="flex justify-between mb-8">
              <h2 className="text-xl font-bold uppercase tracking-widest">{editingId ? 'Edit Event' : 'Create Event'}</h2>
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-neutral-500 hover:text-white"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-amber" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Description</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-amber" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as CategorySlug})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-amber">
                  <option value="theater">Theater</option>
                  <option value="cinema">Cinema</option>
                  <option value="concert">Concert</option>
                  <option value="festival">Festival</option>
                  <option value="exhibition">Exhibition</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Banner Image URL</label>
                <input required value={formData.bannerImage} onChange={e => setFormData({...formData, bannerImage: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-amber" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-amber" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Time</label>
                <input required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-amber" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Location</label>
                <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-amber" />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Price</label>
                <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-brand-amber" />
              </div>
              <div className="flex items-center gap-4 pt-4">
                <input type="checkbox" id="top-event" checked={formData.isTopEvent} onChange={e => setFormData({...formData, isTopEvent: e.target.checked})} className="w-5 h-5 rounded accent-brand-amber" />
                <label htmlFor="top-event" className="text-sm font-bold">Featured Top Event</label>
              </div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-brand-red py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-red-700 transition-all">
                  {editingId ? 'Update Event' : 'Publish Event'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />)
        ) : (
          events.map(event => (
            <div key={event.id} className="glass-card flex items-center justify-between p-6 rounded-2xl group hover:border-brand-gold/30 transition-all">
              <div className="flex items-center gap-6">
                <img src={event.bannerImage} className="w-16 h-16 rounded-lg object-cover border border-white/10" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest">{event.category} • {event.date} at {event.time}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingId(event.id);
                    setFormData({
                      title: event.title,
                      description: event.description,
                      category: event.category,
                      date: event.date,
                      time: event.time,
                      location: event.location,
                      price: event.price,
                      bannerImage: event.bannerImage,
                      isTopEvent: !!event.isTopEvent
                    });
                    setIsAdding(false);
                    window.scrollTo(0, 0);
                  }}
                  className="p-3 bg-white/5 rounded-xl hover:bg-brand-amber hover:text-black transition-all"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(event.id)}
                  className="p-3 bg-white/5 rounded-xl hover:bg-red-500 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPage;
