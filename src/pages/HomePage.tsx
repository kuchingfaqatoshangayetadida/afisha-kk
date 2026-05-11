import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Event, Category } from '../types';
import Hero from '../components/home/Hero';
import EventCard from '../components/events/EventCard';
import { Theater, Clapperboard, Music, Flag, Image as ImageIcon, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { KarakalpakPattern } from '../components/ui/Pattern';
import { STATIC_EVENTS } from '../lib/data';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setUpcomingEvents(STATIC_EVENTS);
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = [
    { name: 'theater', icon: Theater, color: 'bg-red-500/20 text-red-500 border-red-500/50', activeColor: 'bg-red-500 text-white' },
    { name: 'cinema', icon: Clapperboard, color: 'bg-amber-500/20 text-amber-500 border-amber-500/50', activeColor: 'bg-amber-500 text-white' },
    { name: 'concert', icon: Music, color: 'bg-blue-500/20 text-blue-500 border-blue-500/50', activeColor: 'bg-blue-500 text-white' },
    { name: 'festival', icon: Flag, color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50', activeColor: 'bg-emerald-500 text-white' },
    { name: 'exhibition', icon: ImageIcon, color: 'bg-purple-500/20 text-purple-500 border-purple-500/50', activeColor: 'bg-purple-500 text-white' },
  ];

  const filteredEvents = upcomingEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative pb-24">
      <Hero />
      
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-40">
        {/* Integrated Search */}
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 w-6 h-6 group-focus-within:text-brand-amber transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İlaj atı yamasa o'rin boyınsha izleń..."
              className="w-full bg-neutral-900/90 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-lg focus:outline-none focus:border-brand-gold/50 backdrop-blur-2xl transition-all shadow-2xl placeholder:text-neutral-600 text-white"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
              <button className="bg-brand-red text-white px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-24">
        {/* Categories */}
        <section className="mb-24">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                className={`flex flex-col items-center justify-center p-8 rounded-3xl border transition-all hover:scale-105 active:scale-95 group w-40 h-40 backdrop-blur-xl ${
                  selectedCategory === cat.name ? cat.activeColor + ' border-transparent scale-105' : cat.color
                }`}
              >
                <cat.icon className={`w-10 h-10 mb-4 transition-transform group-hover:rotate-12 ${selectedCategory === cat.name ? 'text-white' : ''}`} />
                <span className="text-sm font-bold uppercase tracking-widest">{t(cat.name)}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="relative">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">
                {selectedCategory ? `${t(selectedCategory)} events` : t('upcoming_events')}
              </h2>
              <div className="h-1 w-20 bg-brand-red rounded-full" />
            </div>
            {selectedCategory && (
              <button onClick={() => setSelectedCategory(null)} className="text-brand-amber font-bold text-sm uppercase tracking-widest hover:underline">
                Clear Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-900 rounded-2xl animate-pulse" />
              ))
             ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))
            ) : (
                <div className="col-span-full py-24 text-center text-neutral-500 italic">
                  Hiç qanday maǵlıwmat tabılmadı.
                </div>
            )}
          </div>
        </section>
      </div>

      <KarakalpakPattern className="absolute top-0 left-0 w-full h-full -z-10" />
    </div>
  );
};

export default HomePage;
