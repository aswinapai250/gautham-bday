"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useBouquet } from "@/context/BouquetContext";

export default function Timeline() {
  const { timeline } = useBouquet();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scroll linked animation for the line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleYSpring = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  if (!timeline || timeline.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="w-full bg-gradient-to-b from-background via-secondary/5 to-background py-24 relative overflow-hidden"
    >
      {/* Soft floating background circles */}
      <div className="absolute top-1/4 left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-20 z-10 px-4">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-1 leading-tight">Our Journey</h2>
        <p className="font-sans text-sm text-foreground/70">Step by step, tracing our path together.</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 relative">
        
        {/* Desktop Vertical Connecting Line (Center) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 -translate-x-1/2 hidden md:block" />
        <motion.div 
          style={{ scaleY: scaleYSpring }}
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent -translate-x-1/2 origin-top hidden md:block"
        />

        {/* Mobile Vertical Connecting Line (Left aligned) */}
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-primary/20 md:hidden" />
        <motion.div 
          style={{ scaleY: scaleYSpring }}
          className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent origin-top md:hidden"
        />

        <div className="space-y-16 relative">
          {timeline.map((milestone, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.15 }}
                className={`flex flex-col md:flex-row items-stretch gap-6 relative md:gap-8 ${isEven ? "md:flex-row-reverse" : ""}`}
              >
                {/* Timeline Dot Indicator */}
                {/* Desktop Indicator */}
                <div className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-background border-4 border-primary shadow-md hidden md:block z-10 top-1/2 -translate-y-1/2" />
                
                {/* Mobile Indicator */}
                <div className="absolute left-4 -translate-x-1.5 w-4 h-4 rounded-full bg-background border-4 border-primary shadow-md md:hidden z-10 top-6" />

                {/* Content Panel (Touch Friendly & Responsive) */}
                <div className={`w-full md:w-1/2 pl-8 md:pl-0 flex flex-col justify-center ${isEven ? "md:items-start md:text-left" : "md:items-end md:text-right"}`}>
                  <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow w-full">
                    <span className="text-primary font-bold text-xs tracking-widest uppercase mb-1.5 block">
                      {milestone.date}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2 leading-snug">
                      {milestone.title}
                    </h3>
                    <p className="font-sans text-sm text-foreground/80 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Polaroid Frame Image (Gently sways/floats) */}
                <div className="w-full md:w-1/2 pl-8 md:pl-0 flex justify-center items-center">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotate: isEven ? 1 : -1 }}
                    className="w-36 h-36 sm:w-44 sm:h-44 bg-white p-2 pb-5 shadow-lg rounded-sm border border-gray-100 flex flex-col justify-between"
                  >
                    <div className="w-full h-[82%] bg-gray-150 rounded-sm overflow-hidden border border-gray-100">
                      <img 
                        src={milestone.image} 
                        alt={milestone.title} 
                        className="w-full h-full object-cover select-none pointer-events-none" 
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[9px] font-serif text-gray-500 italic text-center truncate px-1">
                      {milestone.title}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
