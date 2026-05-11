import React from 'react';
import { useTranslation } from 'react-i18next';
import { KarakalpakPattern } from '../components/ui/Pattern';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center py-20 px-4">
      <KarakalpakPattern className="absolute inset-0 opacity-10" />
      <div className="max-w-4xl relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 uppercase italic border-b border-brand-amber pb-4 inline-block">
          {t('about')}
        </h1>
        <div className="glass-card p-12 rounded-[40px] text-lg text-neutral-300 leading-relaxed text-left space-y-6">
          <p>
            <span className="text-brand-gold font-bold">AFISHA-KK</span> is the premier destination for cultural enlightenment in the Republic of Karakalpakstan. Our mission is to bridge the gap between traditional heritage and modern convenience, providing a unified platform for discovering theater, cinema, festivals, and art.
          </p>
          <p>
            Whether you're looking for a night at the <span className="text-brand-amber">Berdaq Theater</span>, a world-class exhibition at the <span className="text-brand-amber">Savitsky Museum</span>, or the latest hits at <span className="text-brand-amber">Kino Nukus</span>, we bring the cultural heartbeat of our region to your fingertips.
          </p>
          <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-8 text-center uppercase tracking-widest text-xs font-bold">
            <div>
              <p className="text-brand-gold mb-2">Established</p>
              <p className="text-white">2026</p>
            </div>
            <div>
              <p className="text-brand-gold mb-2">Location</p>
              <p className="text-white">Nukus, Karakalpakstan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
