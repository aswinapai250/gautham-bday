"use client";

import React, { useRef, useState, useEffect } from "react";
import YouTube, { YouTubeEvent, YouTubePlayer } from "react-youtube";
import { Music, Pause, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useBouquet } from "@/context/BouquetContext";

class SafeYouTube extends React.Component<
  { videoId: string; onReady: (event: YouTubeEvent) => void; onStateChange?: (event: YouTubeEvent) => void; opts: any },
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
    console.error("YouTube component in MusicPlayer crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return (
      <YouTube
        videoId={this.props.videoId}
        onReady={this.props.onReady}
        onStateChange={this.props.onStateChange}
        opts={this.props.opts}
      />
    );
  }
}

interface MusicPlayerProps {
  autoPlay?: boolean;
}

export default function MusicPlayer({ autoPlay = false }: MusicPlayerProps) {
  const { musicId } = useBouquet();
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isLocalAudio = musicId && (musicId.startsWith("data:audio") || musicId.startsWith("blob:") || musicId.startsWith("/"));

  useEffect(() => {
    // If it's local audio, initialize it
    if (isLocalAudio && audioRef.current) {
      setIsReady(true);
      if (autoPlay) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log("Autoplay blocked:", err);
        });
      }
    }
  }, [musicId, isLocalAudio, autoPlay]);

  const onReady = (event: YouTubeEvent) => {
    try {
      setPlayer(event.target);
      setIsReady(true);
      if (autoPlay) {
        event.target.playVideo();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error inside YouTube Player onReady:", err);
    }
  };

  const togglePlay = () => {
    if (isLocalAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
      return;
    }

    if (!player) return;
    try {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    } catch (err) {
      console.error("Error toggling YouTube playback state:", err);
    }
  };

  const onStateChange = (event: YouTubeEvent) => {
    // 1 = playing, 2 = paused
    if (event.data === 1) setIsPlaying(true);
    if (event.data === 2) setIsPlaying(false);
  };

  if (!musicId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isLocalAudio ? (
        <audio
          ref={audioRef}
          src={musicId}
          loop
          className="hidden"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        <div className="hidden">
          <SafeYouTube
            videoId={musicId}
            onReady={onReady}
            onStateChange={onStateChange}
            opts={{
              playerVars: {
                autoplay: autoPlay ? 1 : 0,
                controls: 0,
                loop: 1,
                playlist: musicId,
              },
            }}
          />
        </div>
      )}

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isReady ? 1 : 0, opacity: isReady ? 1 : 0 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/95 text-foreground shadow-lg backdrop-blur-sm border border-white/20 transition-colors active:bg-primary hover:bg-primary/90 cursor-pointer"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6 ml-1" />
        )}
      </motion.button>
    </div>
  );
}
