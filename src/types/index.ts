export interface Work {
  id: string;
  title: string;
  client?: string;
  type: string;
  name: string;
  concept?: string;
  target?: string;
  challenge?: string;
  purpose?: string;
  informationDesign?: string;
  design?: string;
  planningDays?: number;
  designDays?: number;
  codingDays?: number;
  mainImage?: string;
  designImage?: string;
  link?: string;
  displayOrder: number;
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

export type Theme = "modern" | "retro";
export type Language = "ja" | "en";
