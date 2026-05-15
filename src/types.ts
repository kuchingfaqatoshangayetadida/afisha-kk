export type CategorySlug = 'theater' | 'cinema' | 'concert' | 'festival' | 'exhibition';

export interface LocalizedString {
  kaa: string;
  uz: string;
  ru: string;
  en: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: CategorySlug;
  date: string;
  time: string;
  location: string;
  price: string;
  bannerImage: string;
  isTopEvent?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  label: LocalizedString;
  slug: CategorySlug;
  icon: string;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  date: string;
  time: string;
  price: string;
  row: number;
  seat: number;
  createdAt: any;
}

export interface AppUser {
  uid: string;
  name: string | null;
  displayName?: string | null;
  email: string | null;
  role: 'user' | 'admin';
  favoriteEvents: string[];
  bookings?: Booking[];
  createdAt: any;
}
