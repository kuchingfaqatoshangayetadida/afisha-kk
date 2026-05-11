import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  kaa: {
    translation: {
      "home": "Bas bet",
      "events": "Ilajlar",
      "categories": "Kategoriyalar",
      "about": "Biz haqqımızda",
      "contact": "Baylanıs",
      "upcoming_events": "Kelesi ilajlar",
      "top_events": "Hápte ilajları",
      "theater": "Teatr",
      "cinema": "Kino",
      "concert": "Koncert",
      "festival": "Festival",
      "exhibition": "Kórme",
      "search_placeholder": "Ilaj atı, kategoriya yamasa orın boyınsha izlew...",
      "book_now": "Buyırtpa beriw",
      "reserve": "Rezerv",
      "free": "Biypul",
      "login": "Kirisiw",
      "signup": "Dizimnen ótiw",
      "discover": "Qaraqalpaqstandag'ı mádeniy ilajlar álemin ashıń",
      "today_events": "Búgingi ilajlar"
    }
  },
  uz: {
    translation: {
      "home": "Bosh sahifa",
      "events": "Tadbirlar",
      "categories": "Kategoriyalar",
      "about": "Biz haqimizda",
      "contact": "Aloqa",
      "upcoming_events": "Yaqindagi tadbirlar",
      "top_events": "Hafta tadbirlari",
      "theater": "Teatr",
      "cinema": "Kino",
      "concert": "Konsert",
      "festival": "Festival",
      "exhibition": "Ko'rgazma",
      "search_placeholder": "Tadbir nomi, kategoriya yoki joy bo'yicha qidirish...",
      "book_now": "Buyurtma berish",
      "reserve": "Rezerv",
      "free": "Bepul",
      "login": "Kirish",
      "signup": "Ro'yxatdan o'tish",
      "discover": "Qoraqalpog'istondagi madaniy tadbirlar olamini kashf eting",
      "today_events": "Bugungi tadbirlar"
    }
  },
  ru: {
    translation: {
      "home": "Главная",
      "events": "Мероприятия",
      "categories": "Категории",
      "about": "О нас",
      "contact": "Контакт",
      "upcoming_events": "Предстоящие события",
      "top_events": "Топ событий недели",
      "theater": "Театр",
      "cinema": "Кино",
      "concert": "Концерт",
      "festival": "Фестиваль",
      "exhibition": "Выставка",
      "search_placeholder": "Поиск по названию, категории или месту...",
      "book_now": "Забронировать",
      "reserve": "Резерв",
      "free": "Бесплатно",
      "login": "Войти",
      "signup": "Регистрация",
      "discover": "Откройте мир культурных событий в Каракалпакстане",
      "today_events": "События сегодня"
    }
  },
  en: {
    translation: {
      "home": "Home",
      "events": "Events",
      "categories": "Categories",
      "about": "About",
      "contact": "Contact",
      "upcoming_events": "Upcoming Events",
      "top_events": "Top Events of the Week",
      "theater": "Theater",
      "cinema": "Cinema",
      "concert": "Concert",
      "festival": "Festival",
      "exhibition": "Exhibition",
      "search_placeholder": "Search by event name, category, or location...",
      "book_now": "Book Now",
      "reserve": "Reserve",
      "free": "Free",
      "login": "Login",
      "signup": "Sign Up",
      "discover": "Discover the world of cultural events in Karakalpakstan",
      "today_events": "Today's Events"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'kaa',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
