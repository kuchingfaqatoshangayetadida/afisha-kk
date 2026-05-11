import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Event } from '../types';
import { motion } from 'motion/react';
import { Calendar, MapPin, Ticket, Clock, ArrowLeft, Share2, Heart } from 'lucide-react';
import { KarakalpakPattern } from '../components/ui/Pattern';
import { cn } from '../lib/utils';
import { STATIC_EVENTS } from '../lib/data';

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { t } = useTranslation();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const docRef = doc(db, 'events', eventId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setEvent({ id: snapshot.id, ...snapshot.data() } as Event);
        } else {
          // Fallback to static events
          const staticEvent = STATIC_EVENTS.find(e => e.id === eventId);
          if (staticEvent) {
            setEvent(staticEvent);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        // Fallback to static events on error
        const staticEvent = STATIC_EVENTS.find(e => e.id === eventId);
        if (staticEvent) {
          setEvent(staticEvent);
        }
      }
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-brand-gold font-bold uppercase tracking-widest">Loading Cinema Atmosphere...</div>;
  if (!event) return <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h2 className="text-2xl font-bold">Event Not Found</h2>
    <Link to="/" className="text-brand-amber font-bold hover:underline uppercase text-sm">Return Home</Link>
  </div>;

  return (
    <div className="relative min-h-screen pb-24">
      {/* Banner */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={event.bannerImage} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        
        <div className="absolute bottom-12 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link to="/events" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm uppercase tracking-widest font-bold">
                <ArrowLeft className="w-4 h-4" /> {t('events')}
              </Link>
              <span className="block text-brand-amber font-display font-bold uppercase tracking-[0.3em] text-xs mb-4">
                {t(event.category)}
              </span>
              <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-4 leading-none max-w-4xl">
                {event.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        {/* Left Side: Info */}
        <div className="lg:col-span-8">
           <div className="glass-card p-10 rounded-3xl mb-8">
              <h3 className="text-xl font-bold mb-6 text-brand-gold uppercase tracking-widest text-sm underline underline-offset-8">Description</h3>
              <p className="text-neutral-300 leading-relaxed text-lg mb-10 whitespace-pre-wrap">
                {event.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                       <Calendar className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Date</p>
                       <p className="font-bold">{event.date}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                       <Clock className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Time</p>
                       <p className="font-bold">{event.time}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                       <MapPin className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Venue</p>
                       <p className="font-bold">{event.location}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Action Box */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
           <div className="bg-neutral-900 border border-brand-amber/20 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-amber/5 blur-3xl -z-10 transition-transform group-hover:scale-150 duration-700" />
              
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest mb-1">Ticket Price</p>
                    <h4 className="text-3xl font-bold text-brand-amber">{event.price === 'Free' ? t('free') : event.price}</h4>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                       <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                       <Share2 className="w-5 h-5" />
                    </button>
                 </div>
              </div>

              <button className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-5 rounded-2xl mb-4 transition-all shadow-[0_10px_30px_rgba(139,0,0,0.3)] hover:translate-y-[-2px] active:translate-y-[1px]">
                 {t('book_now')}
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-5 rounded-2xl transition-all border border-white/10">
                 {t('reserve')}
              </button>

              <p className="text-center mt-6 text-[10px] text-neutral-600 font-bold uppercase tracking-[0.2em]">
                 Terms & Conditions Apply
              </p>
           </div>
        </div>
      </div>

      <KarakalpakPattern className="absolute inset-0 opacity-10 pointer-events-none" />
    </div>
  );
};

export default EventDetailsPage;
