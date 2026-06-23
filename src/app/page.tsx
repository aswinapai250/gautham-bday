"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Image, Film, Mic, Play, Pause, Heart, Mail, Sparkles, X,
  Camera, MessageCircle, Music,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";

/* ================================================================== */
/*  DATA                                                               */
/* ================================================================== */

interface FlowerItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  color: string;
  title: string;
  message?: string;
  image?: string;
}

const FLOWERS: FlowerItem[] = [
  { 
    id: 1, 
    emoji: "🌸", 
    x: 28, 
    y: 28, 
    color: "bg-rose-300",   
    title: "A photo of you I find cute ",       
    image: "/WhatsApp%20Image%202026-06-23%20at%206.24.29%20PM.jpeg"
  },
  { 
    id: 2, 
    emoji: "🌹", 
    x: 68, 
    y: 20, 
    color: "bg-purple-300", 
    title: "A photo of you I find sexy",   
 
    image: "/WhatsApp Image 2026-06-23 at 6.22.50 PM.jpeg"
  },
  { 
    id: 3, 
    emoji: "🌷", 
    x: 48, 
    y: 44, 
    color: "bg-amber-300",  
    title: "A photo of you I find pretty",      

    image: "/WhatsApp Image 2026-06-23 at 6.23.29 PM.jpeg"
  },
  { 
    id: 4, 
    emoji: "🌻", 
    x: 78, 
    y: 52, 
    color: "bg-blue-300",   
    title: "A photo of you I find funny",   
    image: "/WhatsApp%20Image%202026-06-23%20at%205.58.45%20PM.jpeg"
  },
  { 
    id: 5, 
    emoji: "🌺", 
    x: 20, 
    y: 62, 
    color: "bg-pink-300",   
    title: "My fav photo of you",         
    image: "/WhatsApp%20Image%202026-06-23%20at%205.54.34%20PM.jpeg"
  },
];

const LETTER_TEXT = `HAPPY BIRTHDAY BABYYYY

i hope ur having a pretty start on ur day ( i hope im ur first wish☹️🤘🏻)
 
ik sometimes i don't make u feel like i appreciate the things u to do me BUT U HAVE NO IDEA HOW MUCH ALL THAT MEANS TO ME😞😞😞😞😞. u are the best bf in the whole world .

You're the first person i come to whenever the world gets mean to me.☹️☹️

and even tho we argue quite a lot these days i js want u to know that im not gonna leave u unless u cheat on me ( don't u ever do that bitch u don't belong to no other bitch🤨🤨)

i love u the most in the whole world and i really really wish i could be w u for the rest of my life.

UMMA BABY NINK NJN MATHRE ILU 😘😘 (alle☹️)`;

/* ================================================================== */
/*  DATA DEFINITIONS & PLACEHOLDER COMPONENTS                         */
/* ================================================================== */

const PHOTOS = [
  { url: "/photo1.jpeg", caption: "Our first maryathak illa photo 😛" },
  { url: "/photo2.jpeg", caption: "My fav photo of us 🥹" },
  { url: "/photo3jpeg.jpeg", caption: "The first time we drank tg🙂‍↔️" },
  { url: "/photo4.jpeg", caption: "Forever my favorite person ❤️" },
];

