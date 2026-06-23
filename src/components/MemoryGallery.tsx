"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useBouquet, PhotoData } from "@/context/BouquetContext";

export default function MemoryGallery() {
  const { photos } = useBouquet();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  const activePhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-primary/5 via-primary/10 to-background py-20 flex flex-col items-center px-4">
      <div className="text-center mb-12 px-4 max-w-sm">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-1 leading-tight">Our Memories</h2>
        <p className="font-sans text-sm text-foreground/70">A physical-style collection of our favorite moments.</p>
      </div>

      {/* Grid of Polaroid Cards (Responsive & Clean) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl w-full px-2">
        {photos.map((photo, index) => {
          // Alternating rotations for polaroid effect
          const rotate = index % 2 === 0 
            ? (index % 3 === 0 ? 3 : 1.5) 
            : (index % 5 === 0 ? -3 : -1.5);

          return (
            <motion.div
              key={photo.id}
              className="w-full flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
            >
              <motion.div
                whileTap={{ scale: 0.98 }}
                style={{ rotate: `${rotate}deg` }}
                className="bg-white p-4 pb-8 shadow-xl rounded-sm border border-gray-100 active:shadow-md transition-shadow cursor-pointer w-64 max-w-full flex flex-col gap-4"
                onClick={() => setSelectedPhotoIndex(index)}
              >
                {/* Polaroid Photo Frame */}
                <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-sm relative shadow-inner border border-gray-100">
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    className="w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />
                  {/* Subtle Polaroid top shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                </div>
                
                {/* Polaroid Caption */}
                <p className="font-serif text-center text-sm text-gray-700 italic px-2 tracking-wide leading-relaxed truncate">
                  {photo.caption}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Touch-Friendly Gestured Lightbox */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 select-none touch-none"
          >
            {/* Close button */}
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer z-50 p-2 min-h-[44px] min-w-[44px]"
              onClick={() => setSelectedPhotoIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Previous Image Trigger */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer z-20 min-h-[44px] min-w-[44px]"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Polaroid lightbox container with drag-to-swipe gestures */}
            <motion.div
              key={activePhoto.id}
              initial={{ scale: 0.9, rotate: -2, y: 15 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ type: "spring", damping: 25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x > 80) {
                  handlePrev();
                } else if (info.offset.x < -80) {
                  handleNext();
                }
              }}
              className="bg-white p-4 pb-12 shadow-2xl rounded-sm border border-gray-200 w-full max-w-md max-h-[80vh] flex flex-col gap-4 origin-center cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-sm relative shadow-inner border border-gray-150">
                <img 
                  src={activePhoto.url} 
                  alt={activePhoto.caption} 
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>
              <p className="text-gray-800 text-lg font-serif text-center italic tracking-wide">
                {activePhoto.caption}
              </p>
              
              {/* Mobile swipe helper */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-400 uppercase tracking-widest pointer-events-none">
                ← Swipe to navigate →
              </div>
            </motion.div>

            {/* Next Image Trigger */}
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer z-20 min-h-[44px] min-w-[44px]"
              onClick={handleNext}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
