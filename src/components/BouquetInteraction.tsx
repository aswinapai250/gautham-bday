"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play } from "lucide-react";
import { useBouquet, FlowerData } from "@/context/BouquetContext";

export default function BouquetInteraction() {
  const { flowers } = useBouquet();
  const [selectedFlower, setSelectedFlower] = useState<FlowerData | null>(null);

  return (
    <div className="relative w-full h-[85vh] bg-gradient-to-b from-background to-primary/5 flex flex-col items-center justify-center overflow-hidden py-10">
      
      {/* Sparkles background effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              fontSize: `${Math.random() * 8 + 8}px`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <div className="text-center mb-6 z-10 px-4 flex-shrink-0">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-1 leading-tight">Explore the Bouquet</h2>
        <p className="font-sans text-sm text-foreground/70">Tap a flower to reveal a secret note.</p>
      </div>

      {/* Visual Arrangement Board */}
      <div className="relative w-full max-w-md h-[50vh] mx-auto rounded-[3rem] border border-primary/20 bg-gradient-to-tr from-white/30 via-pink-50/10 to-blue-50/20 backdrop-blur-sm shadow-xl flex flex-col justify-end items-center p-6">
        
        {/* Flower stems SVG background */}
        <svg className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-40 text-pink-200/50 opacity-80 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M50,100 C38,70 12,45 15,20" strokeDasharray="1,1" />
          <path d="M50,100 C45,75 30,45 35,20" />
          <path d="M50,100 C50,65 50,35 50,12" />
          <path d="M50,100 C55,75 70,45 65,20" />
          <path d="M50,100 C62,70 88,45 85,20" strokeDasharray="1,1" />
        </svg>

        {/* Glassmorphic Vase */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-20 bg-white/30 backdrop-blur-md rounded-t-3xl border-t-2 border-x-2 border-white/50 shadow-lg flex items-center justify-center z-10 pointer-events-none">
          <div className="w-8 h-0.5 bg-white/60 rounded-full mb-6"></div>
        </div>

        {/* Floating Interactive Flowers */}
        {flowers.map((flower, i) => (
          <motion.div
            key={flower.id}
            className="absolute"
            style={{ left: `${flower.x}%`, top: `${flower.y}%` }}
            animate={{
              y: [0, -5, 2, -3, 0],
              x: [0, 2, -2, 3, 0],
            }}
            transition={{
              duration: 4 + (i % 3) * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Ambient pulsing ring behind flower */}
            <motion.div
              className="absolute -inset-1.5 rounded-full border border-pink-400/40 opacity-0 pointer-events-none"
              animate={{
                scale: [1, 1.4, 1.7, 1.9],
                opacity: [0, 0.6, 0.3, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />

            <motion.button
              className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl border-2 border-white hover:border-pink-100 cursor-pointer transition-colors ${flower.color || "bg-pink-300"}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 200, damping: 15 }}
              whileTap={{ scale: 0.9, rotate: [0, -10, 10, 0] }}
              onClick={() => setSelectedFlower(flower)}
            >
              {flower.emoji || "🌸"}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Immersive Mobile Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedFlower && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm" onClick={() => setSelectedFlower(null)}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full max-w-md bg-background rounded-t-[2.5rem] shadow-2xl p-6 border-t border-x border-primary/25 max-h-[85vh] overflow-y-auto mt-auto flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Drag Indicator */}
              <div className="w-12 h-1.5 bg-foreground/10 rounded-full mx-auto mb-2 cursor-pointer flex-shrink-0" onClick={() => setSelectedFlower(null)} />

              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2 animate-bounce">{selectedFlower.emoji || "🌸"}</span>
                <h3 className="font-serif text-2xl font-bold text-foreground text-center">
                  {selectedFlower.title}
                </h3>
              </div>

              {/* Responsive Image attachment */}
              {selectedFlower.image && (
                <div className="rounded-2xl overflow-hidden shadow bg-black/5 flex items-center justify-center relative flex-shrink-0 max-h-[300px]">
                  <img 
                    src={selectedFlower.image} 
                    alt={selectedFlower.title} 
                    className="max-h-[300px] w-full object-contain"
                  />
                </div>
              )}
              
              {/* Responsive Video attachment */}
              {selectedFlower.video && (
                <div className="rounded-2xl overflow-hidden shadow bg-black aspect-video relative flex-shrink-0">
                  <video 
                    src={selectedFlower.video} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {/* Scrollable Message Box */}
              {(selectedFlower.message || selectedFlower.content) && (
                <div className="p-4 bg-white/60 border border-primary/10 rounded-2xl">
                  <p className="font-sans text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {selectedFlower.message || selectedFlower.content}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedFlower(null)}
                className="w-full py-3.5 bg-foreground text-white rounded-2xl text-sm font-semibold hover:bg-foreground/90 transition-colors cursor-pointer mt-2 min-h-[44px]"
              >
                Close Surprise
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
