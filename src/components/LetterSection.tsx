"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MailOpen } from "lucide-react";
import { useBouquet } from "@/context/BouquetContext";

function parseRichText(text: string): string {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  // Underline
  html = html.replace(/__(.*?)__/g, "<u>$1</u>");
  // Center
  html = html.replace(/\[center\](.*?)\[\/center\]/g, '<div class="text-center w-full">$1</div>');
  // Newlines
  html = html.replace(/\n/g, "<br />");
  
  return html;
}

export default function LetterSection() {
  const { letterText } = useBouquet();
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [animationPhase, setAnimationPhase] = useState<"closed" | "opening" | "paperOut" | "typing">("closed");

  const isPreview = typeof window !== "undefined" && window.location.pathname.includes("/create");

  // Manage animation phases
  useEffect(() => {
    if (!isOpen) {
      setAnimationPhase("closed");
      setDisplayedText("");
      return;
    }

    setAnimationPhase("opening");
    
    // Phase 1: Open Flap (0.6s)
    const flapTimeout = setTimeout(() => {
      setAnimationPhase("paperOut");
      
      // Phase 2: Slide Paper Out (0.8s)
      const paperTimeout = setTimeout(() => {
        setAnimationPhase("typing");
      }, 800);
      
      return () => clearTimeout(paperTimeout);
    }, 600);

    return () => clearTimeout(flapTimeout);
  }, [isOpen]);

  // Manage typewriter effect
  useEffect(() => {
    if (animationPhase !== "typing") {
      setDisplayedText("");
      return;
    }

    if (isPreview) {
      setDisplayedText(parseRichText(letterText));
      return;
    }

    let i = 0;
    let fullParsed = parseRichText(letterText);
    let currentHTML = "";
    
    const interval = setInterval(() => {
      if (i < fullParsed.length) {
        // Tag look-ahead to prevent printing HTML syntax
        if (fullParsed[i] === "<") {
          const closingIndex = fullParsed.indexOf(">", i);
          if (closingIndex !== -1) {
            currentHTML += fullParsed.slice(i, closingIndex + 1);
            i = closingIndex + 1;
            setDisplayedText(currentHTML);
            return;
          }
        }
        
        // Entity look-ahead
        if (fullParsed[i] === "&") {
          const closingIndex = fullParsed.indexOf(";", i);
          if (closingIndex !== -1) {
            currentHTML += fullParsed.slice(i, closingIndex + 1);
            i = closingIndex + 1;
            setDisplayedText(currentHTML);
            return;
          }
        }

        currentHTML += fullParsed[i];
        setDisplayedText(currentHTML);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [animationPhase, letterText, isPreview]);

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-primary/5 via-secondary/15 to-primary/5 flex flex-col items-center justify-center py-20 px-4">
      <div className="text-center mb-16 z-10">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-1 leading-tight">A Letter For You</h2>
        <p className="font-sans text-sm text-foreground/70">Tap the envelope to unfold the message.</p>
      </div>

      <div className={`relative w-full max-w-lg h-[50vh] flex items-center justify-center ${isOpen ? "" : "perspective-1000"}`}>
        
        {/* ENVELOPE CONTAINER */}
        <div 
          onClick={() => { if (!isOpen) setIsOpen(true); }}
          className={`relative transition-all duration-500 ${isOpen ? "w-72 h-[460px]" : "w-72 h-48 preserve-3d hover:scale-105 cursor-pointer"}`}
        >
          {/* Back Sheet of Envelope */}
          <div className="absolute bottom-0 left-0 w-full h-48 bg-pink-100 border border-white/30 rounded-lg shadow-xl -z-10 pointer-events-none" />

          {/* Letter Paper (Slides out) */}
          <motion.div
            initial={{ y: 0, scale: 0.95, zIndex: 10 }}
            animate={{
              y: animationPhase === "closed" ? 0 : animationPhase === "opening" ? -15 : -140,
              scale: animationPhase === "closed" ? 0.95 : animationPhase === "opening" ? 0.98 : 1.12,
              zIndex: animationPhase === "closed" || animationPhase === "opening" ? 10 : 40,
            }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 120,
            }}
            className={`absolute bg-[#fdfaf6] p-5 md:p-6 rounded-lg border border-amber-100 shadow-2xl overflow-y-auto cursor-default transition-all duration-500 ${
              isOpen ? "w-[100%] left-0 h-[300px] max-h-[65vh] md:h-[380px] top-[160px]" : "w-[92%] h-[92%] top-[4%] left-[4%]"
            }`}
            onClick={(e) => {
              if (isOpen) {
                e.stopPropagation(); // prevent closing immediately if user clicks paper scroll
              }
            }}
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(232, 223, 211, 0.4) 31px, rgba(232, 223, 211, 0.4) 32px)',
              lineHeight: '32px',
              backgroundAttachment: 'local'
            }}
          >
            {/* Close Button on Paper */}
            {isOpen && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="absolute top-3 right-3 text-[10px] font-bold text-foreground/50 hover:text-foreground/90 cursor-pointer uppercase tracking-wider min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-20"
              >
                Close
              </button>
            )}

            {/* Letter Content */}
            <div className="font-serif text-sm md:text-base text-foreground/85 whitespace-pre-wrap pt-4">
              <span dangerouslySetInnerHTML={{ __html: displayedText || (animationPhase === "closed" ? "" : "...") }} />
              {animationPhase === "typing" && !isPreview && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1.5 h-4 bg-primary ml-1 translate-y-0.5"
                />
              )}
            </div>
          </motion.div>

          {/* Wrap flaps in bottom container to keep them in place and prevent touch intercepts */}
          <div className="absolute bottom-0 left-0 w-full h-48 pointer-events-none">
            {/* Left Flap */}
            <div 
              className="absolute inset-0 bg-[#F4CFDF] border-l border-white/20 z-20"
              style={{ clipPath: "polygon(0 0, 52% 50%, 0 100%)" }}
            />

            {/* Right Flap */}
            <div 
              className="absolute inset-0 bg-[#F4CFDF] border-r border-white/20 z-20"
              style={{ clipPath: "polygon(100% 0, 48% 50%, 100% 100%)" }}
            />

            {/* Bottom Flap */}
            <div 
              className="absolute inset-0 bg-[#F0B3CD] border-b border-white/20 z-20"
              style={{ clipPath: "polygon(0 100%, 50% 43%, 100% 100%)" }}
            />

            {/* Top Flap (Rotates vertically) */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-24 bg-[#E8A5C1] origin-top"
              style={{ 
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden"
              }}
              animate={{
                rotateX: isOpen ? 180 : 0,
                zIndex: isOpen ? 5 : 30,
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
