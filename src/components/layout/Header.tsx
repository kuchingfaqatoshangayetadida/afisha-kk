import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe, User, LogOut } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const languages = [
    { code: 'kaa', label: 'QQ' },
    { code: 'uz', label: 'UZ' },
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' }
  ];

  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : [])
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-red flex items-center justify-center rounded-lg group-hover:shadow-[0_0_15px_rgba(139,0,0,0.5)] transition-all">
            <span className="text-xl font-bold font-display">AK</span>
          </div>
          <span className="text-2xl font-bold tracking-tighter hover:text-brand-gold transition-colors">
            AFISHA-KK
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium tracking-wide uppercase transition-colors hover:text-brand-gold",
                location.pathname === item.path ? "text-brand-amber" : "text-neutral-400"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          {/* Language Selector */}
          <div className="group relative flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-full border border-white/5 cursor-pointer">
            <Globe className="w-4 h-4 text-brand-amber" />
            <span className="text-xs font-bold text-white uppercase">{i18n.language === 'kaa' ? 'QQ' : i18n.language}</span>
            
            <div className="absolute top-full right-0 mt-2 w-24 bg-neutral-900 border border-white/10 rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs font-bold transition-colors hover:bg-white/5",
                    i18n.language === lang.code ? "text-brand-amber" : "text-neutral-400 hover:text-white"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Auth */}
          {user ? (
            <div className="group relative flex items-center gap-2 cursor-pointer py-2">
              <div className="flex items-center gap-2 text-neutral-400 group-hover:text-brand-amber transition-colors">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{user.displayName || user.email?.split('@')[0]}</span>
              </div>
              
              <div className="absolute top-full right-0 mt-0 w-48 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl py-2">
                <Link to="/profile?tab=favorites" className="block px-4 py-2 text-sm font-bold text-neutral-300 hover:bg-white/5 hover:text-brand-amber transition-colors">
                  Yoqtirganlar
                </Link>
                <Link to="/profile?tab=history" className="block px-4 py-2 text-sm font-bold text-neutral-300 hover:bg-white/5 hover:text-brand-amber transition-colors">
                  Bronlar
                </Link>
                <Link to="/profile?tab=settings" className="block px-4 py-2 text-sm font-bold text-neutral-300 hover:bg-white/5 hover:text-brand-amber transition-colors">
                  Sazlamalar
                </Link>
                <div className="h-[1px] bg-white/10 my-1" />
                <button 
                  onClick={() => auth.signOut()}
                  className="w-full text-left px-4 py-2 text-sm font-bold text-neutral-500 hover:bg-red-500/10 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Chiqish
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-brand-red hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all"
            >
              {t('login')}
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-neutral-900 border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium"
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-[1px] bg-white/10" />
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "text-sm font-bold",
                        i18n.language === lang.code ? "text-brand-amber" : "text-neutral-500"
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                {!user && (
                   <Link 
                   to="/login"
                   onClick={() => setIsMenuOpen(false)}
                   className="bg-brand-red px-6 py-2 rounded-full text-sm font-bold"
                 >
                   {t('login')}
                 </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
