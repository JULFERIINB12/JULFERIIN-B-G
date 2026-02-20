
export type BranchId = 0 | 1 | 2 | 3 | 4;

export interface Branch {
  id: BranchId;
  name: string;
  areas: string[];
}

export interface Posto {
  id: string;
  number: string;
  location: string;
  fullName: string;
  profilePic: string;
  latitude?: number;
  longitude?: number;
  status?: 'Moving' | 'Stopped' | 'Offline';
  speed?: number;
  history?: { lat: number, lng: number }[];
  destination?: string;
  plannedRoute?: { lat: number, lng: number }[];
  socialLinks?: {
    facebook?: string;
    tiktok?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

export interface Geofence {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  color: string;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  status: 'Pendente' | 'Concluído' | 'Em Curso';
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  timestamp: number;
}

export interface Report {
  id: string;
  postoCode: string;
  area: string;
  type: 'Diário' | 'Semanal' | 'Mensal' | 'Anual';
  text: string;
  date: string;
  time: string;
  month: string;
  year: string;
  media: MediaItem[];
  timestamp: number;
}
