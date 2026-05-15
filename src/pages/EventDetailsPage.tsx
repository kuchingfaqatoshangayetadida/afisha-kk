import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Event } from '../types';
import { motion } from 'motion/react';
import { Calendar, MapPin, Ticket, Clock, ArrowLeft, Share2, Heart, X, CreditCard, CheckCircle2 } from 'lucide-react';
import { KarakalpakPattern } from '../components/ui/Pattern';
import { cn } from '../lib/utils';
import { STATIC_EVENTS } from '../lib/data';
import { useAuth } from '../contexts/AuthContext';

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const [showPayment, setShowPayment] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [mockCard, setMockCard] = useState('');
  const [ticketDetails, setTicketDetails] = useState<any>(null);

  const isFavorite = user?.favoriteEvents?.includes(eventId || '') || false;

  const toggleFavorite = async () => {
    if (!user || !eventId) return;
    const currentFavs = user.favoriteEvents || [];
    const newFavs = isFavorite 
      ? currentFavs.filter(id => id !== eventId)
      : [...currentFavs, eventId];
    await updateUser({ favoriteEvents: newFavs });
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !event) return;
    
    // Generate Random Row and Seat
    const row = Math.floor(Math.random() * 20) + 1;
    const seat = Math.floor(Math.random() * 30) + 1;
    const ticketId = Math.random().toString(36).substr(2, 9).toUpperCase();

    const newBooking = {
      id: ticketId,
      eventId: event.id,
      eventTitle: event.title,
      date: event.date,
      time: event.time,
      price: event.price,
      row,
      seat,
      createdAt: new Date().toISOString()
    };

    const currentBookings = user.bookings || [];
    await updateUser({ bookings: [...currentBookings, newBooking] });

    setTicketDetails(newBooking);
    setShowPayment(false);
    setShowTicket(true);
  };

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
                    <button 
                      onClick={toggleFavorite}
                      className={cn(
                        "p-3 rounded-full transition-colors",
                        isFavorite ? "bg-brand-red/20 text-brand-red" : "bg-white/5 hover:bg-white/10"
                      )}
                    >
                       <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                    </button>
                    <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                       <Share2 className="w-5 h-5" />
                    </button>
                 </div>
              </div>

              <button 
                onClick={() => user ? setShowPayment(true) : alert('Iltimas, birinshi akkauntqa kiriń!')}
                className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-5 rounded-2xl mb-4 transition-all shadow-[0_10px_30px_rgba(139,0,0,0.3)] hover:translate-y-[-2px] active:translate-y-[1px]"
              >
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

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative"
          >
            <button onClick={() => setShowPayment(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-2">Tólew</h3>
            <p className="text-neutral-400 mb-6 text-sm">Bilet satıp alıw ushın qálegen karta maǵlıwmatın kirgiziń (Test rejim)</p>
            
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Karta nomeri</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input 
                    type="text" 
                    required
                    placeholder="0000 0000 0000 0000" 
                    value={mockCard}
                    onChange={(e) => setMockCard(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/10 p-4 pl-12 rounded-xl text-white outline-none focus:border-brand-amber transition-colors" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Múddeti</label>
                  <input type="text" required placeholder="MM/YY" className="w-full bg-neutral-950 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-brand-amber transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">CVV</label>
                  <input type="text" required placeholder="123" className="w-full bg-neutral-950 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-brand-amber transition-colors" />
                </div>
              </div>
              <button type="submit" className="w-full bg-brand-amber text-black font-bold py-4 rounded-xl mt-4 hover:bg-yellow-400 transition-colors">
                Tólewdi tastıyıqlaw ({event.price})
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicket && ticketDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#fafafa] rounded-3xl p-8 max-w-sm w-full relative my-8 text-neutral-900 border-x-8 border-brand-red overflow-hidden"
            style={{ backgroundImage: 'radial-gradient(circle at top right, #fff 0%, #f0f0f0 100%)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-4 bg-brand-red" />
            <button onClick={() => setShowTicket(false)} className="absolute top-6 right-6 text-neutral-500 hover:text-black bg-black/5 rounded-full p-2">
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mt-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold font-display uppercase tracking-wider text-black">Elektron Bilet</h3>
              <p className="text-sm font-bold text-neutral-500 mt-1">ID: {ticketDetails.id}</p>
            </div>
            
            <div className="border-t-2 border-dashed border-neutral-300 my-6" />

            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Ilaj</p>
                <p className="font-bold text-lg leading-tight text-black">{ticketDetails.eventTitle}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Sáne</p>
                  <p className="font-bold text-black">{ticketDetails.date}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Waqıt</p>
                  <p className="font-bold text-black">{ticketDetails.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-100 p-4 rounded-2xl border border-neutral-200">
                <div className="text-center border-r border-neutral-300">
                  <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Qatar</p>
                  <p className="font-bold text-2xl text-brand-red">{ticketDetails.row}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Orın</p>
                  <p className="font-bold text-2xl text-brand-red">{ticketDetails.seat}</p>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-neutral-300 my-6 relative">
              <div className="absolute -left-10 -top-4 w-8 h-8 bg-black/80 rounded-full" />
              <div className="absolute -right-10 -top-4 w-8 h-8 bg-black/80 rounded-full" />
            </div>

            <div className="text-center">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketDetails.id}`} alt="QR Code" className="mx-auto w-32 h-32 opacity-80 mix-blend-multiply" />
              <p className="text-[10px] text-neutral-500 mt-4 font-bold uppercase">Esikte usı QR kodtı kórsetiń</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
