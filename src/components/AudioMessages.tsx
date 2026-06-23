"use client";

import React from "react";
import { useBouquet } from "@/context/BouquetContext";
import { Mic } from "lucide-react";

export default function AudioMessages() {
  const { audioClips } = useBouquet();

  if (!audioClips || audioClips.length === 0) return null;

  return (
    <div className="w-full py-24 bg-primary/5 flex flex-col items-center">
      <div className="text-center mb-16 px-4">
        <h2 className="font-serif text-4xl text-foreground mb-4">Voice Notes</h2>
        <p className="font-sans text-lg text-foreground/70">Messages spoken from the heart.</p>
      </div>

      <div className="flex flex-col gap-6 px-6 w-full max-w-2xl">
        {audioClips.map((audio) => (
          <div 
             key={audio.id} 
             className="flex flex-col sm:flex-row items-center gap-4 bg-white p-6 rounded-3xl shadow-xl border border-primary/20"
          >
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
               <Mic className="w-8 h-8" />
             </div>
             <div className="flex-1 text-center sm:text-left w-full">
               <h3 className="font-serif text-xl text-foreground mb-2">{audio.title}</h3>
               {audio.url ? (
                  <audio controls src={audio.url} className="w-full" />
               ) : (
                  <p className="text-sm text-gray-400 italic">No audio recorded</p>
               )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
