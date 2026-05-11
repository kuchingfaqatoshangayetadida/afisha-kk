import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, ChevronLeft, MapPin, Calendar } from 'lucide-react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Event } from '../../types';
import { cn } from '../../lib/utils';
import { STATIC_EVENTS } from '../../lib/data';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setFeaturedEvents(STATIC_EVENTS.slice(0, 4));
      } catch (error) {
        console.error("Error fetching featured events:", error);
      }
    };
    fetchFeatured();
  }, []);

  // Auto-play slider
  useEffect(() => {
    if (featuredEvents.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredEvents]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);

  const activeEvent = featuredEvents[currentIndex];

  return (
    <section className="relative h-[80vh] min-h-[500px] w-full bg-neutral-950 overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          {activeEvent && (
            <motion.div
              key={activeEvent.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <motion.img 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: "linear" }}
                src={activeEvent.bannerImage} 
                className="w-full h-full object-cover" 
                alt={activeEvent.title}
                referrerPolicy="no-referrer"
              />
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {activeEvent && (
            <motion.div
              key={`info-${activeEvent.id}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-brand-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm shadow-lg">
                  {t(activeEvent.category)}
                </span>
                <span className="text-white/60 text-xs font-semibold tracking-tighter flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-amber" /> {activeEvent.date}
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4 leading-tight">
                {activeEvent.title}
              </h2>

              <p className="text-neutral-300 text-sm md:text-base mb-8 max-w-lg line-clamp-2 leading-relaxed font-light">
                {activeEvent.description}
              </p>

              <div className="flex items-center gap-6 mb-8 text-white/50 text-xs">
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-brand-amber" />
                  <span>{activeEvent.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to={`/events/${activeEvent.id}`}
                  className="bg-brand-amber hover:bg-brand-gold text-black px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_-10px_rgba(255,191,0,0.3)] flex items-center gap-2 group"
                >
                  {t('book_now')} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                
                <div className="text-brand-amber font-mono font-bold text-lg px-4 border-l border-white/10">
                  {activeEvent.price}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Navigation */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={prevSlide} className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-brand-red hover:border-brand-red transition-all shadow-xl">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 flex flex-col gap-2">
        <button onClick={nextSlide} className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-brand-red hover:border-brand-red transition-all shadow-xl">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        {featuredEvents.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="group py-3 px-1"
          >
            <div 
              className={cn(
                "h-1.5 transition-all duration-700 rounded-full",
                currentIndex === i 
                  ? "w-10 bg-brand-amber shadow-[0_0_10px_rgba(255,191,0,0.5)]" 
                  : "w-2 bg-white/20 group-hover:bg-white/40"
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