function ImagePlaceholder({ label = "Image", className = "", onClick }: { label?: string; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 select-none transition-all duration-200 ${onClick ? "cursor-pointer hover:border-pink-400 hover:bg-pink-50/30 hover:text-pink-400 hover:scale-[1.03] active:scale-[0.98]" : ""} ${className}`}
    >
      <Image className="w-8 h-8" />
      <span className="text-xs font-semibold tracking-wide uppercase">{label}</span>
    </div>
  );
}

function VideoPlaceholder({ label = "Video Message", onClick }: { label?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="relative w-full max-w-xs aspect-[9/16] bg-gray-900 rounded-3xl flex flex-col items-center justify-center gap-2 select-none cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group mx-auto overflow-hidden shadow-2xl border-4 border-white"
    >
      <video
        src="/WhatsApp%20Video%202026-06-23%20at%204.32.17%20PM.mp4"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-500"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="relative z-10 w-16 h-16 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 flex items-center justify-center group-hover:bg-white/45 group-hover:scale-110 transition-all duration-300">
        <Play className="w-6 h-6 text-white ml-1 fill-white" />
      </div>
      <span className="relative z-10 text-xs font-semibold tracking-wider uppercase text-white/90 group-hover:text-white">{label}</span>
      <div className="relative z-10 mt-1 px-3 py-1 bg-black/40 backdrop-blur-sm rounded-full text-[10px] text-white/80 font-medium tracking-wide">
        Video Preview
      </div>
    </div>
  );
}

function AudioPlaceholder({ label = "Voice Note", isPlaying = false, progress = 0, onToggle }: { label?: string; isPlaying?: boolean; progress?: number; onToggle?: () => void }) {
  const barHeights = [4, 8, 14, 20, 16, 10, 6, 12, 18, 14, 8, 4, 6, 10, 14, 8, 4, 6, 10, 8];
  return (
    <div className="flex items-center gap-4 bg-white p-5 rounded-3xl shadow-md border border-gray-200 w-full select-none">
      <button
        onClick={onToggle}
        className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 flex-shrink-0 cursor-pointer hover:bg-pink-200 active:scale-95 transition-all"
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-pink-500" /> : <Play className="w-5 h-5 fill-pink-500 ml-0.5" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-serif font-semibold text-gray-800 mb-2">{label}</p>
        <div className="flex items-center gap-[3px] h-6">
          {barHeights.map((h, i) => {
            const barFraction = i / barHeights.length;
            const isActive = progress >= barFraction;
            return (
              <div
                key={i}
                className="flex-1 rounded-full transition-all duration-150"
                style={{ height: `${h}px`, backgroundColor: isActive ? "#EC4899" : "#E2E8F0" }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MODAL COMPONENTS                                                   */
/* ================================================================== */

function FlowerModal({ flower, onClose }: { flower: typeof FLOWERS[0] | null; onClose: () => void }) {
  if (!flower) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.25 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-pink-200/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/85 backdrop-blur-sm rounded-full hover:bg-gray-100 cursor-pointer transition-colors z-10 shadow-sm border border-gray-100">
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex flex-col items-center pt-2">
          <span className="text-5xl mb-3 animate-bounce" style={{ animationDuration: '3s' }}>{flower.emoji}</span>
          <h3 className="font-serif text-2xl font-bold text-gray-800 text-center mb-1">{flower.title}</h3>
        </div>

        {flower.image && (
          <div className="my-4 overflow-hidden rounded-2xl border border-pink-100/50 bg-gray-50/50 flex items-center justify-center relative group max-h-[320px] shadow-sm">
            <img 
              src={flower.image} 
              alt={flower.title} 
              className="max-h-[320px] w-full object-contain group-hover:scale-[1.02] transition-transform duration-500 ease-out" 
            />
          </div>
        )}

        {flower.message && (
          <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100/80">
            <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{flower.message}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function PhotoLightbox({ index, onClose }: { index: number | null; onClose: () => void }) {
  if (index === null) return null;
  const photo = PHOTOS[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white cursor-pointer z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
        <X className="w-6 h-6" />
      </button>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg aspect-[4/5] bg-gray-900 rounded-3xl overflow-hidden flex flex-col items-center justify-between p-4 border border-white/10 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={photo.url} 
          alt={photo.caption} 
          className="absolute inset-0 w-full h-full object-contain" 
        />
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12 text-center">
          <p className="text-white text-base font-serif italic mb-1">"{photo.caption}"</p>
          <p className="text-white/60 text-xs tracking-wider uppercase">Photo {index + 1} of 4</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VideoLightbox({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white cursor-pointer z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
        <X className="w-6 h-6" />
      </button>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <video 
          src="/WhatsApp%20Video%202026-06-23%20at%204.32.17%20PM.mp4" 
          controls 
          autoPlay 
          playsInline 
          className="w-full h-full object-contain" 
        />
      </motion.div>
    </motion.div>
  );
}

/* ================================================================== */
/*  MUSIC PLAYER                                                       */
/* ================================================================== */

class SafeYouTube extends React.Component<
  { videoId: string; onReady: (event: YouTubeEvent) => void; opts: any },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("YouTube component crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return (
      <YouTube
        videoId={this.props.videoId}
        onReady={this.props.onReady}
        opts={this.props.opts}
      />
    );
  }
}

function BackgroundMusic({ isPlaying, onTogglePlay }: { isPlaying: boolean; onTogglePlay: () => void }) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isReady, setIsReady] = useState(false);

  const onReady = (event: YouTubeEvent) => {
    try {
      setPlayer(event.target);
      setIsReady(true);
      if (isPlaying) {
        event.target.playVideo();
      } else {
        event.target.pauseVideo();
      }
    } catch (err) {
      console.error("Error inside YouTube onReady handler:", err);
    }
  };

  useEffect(() => {
    if (!player) return;
    try {
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    } catch (err) {
      console.error("Error triggering YouTube play state:", err);
    }
  }, [isPlaying, player]);

  return (
    <>
      <div className="hidden">
        <SafeYouTube
          videoId="pKFd12id5oQ"
          onReady={onReady}
          opts={{
            playerVars: {
              autoplay: isPlaying ? 1 : 0,
              controls: 0,
              loop: 1,
              playlist: "pKFd12id5oQ",
            },
          }}
        />
      </div>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isReady ? 1 : 0, opacity: isReady ? 1 : 0 }}
        whileTap={{ scale: 0.9 }}
        onClick={onTogglePlay}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-pink-200/95 text-gray-700 shadow-lg backdrop-blur-sm border border-white/30 cursor-pointer hover:bg-pink-300/95 transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6 ml-0.5" />
        )}
      </motion.button>
    </>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */

class PageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Main page crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-pink-50 to-purple-50 text-center">
          <div className="max-w-md p-8 bg-white/85 backdrop-blur-md rounded-3xl border border-pink-200/50 shadow-2xl flex flex-col items-center">
            <span className="text-5xl mb-4 animate-bounce">🌸</span>
            <h2 className="font-serif text-2xl font-bold text-gray-800 mb-3">Something went wrong</h2>
            <p className="text-gray-600 mb-6 text-sm">
              We encountered an issue displaying some elements, but your bouquet is still here!
            </p>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="px-6 py-3 text-sm font-semibold text-white bg-pink-500 rounded-full hover:bg-pink-600 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function CreateBouquetContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Interactive states
  const [selectedFlower, setSelectedFlower] = useState<typeof FLOWERS[0] | null>(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<number | null>(null);
  const [lightboxVideo, setLightboxVideo] = useState(false);
  const [heartRevealed, setHeartRevealed] = useState(false);

  // Audio placeholder states
  const [audioPlaying, setAudioPlaying] = useState<number | null>(null);

  // Background music states
  const [musicPlaying, setMusicPlaying] = useState(true);
  const shouldPlayMusic = musicPlaying && !lightboxVideo && audioPlaying === null;
  const [audioProgress, setAudioProgress] = useState<Record<number, number>>({});
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate audio playback progress
  const toggleAudio = (index: number) => {
    if (audioPlaying === index) {
      // Pause
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioPlaying(null);
    } else {
      // Play
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setAudioPlaying(index);
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          const current = prev[index] || 0;
          if (current >= 1) {
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
            setAudioPlaying(null);
            return { ...prev, [index]: 0 };
          }
          return { ...prev, [index]: current + 0.02 };
        });
      }, 100);
    }
  };

  // Confetti burst
  const fireConfetti = () => {
    setHeartRevealed(true);
    const duration = 4000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#F7D6E0", "#E6D5FF", "#BEE3F8", "#FF69B4"],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#F7D6E0", "#E6D5FF", "#BEE3F8", "#FF69B4"],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Cleanup interval on unmount
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, []);

  return (
    <div className="w-full min-h-[100dvh] bg-[#FFFDFB] text-[#2D3748] selection:bg-pink-200/40">

      {/* ---- Modals ---- */}
      <AnimatePresence>
        {selectedFlower && <FlowerModal flower={selectedFlower} onClose={() => setSelectedFlower(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {lightboxPhoto !== null && <PhotoLightbox index={lightboxPhoto} onClose={() => setLightboxPhoto(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {lightboxVideo && <VideoLightbox open={lightboxVideo} onClose={() => setLightboxVideo(false)} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ========== LANDING SCREEN ========== */
          <motion.section
            key="landing"
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7 }}
            className="relative min-h-[100dvh] flex flex-col items-center justify-center p-8 overflow-hidden"
          >
            {/* Floating petals */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              {isMounted && [...Array(10)].map((_, i) => {
                const emojis = ["🌸", "🌹", "🌷", "🌺", "❤️", "✨"];
                const emoji = emojis[i % emojis.length];
                return (
                  <motion.div
                    key={i}
                    className="absolute select-none"
                    style={{
                      left: `${(i * 10) % 100}%`,
                      bottom: "-10%",
                      fontSize: `${16 + Math.random() * 12}px`,
                    }}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{
                      y: "-110vh",
                      opacity: [0, 0.7, 0.7, 0],
                      x: [0, Math.random() * 60 - 30],
                      rotate: [0, Math.random() * 360],
                    }}
                    transition={{
                      duration: 8 + Math.random() * 6,
                      repeat: Infinity,
                      delay: i * 0.9,
                      ease: "linear",
                    }}
                  >
                    {emoji}
                  </motion.div>
                );
              })}
            </div>

            {/* Ambient glow */}
            <div className="absolute w-80 h-80 rounded-full bg-pink-200/30 blur-3xl pointer-events-none animate-pulse" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="text-center z-10 max-w-sm w-full flex flex-col items-center"
            >
              {/* Cover photo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                className="mb-8 relative group"
              >
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 opacity-50 blur animate-pulse" />
                <div className="relative w-52 h-52 rounded-full bg-white border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center">
                  <img 
                    src="/WhatsApp%20Image%202026-06-23%20at%205.34.27%20PM.jpeg" 
                    alt="Bouquet Cover" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                </div>
              </motion.div>

              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3 leading-tight">
                HAPPY <span className="text-pink-400">BIRTHDAY GUMMY BEAR</span>
              </h1>
             

              <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-[#2D3748] rounded-full shadow-lg hover:bg-[#2D3748]/90 active:bg-[#2D3748]/80 transition-colors cursor-pointer"
              >
                Open Your Bouquet
                <Sparkles className="w-4.5 h-4.5" />
              </motion.button>
            </motion.div>
          </motion.section>
        ) : (
          /* ========== MAIN CONTENT ========== */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full"
          >
            {/* Background Music */}
            <BackgroundMusic 
              isPlaying={shouldPlayMusic} 
              onTogglePlay={() => setMusicPlaying(!musicPlaying)} 
            />

            {/* ---- 1. Interactive Bouquet ---- */}
            <section className="min-h-screen flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden bg-gradient-to-b from-pink-50/40 to-transparent">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-10"
              >
                <h2 className="font-serif text-4xl mb-2">Explore the Bouquet</h2>
                <p className="text-gray-500">Click on a flower to reveal a surprise.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="relative w-full max-w-xl h-[60vh] bg-pink-50/40 rounded-[3rem] border border-pink-200/40 shadow-inner"
              >
                {/* Decorative stems */}
                <svg className="absolute bottom-14 left-1/2 -translate-x-1/2 w-48 h-36 text-pink-300/30 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M50,100 C38,70 12,45 15,20" strokeDasharray="2,2" />
                  <path d="M50,100 C45,75 30,45 35,20" />
                  <path d="M50,100 C50,65 50,35 50,12" />
                  <path d="M50,100 C55,75 70,45 65,20" />
                  <path d="M50,100 C62,70 88,45 85,20" strokeDasharray="2,2" />
                </svg>

                {/* Vase */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-28 bg-white/30 rounded-t-3xl border border-white/40 backdrop-blur-md shadow-lg flex items-center justify-center">
                  <div className="w-10 h-0.5 bg-white/50 rounded-full mb-4" />
                </div>

                {/* Interactive flowers */}
                {FLOWERS.map((flower, i) => (
                  <motion.button
                    key={flower.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.12, type: "spring", bounce: 0.5 }}
                    onClick={() => setSelectedFlower(flower)}
                    className={`absolute w-12 h-12 rounded-full ${flower.color} border-2 border-white shadow-lg flex items-center justify-center text-xl cursor-pointer hover:scale-125 hover:border-pink-400 hover:shadow-xl active:scale-95 transition-all duration-200 z-10`}
                    style={{ 
                      left: `${flower.x}%`, 
                      top: `${flower.y}%`,
                      x: "-50%",
                      y: "-50%"
                    }}
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      transition: { type: "tween", duration: 0.4 }
                    }}
                  >
                    {flower.emoji}
                  </motion.button>
                ))}
              </motion.div>
            </section>

            {/* ---- 2. Letter Section ---- */}
            <section className="min-h-screen bg-purple-50/20 flex flex-col items-center justify-center py-20 px-6">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-serif text-4xl mb-2">A Letter For You</h2>
                <p className="text-gray-500">{isEnvelopeOpen ? "A message from the heart." : "Tap the envelope to open."}</p>
              </motion.div>

              <div className="relative w-full max-w-lg min-h-[300px] flex justify-center items-center">
                <AnimatePresence mode="wait">
                  {!isEnvelopeOpen ? (
                    <motion.div
                      key="closed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEnvelopeOpen(true)}
                      className="relative w-64 h-48 bg-white rounded-lg shadow-2xl flex items-center justify-center border border-gray-100 cursor-pointer group"
                    >
                      <div className="absolute -top-[30px] left-0 w-0 h-0 border-l-[128px] border-r-[128px] border-b-[30px] border-l-transparent border-r-transparent border-b-pink-100/40" />
                      <Mail className="w-12 h-12 text-pink-300 group-hover:text-pink-400 transition-colors" />
                      <div className="absolute -bottom-4 w-40 h-4 bg-black/5 rounded-full blur-md" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", bounce: 0.2 }}
                      className="relative w-full max-w-md bg-[#fdfaf6] p-8 md:p-10 shadow-2xl rounded-lg border border-[#e8dfd3] max-h-[70vh] overflow-y-auto"
                      style={{
                        backgroundImage: "repeating-linear-gradient(transparent, transparent 31px, #e8dfd3 31px, #e8dfd3 32px)",
                        lineHeight: "32px",
                      }}
                    >
                      <button
                        onClick={() => setIsEnvelopeOpen(false)}
                        className="absolute top-3 right-3 text-xs font-semibold text-gray-400 hover:text-gray-700 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                      >
                        Close
                      </button>
                      <p className="font-serif text-lg text-gray-700 whitespace-pre-wrap pt-4">{LETTER_TEXT}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* ---- 3. Photo Gallery (4 photos) ---- */}
            <section className="w-full bg-pink-50/30 py-20 px-6 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-serif text-4xl mb-2">Our Memories</h2>
                <p className="text-gray-500">A collection of favorite moments.</p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl w-full">
                {PHOTOS.map((photo, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setLightboxPhoto(i)}
                    className="relative aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden border border-pink-100 shadow-md cursor-pointer group"
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.caption} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-75"></p>
                      <p className="text-xs font-medium line-clamp-1">{photo.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ---- 4. Video Messages (1 video) ---- */}
            <section className="w-full bg-white py-20 px-6 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-serif text-4xl mb-2">Our happiest moments tg</h2>
                <p className="text-gray-500">A moment captured in motion.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full flex justify-center"
              >
                <VideoPlaceholder label="Our happiest moments tg" onClick={() => setLightboxVideo(true)} />
              </motion.div>
            </section>

            {/* ---- 5. Voice Notes ---- */}
            <section className="w-full bg-pink-50/20 py-20 px-6 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="font-serif text-4xl mb-2">Voice Notes</h2>
                <p className="text-gray-500">Messages spoken from the heart.</p>
              </motion.div>

              <div className="flex flex-col gap-5 w-full max-w-2xl">
                {["Voice Note"].map((label, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                  >
                    <AudioPlaceholder
                      label={label}
                      isPlaying={audioPlaying === i}
                      progress={audioProgress[i] || 0}
                      onToggle={() => toggleAudio(i)}
                    />
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ---- 6. Final Surprise ---- */}
            <section className="min-h-screen flex flex-col items-center justify-center py-20 px-6 relative">
              <AnimatePresence mode="wait">
                {!heartRevealed ? (
                  <motion.div
                    key="surprise-box"
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="text-center"
                  >
                    <h2 className="font-serif text-4xl mb-8">One Last Thing…</h2>

                    <motion.button
                      onClick={fireConfetti}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(244,114,182,0.4)",
                          "0 0 0 20px rgba(244,114,182,0)",
                          "0 0 0 0 rgba(244,114,182,0)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-28 h-28 rounded-full bg-pink-300 flex items-center justify-center text-white shadow-2xl mx-auto cursor-pointer"
                    >
                      <Heart className="w-12 h-12 fill-white" />
                    </motion.button>
                    <p className="text-gray-400 mt-4 text-sm">Tap the heart</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="love-reveal"
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.3 }}
                    className="text-center p-6 max-w-xl"
                  >
                    <motion.h2
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                      className="font-serif text-5xl md:text-7xl text-pink-400 font-bold mb-6 drop-shadow"
                    >
                      I Love You!
                    </motion.h2>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
                      Thank you for being the most amazing part of my life. I hope this little something made you feel better ab ur day. umma to my fav person in the whole world.
                    </p>
                    <div className="flex justify-center gap-3 text-4xl">
                      {["💐", "💐", "💐"].map((e, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.4 + i * 0.15, type: "spring" }}
                        >
                          {e}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CreateBouquet() {
  return (
    <PageErrorBoundary>
      <CreateBouquetContent />
    </PageErrorBoundary>
  );
}
