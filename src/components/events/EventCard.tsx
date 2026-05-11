import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Event } from '../../types';
import { cn } from '../../lib/utils';

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
    >
      <Link 
        to={`/events/${event.id}`}
        className="block group relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-900 border border-white/5 cinematic-glow"
      >
        <img 
          src={event.bannerImage} 
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent group-hover:from-neutral-950/90 transition-colors" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded bg-neutral-100 text-neutral-950",
              event.category === 'theater' && "bg-brand-red text-white",
              event.category === 'cinema' && "bg-brand-amber text-black"
            )}>
              {t(event.category)}
            </span>
            {event.isTopEvent && (
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded bg-brand-gold text-neutral-950">
                TOP
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-brand-gold transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2 text-neutral-400 text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-brand-gold" />
              <span>{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-brand-amber font-bold">{event.price === 'Free' ? t('free') : event.price}</span>
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Link>
    </motion.div>
  );
};

export default EventCard;
