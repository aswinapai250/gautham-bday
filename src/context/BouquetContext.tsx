"use client";

import React, { createContext, useContext } from "react";

export interface FlowerData {
  id: string;
  type?: "message" | "photo" | "quote"; // kept for backwards compatibility
  content?: string; // kept for backwards compatibility
  title: string;
  message: string;
  image?: string; // Base64 or Object URL
  video?: string; // Base64 or Object URL
  x: number; // percentage width on canvas (0 to 100)
  y: number; // percentage height on canvas (0 to 100)
  color: string; // Tailind background color class or hex
  emoji?: string; // custom emoji
}

export interface PhotoData {
  id: number;
  url: string;
  caption: string;
}

export interface VideoData {
  id: number;
  title: string;
  duration?: string;
  thumbnail: string;
  url?: string;
}

export interface MilestoneData {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

export interface AudioData {
  id: number;
  title: string;
  url: string;
}

export interface BouquetData {
  recipientName: string;
  bouquetImage: string;
  musicId: string;
  letterText: string;
  flowers: FlowerData[];
  photos: PhotoData[];
  videos: VideoData[];
  timeline: MilestoneData[];
  audioClips: AudioData[];
  theme?: string; // theme id: "blush" | "lavender" | "midnight" | "ocean" | "vintage"
}

export const DEFAULT_BOUQUET: BouquetData = {
  recipientName: "My Love",
  bouquetImage: "https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=600&auto=format&fit=crop",
  musicId: "uo33QyBaZ4w",
  theme: "blush",
  letterText: "My dearest,\n\nI wanted to create something special for you. This bouquet holds memories, inside jokes, and little notes to remind you how much you mean to me.\n\nTake your time exploring. I hope it makes you smile.\n\nWith all my love,\n[Your Name]",
  flowers: [
    { id: "1", title: "A Promise", message: "I will always stand by you, no matter what journey life takes us on. You are my constant source of strength.", x: 30, y: 35, color: "bg-rose-300" },
    { id: "2", title: "Favorite Quote", message: "\"Grow old along with me! The best is yet to be.\" - Robert Browning", x: 65, y: 25, color: "bg-purple-300" },
    { id: "3", title: "First Sight", message: "The moment I saw you, my heart whispered: 'That's the one.' It was the best day of my life.", image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop", x: 48, y: 48, color: "bg-amber-300" },
    { id: "4", title: "My Happy Place", message: "Just being next to you makes the rest of the world vanish. Thank you for being my home.", x: 75, y: 55, color: "bg-blue-300" },
    { id: "5", title: "Laughter", message: "No one makes me laugh quite like you do. Here's to a lifetime of shared giggles and jokes.", x: 22, y: 65, color: "bg-pink-300" },
  ],
  photos: [
    { id: 1, url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop", caption: "Our first trip together ✈️" },
    { id: 2, url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop", caption: "That time we laughed until we cried 😂" },
    { id: 3, url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600&auto=format&fit=crop", caption: "Coffee dates are the best dates ☕" },
    { id: 4, url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop", caption: "Forever my favorite person ❤️" },
  ],
  videos: [
    { id: 1, title: "Our Anniversary Trip", duration: "0:45", thumbnail: "https://images.unsplash.com/photo-1530103862676-de889fa09f43?q=80&w=400&auto=format&fit=crop" },
    { id: 2, title: "Walk in the Park", duration: "1:20", thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop" },
  ],
  timeline: [
    { id: 1, date: "May 2023", title: "The First Hello", description: "When we first started talking. I knew there was something special.", image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=300&auto=format&fit=crop" },
    { id: 2, date: "August 2023", title: "First Date", description: "Nervous laughter and endless conversation over coffee.", image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=300&auto=format&fit=crop" },
    { id: 3, date: "December 2023", title: "First Holidays Together", description: "Cozy nights, hot chocolate, and my favorite winter memory.", image: "https://images.unsplash.com/photo-1512474932049-782f6b38f1ba?q=80&w=300&auto=format&fit=crop" },
  ],
  audioClips: [],
};

const BouquetContext = createContext<BouquetData | undefined>(undefined);

export function BouquetProvider({ data, children }: { data: BouquetData; children: React.ReactNode }) {
  return (
    <BouquetContext.Provider value={data}>
      {children}
    </BouquetContext.Provider>
  );
}

export function useBouquet() {
  const context = useContext(BouquetContext);
  if (context === undefined) {
    throw new Error("useBouquet must be used within a BouquetProvider");
  }
  return context;
}
