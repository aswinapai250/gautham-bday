"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useBouquet } from "@/context/BouquetContext";

interface LandingScreenProps {
  onOpen: () => void;
}

export default function LandingScreen({ onOpen }: LandingScreenProps) {
  const { recipientName, bouquetImage } = useBouquet();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-gradient-to-b from-primary/10 via-background to-secondary/10">
      
      {/* Floating Flower Petals & Hearts (Touch & Performance Friendly) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => {
          const size = Math.random() * 20 + 16;
          const emojis = ["🌸", "🌹", "🌷", "🌺", "❤️", "✨"];
          const emoji = emojis[i % emojis.length];
          const delay = i * 0.8;
          const duration = Math.random() * 6 + 8; // 8s to 14s
          
          return (
            <motion.div
              key={i}
              className="absolute select-none pointer-events-none"
              style={{
                left: `${(i * 8.5) % 100}%`,
                bottom: "-10%",
                fontSize: `${size}px`,
                filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.05))",
              }}
              initial={{ y: "110%", opacity: 0, rotate: 0 }}
              animate={{
                y: "-110%",
                opacity: [0, 0.8, 0.8, 0],
                x: [0, Math.random() * 40 - 20, Math.random() * 80 - 40],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "linear",
              }}
            >
              {emoji}
            </motion.div>
          );
        })}
      </div>

      {/* Pulsing Ambient Glow behind the cover card */}
      <div className="absolute w-72 h-72 rounded-full bg-primary/20 blur-3xl -z-10 animate-pulse pointer-events-none" />

      {/* Main Cover Card Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10 max-w-sm w-full glass-panel p-8 rounded-[2.5rem] shadow-2xl border border-white/40 flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1, type: "spring", bounce: 0.3 }}
          className="mb-8 relative group"
        >
          {/* Card Border glow */}
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-50 group-hover:opacity-75 blur transition duration-1000 group-hover:duration-200 animate-tilt" />

          {/* Cover image circle */}
          <div className="w-56 h-56 rounded-full bg-white/50 flex items-center justify-center border-4 border-white shadow-2xl relative overflow-hidden">
             <img src={bouquetImage} alt="Bouquet" className="w-full h-full object-cover" />
             <motion.div 
                className="absolute inset-0 bg-white/10"
                animate={{
                  rotate: 360,
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             />
          </div>
        </motion.div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3 leading-tight tracking-tight px-2">
          For {recipientName}
        </h1>
        
        <p className="font-sans text-sm md:text-base text-foreground/75 mb-8 max-w-xs leading-relaxed">
          A special digital surprise created with love, just for you.
        </p>

        <motion.button
          onClick={onOpen}
          whileTap={{ scale: 0.96 }}
          className="relative inline-flex items-center justify-center gap-2 px-8 py-4 font-sans text-base font-semibold text-white bg-foreground hover:bg-foreground/90 active:bg-foreground/80 rounded-full shadow-lg transition-colors cursor-pointer min-h-[48px] z-10"
        >
          Open Your Bouquet
          <Sparkles className="w-4.5 h-4.5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
