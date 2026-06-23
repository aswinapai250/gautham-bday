"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";

export default function FinalSurprise() {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#F7D6E0', '#E6D5FF', '#BEE3F8']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#F7D6E0', '#E6D5FF', '#BEE3F8']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center py-24 relative overflow-hidden">
      {!isRevealed ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center z-10"
        >
          <h2 className="font-serif text-4xl text-foreground mb-8">One Last Thing...</h2>
          <motion.button
            onClick={handleReveal}
            whileTap={{ scale: 0.9 }}
            className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl mx-auto active:bg-primary-dark transition-colors"
          >
            <Heart className="w-12 h-12 fill-white animate-pulse" />
          </motion.button>
          <p className="font-sans text-foreground/50 mt-6">Tap the heart</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="text-center z-10 p-8 max-w-2xl"
          >
            <h2 className="font-serif text-5xl md:text-7xl text-primary font-bold mb-6">
              I Love You!
            </h2>
            <p className="font-sans text-xl text-foreground/80 leading-relaxed mb-12">
              Thank you for being the most amazing part of my life. I hope this little digital bouquet brightened your day.
            </p>
            
            <div className="flex justify-center gap-4">
               {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 + 1, type: "spring" }}
                    className="text-5xl"
                  >
                    💐
                  </motion.div>
               ))}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Decorative background elements when revealed */}
      {isRevealed && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 pointer-events-none"
        >
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply" />
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl mix-blend-multiply" />
        </motion.div>
      )}
    </div>
  );
}
