import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Mail, Phone, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-neutral-950 border-t border-white/5 py-12 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-red flex items-center justify-center rounded-lg">
              <span className="text-sm font-bold">AK</span>
            </div>
            <span className="text-xl font-bold tracking-tighter">AFISHA-KK</span>
          </div>
          <p className="text-neutral-400 max-w-md text-sm leading-relaxed">
            {t('discover')}
          </p>
          <div className="flex gap-4 mt-8">
            <a href="#" className="p-2 bg-neutral-900 rounded-full hover:bg-brand-red transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-neutral-900 rounded-full hover:bg-brand-red transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="p-2 bg-neutral-900 rounded-full hover:bg-brand-red transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t('categories')}</h4>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li><a href="/categories/theater" className="hover:text-brand-amber transition-colors">{t('theater')}</a></li>
            <li><a href="/categories/cinema" className="hover:text-brand-amber transition-colors">{t('cinema')}</a></li>
            <li><a href="/categories/concert" className="hover:text-brand-amber transition-colors">{t('concert')}</a></li>
            <li><a href="/categories/festival" className="hover:text-brand-amber transition-colors">{t('festival')}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">{t('contact')}</h4>
          <ul className="space-y-4 text-sm text-neutral-400">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-gold" />
              <span>afisha-kk.uz</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>+998 93 736 78 96</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-neutral-600 uppercase tracking-widest font-bold">
        <p>© 2026 AFISHA-KK. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
