export interface WorkImage {
  id: string;
  workId: string;
  imageUrl: string;
  publicId: string;
  fileName?: string;
  title?: string;
  description?: string;
  imageType: 'main' | 'variation' | 'icon' | 'illustration';
  category?: string;
  sortOrder: number;
  isVisible: boolean;
  rarity?: 'common' | 'rare' | 'epic';
  createdAt: Date;
  updatedAt: Date;
}

export interface Work {
  id: string;
  title: string;
  client?: string;
  type: string;
  status: 'completed' | 'in_progress' | 'planning';
  name?: string;
  concept?: string;
  target?: string;
  challenge?: string;
  purpose?: string;
  informationDesign?: string;
  design?: string;
  implementation?: string;
  planningDays?: number;
  designDays?: number;
  codingDays?: number;
  
  // 後方互換性
  mainImage?: string;
  designImage?: string;
  
  link?: string;
  displayOrder: number;
  
  // 新機能
  isGroup: boolean;
  itemCount?: number;
  images?: WorkImage[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HeroImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  publicId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Language = "ja" | "en";
