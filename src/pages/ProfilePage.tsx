import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Clock, Settings, User as UserIcon, Calendar, MapPin, Search } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { STATIC_EVENTS } from '../lib/data';
import { Event } from '../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useTranslation } from 'react-i18next';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'favorites';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      setAllEvents(STATIC_EVENTS);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-amber border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const favoriteEvents = allEvents.filter(event => user.favoriteEvents?.includes(event.id));

  const removeFavorite = async (eventId: string) => {
    const newFavorites = user.favoriteEvents?.filter(id => id !== eventId) || [];
    await updateUser({ favoriteEvents: newFavorites });
  };

  const tabs = [
    { id: 'favorites', label: 'Yoqtirganlar', icon: Heart },
    { id: 'history', label: 'Bronlar', icon: Clock },
    { id: 'settings', label: 'Sazlamalar', icon: Settings },
  ];

  return (
    <div className="min-h-screen pb-24 pt-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-12 bg-neutral-900/50 p-8 rounded-3xl border border-white/5">
          <div className="w-24 h-24 bg-brand-red rounded-full flex items-center justify-center text-4xl font-bold uppercase">
            {(user.displayName || user.email || 'A')[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.displayName || 'Paydalanıwshı'}</h1>
            <p className="text-neutral-400">{user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm whitespace-nowrap transition-all
                  ${isActive ? 'bg-brand-amber text-black' : 'bg-neutral-900 text-white hover:bg-neutral-800 border border-white/5'}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-brand-amber'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'favorites' && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {favoriteEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteEvents.map(event => (
                      <div key={event.id} className="group relative bg-neutral-900 rounded-3xl overflow-hidden border border-white/5 hover:border-brand-amber/30 transition-colors">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={event.bannerImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-brand-amber font-bold text-xs uppercase tracking-widest">{t(event.category)}</span>
                            <button 
                              onClick={() => removeFavorite(event.id)}
                              className="p-2 rounded-full bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white transition-colors"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                          <h3 className="text-xl font-bold mb-4 line-clamp-1">{event.title}</h3>
                          <div className="flex flex-col gap-2 text-sm text-neutral-400 mb-6">
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {event.date} • {event.time}</span>
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.location}</span>
                          </div>
                          <Link to={`/events/${event.id}`} className="block text-center w-full bg-white/5 hover:bg-brand-amber hover:text-black py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors">
                            {t('book_now')}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-white/5">
                    <Heart className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Házirshe hesh nárse joq</h3>
                    <p className="text-neutral-500 mb-6">Sizge unqan ilajlar usı jerde kórinedi</p>
                    <Link to="/events" className="inline-block bg-brand-red px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
                      Ilajlardı kóriw
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {user.bookings && user.bookings.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {user.bookings.map((booking, i) => (
                      <div key={i} className="flex flex-col md:flex-row items-center justify-between bg-neutral-900 p-6 rounded-3xl border border-white/5 gap-6">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                          <div className="w-16 h-16 bg-brand-amber/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Clock className="w-8 h-8 text-brand-amber" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-1">{booking.eventTitle}</h4>
                            <p className="text-sm text-neutral-400">
                              {booking.date} • {booking.time}
                            </p>
                            <p className="text-xs text-brand-amber font-bold mt-2 uppercase tracking-widest">
                              Qatar: {booking.row} | Orın: {booking.seat}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right">
                            <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Tólew</p>
                            <p className="font-bold text-lg">{booking.price}</p>
                          </div>
                          <Link to={`/events/${booking.eventId}`} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm uppercase transition-colors">
                            Kóriw
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-white/5">
                    <Search className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Bronlar tabilmadi</h3>
                    <p className="text-neutral-500 mb-6">Siz ele hesh qanday bilet satip almadiniz.</p>
                    <Link to="/events" className="inline-block bg-brand-red px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
                      Afisha-KK
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="bg-neutral-900 p-8 rounded-3xl border border-white/5 max-w-2xl">
                  <h3 className="text-2xl font-bold mb-6">Sazlamalar</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Atıńız</label>
                      <input 
                        type="text" 
                        disabled 
                        value={user.displayName || ''} 
                        className="w-full bg-neutral-950 border border-white/10 p-4 rounded-xl text-white opacity-70 cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Email</label>
                      <input 
                        type="email" 
                        disabled 
                        value={user.email || ''} 
                        className="w-full bg-neutral-950 border border-white/10 p-4 rounded-xl text-white opacity-70 cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Role</label>
                      <input 
                        type="text" 
                        disabled 
                        value={user.role} 
                        className="w-full bg-neutral-950 border border-white/10 p-4 rounded-xl text-white opacity-70 cursor-not-allowed" 
                      />
                    </div>
                    <button className="bg-brand-red text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-red-700 transition-colors w-full">
                      Akkauntti O'shiriw
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
