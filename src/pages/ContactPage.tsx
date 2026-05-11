import React from 'react';
import { useTranslation } from 'react-i18next';
import { KarakalpakPattern } from '../components/ui/Pattern';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[70vh] py-20 px-4">
      <KarakalpakPattern className="absolute inset-0 opacity-10" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 uppercase italic">{t('contact')}</h1>
          <div className="h-1 w-32 bg-brand-red mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="glass-card p-10 rounded-3xl">
              <h2 className="text-2xl font-bold mb-8 uppercase tracking-widest text-brand-gold text-sm underline underline-offset-8 decoration-2">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-brand-red/10 rounded-xl text-brand-red"><Mail className="w-6 h-6" /></div>
                   <div>
                     <p className="text-xs uppercase font-bold text-neutral-500 mb-1">Email Us</p>
                     <p className="text-lg font-medium">support@afisha-kk.uz</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-brand-amber/10 rounded-xl text-brand-amber"><Phone className="w-6 h-6" /></div>
                   <div>
                     <p className="text-xs uppercase font-bold text-neutral-500 mb-1">Call Center</p>
                     <p className="text-lg font-medium">+998 (61) 222-XX-XX</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-white/5 rounded-xl text-neutral-300"><MapPin className="w-6 h-6" /></div>
                   <div>
                     <p className="text-xs uppercase font-bold text-neutral-500 mb-1">Office</p>
                     <p className="text-lg font-medium">Nukus City, Berdaq Str. 45</p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <form className="glass-card p-10 rounded-3xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Your Name</label>
                <input className="w-full bg-black/40 border border-white/5 rounded-xl p-4 focus:outline-none focus:border-brand-amber transition-all" />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Email</label>
                <input className="w-full bg-black/40 border border-white/5 rounded-xl p-4 focus:outline-none focus:border-brand-amber transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Subject</label>
              <input className="w-full bg-black/40 border border-white/5 rounded-xl p-4 focus:outline-none focus:border-brand-amber transition-all" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Message</label>
              <textarea rows={4} className="w-full bg-black/40 border border-white/5 rounded-xl p-4 focus:outline-none focus:border-brand-amber transition-all" />
            </div>
            <button className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest transition-all">
               <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
