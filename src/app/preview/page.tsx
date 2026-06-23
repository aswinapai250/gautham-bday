"use client";

import React, { useState, useEffect, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import LandingScreen from "@/components/LandingScreen";
import BouquetInteraction from "@/components/BouquetInteraction";
import LetterSection from "@/components/LetterSection";
import MemoryGallery from "@/components/MemoryGallery";
import VideoMemories from "@/components/VideoMemories";
import AudioMessages from "@/components/AudioMessages";
import Timeline from "@/components/Timeline";
import FinalSurprise from "@/components/FinalSurprise";
import MusicPlayer from "@/components/MusicPlayer";
import { BouquetProvider, DEFAULT_BOUQUET, BouquetData } from "@/context/BouquetContext";
import { loadLocalBouquet } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

function PreviewApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<BouquetData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      try {
        const saved = await loadLocalBouquet();
        if (saved) {
          setData(saved);
        } else {
          setData(DEFAULT_BOUQUET);
        }
      } catch (err) {
        console.error(err);
        setData(DEFAULT_BOUQUET);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center text-gray-500 font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-sm font-medium">Loading final experience preview...</p>
      </div>
    );
  }

  const bouquetData = data || DEFAULT_BOUQUET;

  return (
    <BouquetProvider data={bouquetData}>
      <main className={`w-full min-h-[100dvh] bg-background relative theme-${bouquetData.theme || "blush"}`}>
        {/* Floating Back to Builder Control bar */}
        <Link 
          href="/create" 
          className="fixed top-4 left-4 z-50 flex items-center gap-1.5 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg text-gray-700 active:text-pink-500 font-bold text-xs transition-colors cursor-pointer border border-pink-100 min-h-[44px] hover:text-pink-500"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Builder
        </Link>

        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="landing"
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-full min-h-[100dvh]"
            >
              <LandingScreen onOpen={() => setIsOpen(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-full"
            >
              <MusicPlayer autoPlay={true} />
              
              <section id="bouquet"><BouquetInteraction /></section>
              <section id="letter"><LetterSection /></section>
              <section id="gallery"><MemoryGallery /></section>
              <section id="videos"><VideoMemories /></section>
              <section id="audio"><AudioMessages /></section>
              <section id="timeline"><Timeline /></section>
              <section id="surprise"><FinalSurprise /></section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </BouquetProvider>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-background flex items-center justify-center">Loading...</div>}>
      <PreviewApp />
    </Suspense>
  );
}
