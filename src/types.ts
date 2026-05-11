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

export interface AppUser {
  uid: string;
  name: string | null;
  displayName?: string | null; // For transition
  email: string | null;
  role: 'user' | 'admin';
  favoriteEvents: string[];
  createdAt: any;
}
