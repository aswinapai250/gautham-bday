import LZString from "lz-string";

export function encodeDataToURL(data: any): string {
  const jsonString = JSON.stringify(data);
  return LZString.compressToEncodedURIComponent(jsonString);
}

export function decodeDataFromURL(encodedData: string): any | null {
  try {
    const jsonString = LZString.decompressFromEncodedURIComponent(encodedData);
    if (!jsonString) return null;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to decode data:", error);
    return null;
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
}

export function compressImage(file: File, maxWidth = 1000, maxHeight = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
    };

    video.onloadeddata = () => {
      // Seek to 1 second or halfway through to grab a frame
      video.currentTime = Math.min(1, video.duration / 2 || 0.5);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        const scale = 0.5; // smaller for thumbnail
        canvas.width = (video.videoWidth || 360) * scale;
        canvas.height = (video.videoHeight || 640) * scale;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          cleanup();
          resolve(dataUrl);
        } else {
          cleanup();
          resolve("");
        }
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = (err) => {
      cleanup();
      reject(err);
    };
  });
}

export function validateFile(file: File, type: "image" | "video" | "audio"): { valid: boolean; error?: string } {
  const fileType = file.type.toLowerCase();
  const fileSizeMB = file.size / (1024 * 1024);

  if (type === "image") {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(fileType)) {
      return { valid: false, error: "Only JPEG, PNG, and WEBP images are allowed." };
    }
    if (fileSizeMB > 10) {
      return { valid: false, error: "Image size exceeds 10MB limit." };
    }
  } else if (type === "video") {
    const allowed = ["video/mp4", "video/webm", "video/quicktime"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const isMov = ext === ".mov" || fileType === "video/quicktime";
    if (!allowed.includes(fileType) && !isMov) {
      return { valid: false, error: "Only MP4, WEBM, and MOV videos are allowed." };
    }
    if (fileSizeMB > 50) {
      return { valid: false, error: "Video size exceeds 50MB limit." };
    }
  } else if (type === "audio") {
    const allowed = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp3", "audio/mp4", "audio/m4a", "audio/x-m4a"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    const validExtension = [".mp3", ".wav", ".m4a"].includes(ext);
    
    if (!allowed.includes(fileType) && !validExtension) {
      return { valid: false, error: "Only MP3, WAV, and M4A audio files are allowed." };
    }
    if (fileSizeMB > 10) {
      return { valid: false, error: "Audio size exceeds 10MB limit." };
    }
  }

  return { valid: true };
}

