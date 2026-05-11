import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Event, CategorySlug } from '../types';
import EventCard from '../components/events/EventCard';
import { KarakalpakPattern } from '../components/ui/Pattern';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const EventsPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Only order by date on server to avoid complex index requirements
        let q = query(collection(db, 'events'), orderBy('date', 'asc'));
        const snapshot = await getDocs(q);
        
        let eventData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        
        // Filter by category in memory
        if (categorySlug) {
          eventData = eventData.filter(e => e.category === categorySlug);
        }

        // Client side search
        if (searchTerm) {
          eventData = eventData.filter(e => 
            e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            e.location.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setEvents(eventData);
      } catch (err) {
        console.error("Firestore Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [categorySlug, searchTerm]);

  return (
    <div className="relative min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
             <span className="text-brand-amber font-bold uppercase tracking-[0.3em] text-xs mb-2 block">
                {categorySlug ? t(categorySlug) : t('events')}
             </span>
             <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4 uppercase">
                {categorySlug ? t(categorySlug) : t('upcoming_events')}
             </h1>
             <p className="text-neutral-500 font-medium">
                Browsing cultural highlights in Nukus and across Karakalpakstan.
             </p>
          </div>

          <div className="flex-1 max-w-md w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-gold/50 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5">
           <SlidersHorizontal className="w-5 h-5 text-brand-gold" />
           <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">Filter By Date:</span>
           <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-full bg-brand-amber text-black text-[10px] font-bold">ALL</button>
              <button className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] font-bold">THIS WEEK</button>
              <button className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[10px] font-bold">NEXT MONTH</button>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-900 rounded-2xl animate-pulse" />
              ))
           ) : events.length > 0 ? (
             events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
             ))
           ) : (
             <div className="col-span-full py-32 text-center">
                <p className="text-neutral-600 italic mb-4">No events found matching your criteria.</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-brand-amber font-bold uppercase text-xs hover:underline"
                >
                  Clear search
                </button>
             </div>
           )}
        </div>
      </div>

      <KarakalpakPattern className="absolute inset-0 opacity-5 pointer-events-none" />
    </div>
  );
};

export default EventsPage;
