import { BouquetData } from "@/context/BouquetContext";

export function generateStandaloneHTML(data: BouquetData): string {
  const jsonData = JSON.stringify(data);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>A Special Bouquet for ${escapeHtml(data.recipientName)}</title>
  
  <!-- Tailwind CSS v3 CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
  
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  <!-- Canvas Confetti -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: 'var(--primary)',
            secondary: 'var(--secondary)',
            accent: 'var(--accent)',
            background: 'var(--background)',
            foreground: 'var(--foreground)',
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Playfair Display', 'serif'],
          }
        }
      }
    }
  </script>

  <style>
    :root, .theme-blush {
      --primary: #F7D6E0;
      --secondary: #E6D5FF;
      --accent: #BEE3F8;
      --background: #FFFDFB;
      --foreground: #2D3748;
    }
    .theme-lavender {
      --primary: #E6D5FF;
      --secondary: #F7D6E0;
      --accent: #D6BCFA;
      --background: #FAF5FF;
      --foreground: #2D3748;
    }
    .theme-midnight {
      --primary: #E2E8F0;
      --secondary: #3B82F6;
      --accent: #F59E0B;
      --background: #0F172A;
      --foreground: #F8FAFC;
    }
    .theme-ocean {
      --primary: #BEE3F8;
      --secondary: #B2F5EA;
      --accent: #FEEBC8;
      --background: #F0F9FF;
      --foreground: #1E3A8A;
    }
    .theme-vintage {
      --primary: #C6F6D5;
      --secondary: #FEFCBF;
      --accent: #FED7D7;
      --background: #FCF8F2;
      --foreground: #2F855A;
    }

    body {
      background-color: var(--background);
      color: var(--foreground);
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }

    /* Floating petals keyframes */
    @keyframes floatPetal {
      0% {
        transform: translateY(-10%) rotate(0deg) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 0.8;
      }
      90% {
        opacity: 0.8;
      }
      100% {
        transform: translateY(110vh) rotate(360deg) translateX(100px);
        opacity: 0;
      }
    }

    .petal {
      position: fixed;
      pointer-events: none;
      z-index: 1;
      animation: floatPetal 10s linear infinite;
    }

    .letter-paper {
      background-image: repeating-linear-gradient(transparent, transparent 31px, #e8dfd3 31px, #e8dfd3 32px);
      line-height: 32px;
    }

    /* Fade animations */
    .fade-in {
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body class="theme-${data.theme || "blush"} min-h-screen relative selection:bg-primary/30">

  <!-- Floating Petals Canvas container -->
  <div id="petals-container" class="fixed inset-0 overflow-hidden pointer-events-none z-10"></div>

  <!-- Background Music Player -->
  <div id="music-player-widget" class="fixed bottom-6 right-6 z-50 hidden">
    <button id="music-toggle-btn" class="flex items-center justify-center w-14 h-14 rounded-full bg-primary/95 text-foreground shadow-lg border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
      <i data-lucide="play" class="w-6 h-6 ml-0.5" id="music-icon-state"></i>
    </button>
  </div>
  
  <!-- Hidden YouTube Player Container -->
  <div id="yt-player-container" class="hidden"></div>
  <audio id="local-audio-player" loop class="hidden"></audio>

  <!-- LANDING PAGE -->
  <div id="landing-screen" class="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/20 to-transparent -z-10"></div>
    
    <div class="text-center z-10 max-w-lg fade-in">
      <div class="mb-8">
        <div class="w-56 h-56 mx-auto rounded-full bg-white/30 flex items-center justify-center shadow-2xl border-4 border-white backdrop-blur-md relative overflow-hidden">
          <img src="${data.bouquetImage}" alt="Bouquet" class="w-full h-full object-cover">
        </div>
      </div>

      <h1 class="font-serif text-5xl md:text-6xl font-bold text-foreground mb-4">
        For ${escapeHtml(data.recipientName)}
      </h1>
      <p class="font-sans text-lg md:text-xl text-foreground/80 mb-10">
        A special digital surprise, just for you.
      </p>

      <button id="open-bouquet-btn" class="inline-flex items-center gap-2 px-8 py-4 font-sans text-lg font-medium text-white bg-foreground rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer">
        Open Your Bouquet <i data-lucide="sparkles" class="w-5 h-5"></i>
      </button>
    </div>
  </div>

  <!-- MAIN INTERACTIVE BOUQUET VIEWER (Hidden initially) -->
  <div id="bouquet-content" class="w-full hidden">
    
    <!-- 1. Interactive Bouquet Section -->
    <section class="min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 relative">
      <div class="text-center mb-10">
        <h2 class="font-serif text-4xl text-foreground mb-2">Explore the Bouquet</h2>
        <p class="text-foreground/70">Click on a flower to reveal a surprise.</p>
      </div>

      <div class="relative w-full max-w-xl h-[60vh] mx-auto bg-primary/5 rounded-[3rem] border border-primary/20 shadow-inner">
        <!-- Vase -->
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-32 bg-white/20 rounded-t-3xl border border-white/30 backdrop-blur-md shadow-2xl flex items-center justify-center">
          <div class="w-10 h-1 bg-white/40 rounded-full mb-6"></div>
        </div>

        <!-- Flowers -->
        <div id="flowers-canvas" class="absolute inset-0"></div>
      </div>
    </section>

    <!-- 2. Letter Section -->
    <section class="min-h-screen w-full bg-secondary/15 flex flex-col items-center justify-center py-20 px-4">
      <div class="text-center mb-12">
        <h2 class="font-serif text-4xl text-foreground mb-2">A Letter For You</h2>
        <p class="text-foreground/70">Tap the envelope to open.</p>
      </div>

      <div class="relative w-full max-w-lg min-h-[350px] flex justify-center items-center">
        <!-- Closed Envelope -->
        <div id="envelope-closed" class="cursor-pointer relative w-64 h-48 bg-white rounded-lg shadow-2xl flex items-center justify-center border-t-[30px] border-t-primary/20 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent hover:scale-105 transition-transform border border-gray-100">
          <div class="absolute inset-0 bg-secondary/5 flex items-center justify-center">
            <i data-lucide="mail" class="w-12 h-12 text-primary/80"></i>
          </div>
          <div class="absolute -bottom-6 w-48 h-6 bg-black/5 rounded-full blur-md"></div>
        </div>

        <!-- Open Letter (Hidden Initially) -->
        <div id="envelope-open" class="hidden relative w-full max-w-md bg-[#fdfaf6] p-8 md:p-12 shadow-2xl rounded-lg border border-[#e8dfd3] max-h-[80vh] overflow-y-auto">
          <button id="close-letter-btn" class="absolute top-4 right-4 text-xs font-semibold text-foreground/50 hover:text-foreground cursor-pointer">Close</button>
          <div class="font-serif text-lg md:text-xl text-foreground/80 whitespace-pre-wrap min-h-[250px] pt-4 letter-paper" id="letter-content-text"></div>
        </div>
      </div>
    </section>

    <!-- 3. Photo Gallery Section -->
    <section id="gallery-section" class="w-full bg-primary/10 py-20 px-4 flex flex-col items-center">
      <div class="text-center mb-12">
        <h2 class="font-serif text-4xl text-foreground mb-2">Our Memories</h2>
        <p class="text-foreground/70">A collection of our favorite moments.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl w-full" id="gallery-grid"></div>
    </section>

    <!-- 4. Video Section -->
    <section id="video-section" class="w-full bg-white py-20 px-4 flex flex-col items-center">
      <div class="text-center mb-12">
        <h2 class="font-serif text-4xl text-foreground mb-2">Video Messages</h2>
        <p class="text-foreground/70">Moments captured in motion.</p>
      </div>

      <div class="flex flex-wrap justify-center gap-8 max-w-5xl w-full" id="video-grid"></div>
    </section>

    <!-- 5. Voice Messages Section -->
    <section id="audio-section" class="w-full bg-primary/5 py-20 px-4 flex flex-col items-center">
      <div class="text-center mb-12">
        <h2 class="font-serif text-4xl text-foreground mb-2">Voice Notes</h2>
        <p class="text-foreground/70">Messages spoken from the heart.</p>
      </div>

      <div class="flex flex-col gap-6 w-full max-w-2xl" id="audio-list"></div>
    </section>

    <!-- 6. Timeline Section -->
    <section id="timeline-section" class="w-full bg-secondary/5 py-20 px-4 relative overflow-hidden flex flex-col items-center">
      <div class="text-center mb-16">
        <h2 class="font-serif text-4xl text-foreground mb-2">Our Journey</h2>
        <p class="text-foreground/70">Step by step, together.</p>
      </div>

      <div class="max-w-3xl w-full px-6 relative">
        <!-- Center line -->
        <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/40 -translate-x-1/2 hidden md:block"></div>
        <div class="space-y-16 relative" id="timeline-list"></div>
      </div>
    </section>

    <!-- 7. Final Surprise Section -->
    <section class="min-h-screen w-full flex flex-col items-center justify-center py-20 px-4 relative">
      <div id="final-surprise-box" class="text-center z-10 max-w-lg">
        <h2 class="font-serif text-4xl text-foreground mb-8">One Last Thing...</h2>
        <button id="surprise-heart-btn" class="w-28 h-28 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl mx-auto hover:scale-110 active:scale-95 transition-transform cursor-pointer animate-pulse">
          <i data-lucide="heart" class="w-12 h-12 fill-white"></i>
        </button>
        <p class="text-foreground/50 mt-4">Tap the heart</p>
      </div>
      
      <!-- Big Love Reveal (Hidden Initially) -->
      <div id="final-love-reveal" class="hidden text-center z-10 p-6 max-w-xl">
        <h2 class="font-serif text-5xl md:text-7xl text-primary font-bold mb-6 drop-shadow">
          I Love You!
        </h2>
        <p class="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8">
          Thank you for being the most amazing part of my life. I hope this little digital bouquet brightened your day.
        </p>
        <div class="flex justify-center gap-4 text-4xl">
          💐 💐 💐
        </div>
      </div>
    </section>
  </div>

  <!-- Interactive Lightboxes and Modals -->
  <!-- 1. Flower Surprise Modal -->
  <div id="flower-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] hidden items-center justify-center p-4">
    <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-primary/30 max-h-[85vh] overflow-y-auto transform scale-95 transition-transform" id="flower-modal-content">
      <button id="close-flower-modal" class="absolute top-4 right-4 p-2 bg-foreground/5 rounded-full hover:bg-foreground/10 cursor-pointer">
        <i data-lucide="x" class="w-4 h-4 text-foreground/70"></i>
      </button>
      <div class="flex flex-col items-center mt-2">
        <span id="modal-flower-emoji" class="text-4xl mb-2">🌸</span>
        <h3 id="modal-flower-title" class="font-serif text-2xl font-bold text-foreground text-center mb-4">Flower Surprise</h3>
      </div>
      
      <div id="modal-flower-image-container" class="mb-4 rounded-2xl overflow-hidden shadow-md hidden aspect-[4/3] bg-black/5">
        <img id="modal-flower-image" src="" alt="" class="w-full h-full object-cover">
      </div>
      
      <div id="modal-flower-video-container" class="mb-4 rounded-2xl overflow-hidden shadow-md hidden aspect-video bg-black">
        <video id="modal-flower-video" src="" controls class="w-full h-full object-contain"></video>
      </div>

      <div class="p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <p id="modal-flower-message" class="text-base text-foreground/80 leading-relaxed whitespace-pre-wrap"></p>
      </div>
    </div>
  </div>

  <!-- 2. Photo Lightbox -->
  <div id="photo-lightbox" class="fixed inset-0 bg-black/90 z-[100] hidden items-center justify-center p-4">
    <button id="close-photo-lightbox" class="absolute top-6 right-6 text-white/60 hover:text-white cursor-pointer">
      <i data-lucide="x" class="w-8 h-8"></i>
    </button>
    <div class="max-w-4xl w-full flex flex-col items-center">
      <img id="lightbox-image" src="" alt="" class="max-h-[80vh] max-w-full object-contain rounded shadow-2xl">
      <p id="lightbox-caption" class="text-white mt-4 text-lg font-serif text-center"></p>
    </div>
  </div>

  <!-- 3. Video Lightbox Player -->
  <div id="video-lightbox" class="fixed inset-0 bg-black/95 z-[100] hidden items-center justify-center p-4">
    <button id="close-video-lightbox" class="absolute top-6 right-6 text-white/60 hover:text-white cursor-pointer">
      <i data-lucide="x" class="w-8 h-8"></i>
    </button>
    <div class="max-w-4xl w-full flex flex-col items-center">
      <video id="lightbox-video" src="" controls class="max-h-[75vh] max-w-full object-contain rounded bg-black"></video>
      <h3 id="lightbox-video-title" class="text-white mt-4 text-xl font-serif text-center"></h3>
    </div>
  </div>

  <!-- Data Script -->
  <script>
    window.BOUQUET_DATA = ${jsonData};
  </script>

  <!-- Viewer Logic -->
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      // Initialize Lucide Icons
      lucide.createIcons();
      
      const data = window.BOUQUET_DATA;
      if (!data) return;

      // Render Floating Petals
      const petalsContainer = document.getElementById("petals-container");
      const petalEmojis = ["🌸", "🌹", "🌷", "🌺", "❤️", "✨"];
      
      for (let i = 0; i < 20; i++) {
        const petal = document.createElement("div");
        petal.className = "petal text-xl";
        petal.innerText = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
        petal.style.left = Math.random() * 100 + "vw";
        petal.style.top = -10 - (Math.random() * 20) + "px";
        petal.style.animationDelay = (Math.random() * 8) + "s";
        petal.style.animationDuration = 6 + (Math.random() * 6) + "s";
        petal.style.fontSize = 12 + (Math.random() * 16) + "px";
        petalsContainer.appendChild(petal);
      }

      // State variables
      let musicPlaying = false;
      let ytPlayer = null;
      const localPlayer = document.getElementById("local-audio-player");
      const musicIcon = document.getElementById("music-icon-state");
      
      // Determine if YouTube or Local Audio
      const isYtMusic = data.musicId && !data.musicId.startsWith("data:audio") && !data.musicId.startsWith("blob:") && !data.musicId.startsWith("/");
      
      if (data.musicId) {
        document.getElementById("music-player-widget").classList.remove("hidden");
        
        if (isYtMusic) {
          // Load YouTube Iframe API
          const tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          
          window.onYouTubeIframeAPIReady = () => {
            ytPlayer = new YT.Player('yt-player-container', {
              height: '0',
              width: '0',
              videoId: data.musicId,
              playerVars: {
                autoplay: 0,
                controls: 0,
                loop: 1,
                playlist: data.musicId
              },
              events: {
                onStateChange: (event) => {
                  if (event.data === YT.PlayerState.PLAYING) {
                    musicPlaying = true;
                    updateMusicButton(true);
                  } else {
                    musicPlaying = false;
                    updateMusicButton(false);
                  }
                }
              }
            });
          };
        } else {
          localPlayer.src = data.musicId;
        }
      }

      function updateMusicButton(isPlaying) {
        musicIcon.setAttribute("data-lucide", isPlaying ? "pause" : "play");
        lucide.createIcons();
      }

      function toggleMusic() {
        if (isYtMusic && ytPlayer && ytPlayer.playVideo) {
          if (musicPlaying) {
            ytPlayer.pauseVideo();
          } else {
            ytPlayer.playVideo();
          }
        } else if (!isYtMusic && localPlayer) {
          if (musicPlaying) {
            localPlayer.pause();
            musicPlaying = false;
            updateMusicButton(false);
          } else {
            localPlayer.play().then(() => {
              musicPlaying = true;
              updateMusicButton(true);
            }).catch(console.error);
          }
        }
      }

      document.getElementById("music-toggle-btn").addEventListener("click", toggleMusic);

      // Open Bouquet Click
      document.getElementById("open-bouquet-btn").addEventListener("click", () => {
        document.getElementById("landing-screen").classList.add("hidden");
        
        const content = document.getElementById("bouquet-content");
        content.classList.remove("hidden");
        content.classList.add("fade-in");
        
        // Start background music automatically if allowed
        setTimeout(() => {
          if (isYtMusic && ytPlayer && ytPlayer.playVideo) {
            ytPlayer.playVideo();
          } else if (!isYtMusic && localPlayer) {
            localPlayer.play().then(() => {
              musicPlaying = true;
              updateMusicButton(true);
            }).catch(() => {
              console.log("Autoplay blocked by browser policy");
            });
          }
        }, 500);
      });

      // Render Flowers on Canvas
      const flowersCanvas = document.getElementById("flowers-canvas");
      if (data.flowers && data.flowers.length > 0) {
        data.flowers.forEach((flower) => {
          const btn = document.createElement("button");
          btn.className = \`absolute w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl border-2 border-white hover:scale-110 hover:border-accent active:scale-95 transition-all cursor-pointer \${flower.color || "bg-pink-300"}\`;
          btn.style.left = flower.x + "%";
          btn.style.top = flower.y + "%";
          btn.innerText = flower.emoji || "🌸";
          
          btn.addEventListener("click", () => {
            openFlowerModal(flower);
          });
          flowersCanvas.appendChild(btn);
        });
      }

      // Flower Surprise Modal Logic
      const flowerModal = document.getElementById("flower-modal");
      function openFlowerModal(flower) {
        document.getElementById("modal-flower-emoji").innerText = flower.emoji || "🌸";
        document.getElementById("modal-flower-title").innerText = flower.title || "Surprise!";
        document.getElementById("modal-flower-message").innerText = flower.message || flower.content || "";
        
        // Image
        const imgCont = document.getElementById("modal-flower-image-container");
        const img = document.getElementById("modal-flower-image");
        if (flower.image) {
          img.src = flower.image;
          imgCont.classList.remove("hidden");
        } else {
          img.src = "";
          imgCont.classList.add("hidden");
        }

        // Video
        const vidCont = document.getElementById("modal-flower-video-container");
        const vid = document.getElementById("modal-flower-video");
        if (flower.video) {
          vid.src = flower.video;
          vidCont.classList.remove("hidden");
        } else {
          vid.src = "";
          vidCont.classList.add("hidden");
        }

        flowerModal.classList.remove("hidden");
        flowerModal.classList.add("flex");
      }

      document.getElementById("close-flower-modal").addEventListener("click", () => {
        flowerModal.classList.add("hidden");
        flowerModal.classList.remove("flex");
        // Pause any video playing inside the modal
        document.getElementById("modal-flower-video").pause();
      });

      // Envelope open letter logic
      const envelopeClosed = document.getElementById("envelope-closed");
      const envelopeOpen = document.getElementById("envelope-open");
      
      envelopeClosed.addEventListener("click", () => {
        envelopeClosed.classList.add("hidden");
        envelopeOpen.classList.remove("hidden");
        envelopeOpen.classList.add("fade-in");
        
        // Populate letter content
        const letterTextDiv = document.getElementById("letter-content-text");
        letterTextDiv.innerHTML = parseLetterText(data.letterText);
      });

      document.getElementById("close-letter-btn").addEventListener("click", () => {
        envelopeOpen.classList.add("hidden");
        envelopeClosed.classList.remove("hidden");
      });

      function parseLetterText(text) {
        if (!text) return "";
        let html = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        html = html.replace(/\\*\\*(.*?)\\*\\*/g, "<strong>$1</strong>");
        html = html.replace(/\\*(.*?)\\*/g, "<em>$1</em>");
        html = html.replace(/__(.*?)__/g, "<u>$1</u>");
        html = html.replace(/\\[center\\](.*?)\\[\\/center\\]/g, '<div class="text-center w-full">$1</div>');
        html = html.replace(/\\n/g, "<br />");
        
        return html;
      }

      // Render Photo Gallery
      const galleryGrid = document.getElementById("gallery-grid");
      if (data.photos && data.photos.length > 0) {
        data.photos.forEach((photo) => {
          const card = document.createElement("div");
          card.className = "bg-white p-3 pb-5 shadow-lg rounded-sm border border-gray-100 hover:scale-105 transition-transform cursor-pointer";
          
          card.innerHTML = \`
            <div class="aspect-[4/5] bg-gray-100 mb-3 overflow-hidden rounded-sm">
              <img src="\${photo.url}" alt="\${escapeHtml(photo.caption)}" class="w-full h-full object-cover">
            </div>
            <p class="font-sans text-center text-xs text-gray-600 italic truncate">\${escapeHtml(photo.caption)}</p>
          \`;

          card.addEventListener("click", () => {
            openPhotoLightbox(photo);
          });
          galleryGrid.appendChild(card);
        });
      } else {
        document.getElementById("gallery-section").classList.add("hidden");
      }

      // Photo Lightbox
      const photoLightbox = document.getElementById("photo-lightbox");
      const lightboxImg = document.getElementById("lightbox-image");
      const lightboxCaption = document.getElementById("lightbox-caption");

      function openPhotoLightbox(photo) {
        lightboxImg.src = photo.url;
        lightboxCaption.innerText = photo.caption;
        photoLightbox.classList.remove("hidden");
        photoLightbox.classList.add("flex");
      }

      document.getElementById("close-photo-lightbox").addEventListener("click", () => {
        photoLightbox.classList.add("hidden");
        photoLightbox.classList.remove("flex");
      });

      // Render Video Messages
      const videoGrid = document.getElementById("video-grid");
      if (data.videos && data.videos.length > 0) {
        data.videos.forEach((video) => {
          const card = document.createElement("div");
          card.className = "relative w-full sm:w-64 aspect-[9/16] rounded-2xl overflow-hidden shadow-xl cursor-pointer bg-gray-900 group hover:-translate-y-2 transition-transform";
          
          card.innerHTML = \`
            \${video.url ? \`
              <video src="\${video.url}" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"></video>
            \` : \`
              <img src="\${video.thumbnail}" alt="\${escapeHtml(video.title)}" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity">
            \`}
            <div class="absolute inset-0 flex flex-col justify-between p-4">
              <div class="flex justify-end">
                <span class="px-2 py-0.5 bg-black/40 backdrop-blur rounded text-white text-[10px]">Play</span>
              </div>
              <div class="flex flex-grow items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i data-lucide="play-circle" class="w-12 h-12 text-white"></i>
              </div>
              <h3 class="text-white font-semibold text-sm truncate">\${escapeHtml(video.title)}</h3>
            </div>
          \`;

          card.addEventListener("click", () => {
            openVideoLightbox(video);
          });
          videoGrid.appendChild(card);
        });
        lucide.createIcons();
      } else {
        document.getElementById("video-section").classList.add("hidden");
      }

      // Video Lightbox
      const videoLightbox = document.getElementById("video-lightbox");
      const lightboxVid = document.getElementById("lightbox-video");
      const lightboxVidTitle = document.getElementById("lightbox-video-title");

      function openVideoLightbox(video) {
        if (!video.url) return;
        lightboxVid.src = video.url;
        lightboxVidTitle.innerText = video.title;
        videoLightbox.classList.remove("hidden");
        videoLightbox.classList.add("flex");
        lightboxVid.play().catch(console.error);
      }

      document.getElementById("close-video-lightbox").addEventListener("click", () => {
        videoLightbox.classList.add("hidden");
        videoLightbox.classList.remove("flex");
        lightboxVid.pause();
        lightboxVid.src = "";
      });

      // Render Audio Clips
      const audioList = document.getElementById("audio-list");
      if (data.audioClips && data.audioClips.length > 0) {
        data.audioClips.forEach((audio) => {
          const item = document.createElement("div");
          item.className = "flex flex-col sm:flex-row items-center gap-4 bg-white p-5 rounded-3xl shadow-md border border-primary/10";
          item.innerHTML = \`
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
              <i data-lucide="mic" class="w-6 h-6"></i>
            </div>
            <div class="flex-1 w-full text-center sm:text-left">
              <h3 class="font-serif text-lg font-medium text-foreground mb-2">\${escapeHtml(audio.title)}</h3>
              <audio controls src="\${audio.url}" class="w-full"></audio>
            </div>
          \`;
          audioList.appendChild(item);
        });
        lucide.createIcons();
      } else {
        document.getElementById("audio-section").classList.add("hidden");
      }

      // Render Timeline Journey
      const timelineList = document.getElementById("timeline-list");
      if (data.timeline && data.timeline.length > 0) {
        data.timeline.forEach((milestone, idx) => {
          const item = document.createElement("div");
          const isEven = idx % 2 === 0;
          
          item.className = \`flex flex-col md:flex-row items-center gap-6 relative \${isEven ? "md:flex-row-reverse" : ""}\`;
          item.innerHTML = \`
            <div class="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-white shadow hidden md:block z-10"></div>
            <div class="w-full md:w-1/2 flex flex-col items-center text-center \${isEven ? "md:items-start md:text-left" : "md:items-end md:text-right"}\` +
              \` bg-white/40 p-5 rounded-2xl border border-primary/10 backdrop-blur-sm">
              <span class="text-primary font-bold text-xs tracking-wider uppercase mb-1">\${escapeHtml(milestone.date)}</span>
              <h3 class="font-serif text-xl font-bold mb-2 text-foreground">\${escapeHtml(milestone.title)}</h3>
              <p class="text-sm text-foreground/75 max-w-md">\${escapeHtml(milestone.description)}</p>
            </div>
            <div class="w-full md:w-1/2 flex justify-center \${isEven ? "md:justify-end" : "md:justify-start"}">
              <div class="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-lg border-4 border-white">
                <img src="\${milestone.image}" alt="\${escapeHtml(milestone.title)}" class="w-full h-full object-cover">
              </div>
            </div>
          \`;
          timelineList.appendChild(item);
        });
      } else {
        document.getElementById("timeline-section").classList.add("hidden");
      }

      // Final Love Reveal Confetti
      document.getElementById("surprise-heart-btn").addEventListener("click", () => {
        document.getElementById("final-surprise-box").classList.add("hidden");
        const reveal = document.getElementById("final-love-reveal");
        reveal.classList.remove("hidden");
        reveal.classList.add("fade-in");

        // Confetti burst
        const duration = 4000;
        const end = Date.now() + duration;

        (function frame() {
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
        }());
      });

      // Escape HTML helper
      function escapeHtml(str) {
        if (!str) return "";
        return str.replace(/[&<>"']/g, (m) => {
          switch (m) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#039;';
            default: return m;
          }
        });
      }
    });
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#039;";
      default: return m;
    }
  });
}
