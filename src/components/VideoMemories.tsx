"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, PlayCircle, X, Volume2, VolumeX } from "lucide-react";
import { useBouquet, VideoData } from "@/context/BouquetContext";

export default function VideoMemories() {
  const { videos } = useBouquet();
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!videos || videos.length === 0) return null;

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full py-20 bg-background flex flex-col items-center px-4">
      <div className="text-center mb-12 px-4 max-w-sm">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-1 leading-tight">Video Memories</h2>
        <p className="font-sans text-sm text-foreground/70">Our special moments captured in vertical motion.</p>
      </div>

      {/* Grid of Reels-style Vertical Cards (2 columns on mobile!) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl w-full px-2">
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (video.url) setActiveVideo(video);
            }}
            className="group relative aspect-[9/16] rounded-3xl overflow-hidden shadow-lg active:shadow-md cursor-pointer bg-gray-900 border border-gray-100 flex flex-col justify-end"
          >
            {/* Background preview */}
            {video.url ? (
              <video 
                src={video.url} 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700" 
              />
            ) : (
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700"
                loading="lazy"
              />
            )}
            
            {/* Glassmorphic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none" />

            {/* Play Button Indicator (Large Touch Target) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div 
                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center shadow-lg transition-colors"
              >
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
            </div>

            {/* Title / Info Overlay */}
            <div className="relative z-10 p-4 w-full">
              <span className="inline-block px-2.5 py-0.5 mb-1.5 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-bold text-white uppercase tracking-wider">
                {video.duration || "Video"}
              </span>
              <h3 className="text-white font-sans font-semibold text-sm leading-snug drop-shadow-md truncate">
                {video.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Immersive Vertical Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none"
            onClick={() => setActiveVideo(null)}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white z-50 p-2 min-h-[44px] min-w-[44px] cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Mute Button */}
            <button 
              onClick={toggleMute}
              className="absolute top-6 left-6 text-white/60 hover:text-white z-50 p-2 min-h-[44px] min-w-[44px] cursor-pointer bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Immersive Vertical Video Frame */}
            <div 
              className="relative w-full h-full max-w-md bg-black flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <video 
                ref={videoRef}
                src={activeVideo.url} 
                controls 
                autoPlay 
                playsInline
                className="w-full h-full object-contain"
              />
              
              {/* Floating Title overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none text-left">
                <span className="inline-block px-2.5 py-0.5 mb-1 bg-white/20 backdrop-blur-md rounded text-[9px] font-bold text-white uppercase tracking-widest">
                  Playing Memo
                </span>
                <h3 className="text-white text-lg font-serif font-bold drop-shadow-md">
                  {activeVideo.title}
                </h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
