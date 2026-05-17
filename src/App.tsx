import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Maximize2, 
  X,
  Heart,
  Share2,
  Info,
  Download,
  Menu,
  Languages,
  Moon,
  Sun,
  ArrowUpDown
} from 'lucide-react';

const PHOTOS = [
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619885/foto1_i3ftiq.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619886/foto2_zw5y2d.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619897/foto3_lb3fhr.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619914/foto4_nsx0sm.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619929/foto5_nvduvv.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619936/foto7_wubv4o.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619937/foto8_sntkaq.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619897/foto28_tp9i71.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619884/foto11_hl6mqd.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619884/foto12_yrhhkp.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619884/foto13_p7kydj.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619884/foto15_w3xsnm.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619887/foto19_zn9oxc.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619913/foto38_qngn3j.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619915/foto41_phzjde.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619920/foto42_la9qwp.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619921/foto43_kcfq2e.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619923/foto46_jvrx6b.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619924/foto47_dbkpqz.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619930/foto52_cvenmq.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619908/foto34_errnoe.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619908/foto35_nfvzkq.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619909/foto36_ncdamp.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/f_auto,q_auto,w_1280/v1778619884/foto10_j7kkzs.jpg",
];

const VIDEOS = [
  "https://res.cloudinary.com/dlzivwcxc/video/upload/f_auto,q_auto/v1778620808/bg_ourtb1.mp4"
];

const SONG_URL = "https://res.cloudinary.com/dlzivwcxc/video/upload/v1778621312/lagu3_szjdw0.mp3";

// Helper to extract a nice title from a Cloudinary URL
const getTitleFromUrl = (url: string) => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const baseName = filename.split('_')[0]; // e.g., "foto3" or "bg"
  // Format "foto3" to "Foto 3"
  const formatted = baseName.replace(/([a-zA-Z]+)(\d+)/, '$1 $2');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const PHOTO_DATA = [
  ...PHOTOS.map((url, index) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const rawName = filename.split('_')[0];
    
    return {
      id: index,
      url,
      title: getTitleFromUrl(url),
      rawName,
      type: 'photo' as const,
      category: index % 3 === 0 ? 'Vacation' : (index % 3 === 1 ? 'Adventures' : 'Moments'),
      date: new Date(2025, 0, index + 1).toISOString()
    };
  }),
  ...VIDEOS.map((url, index) => {
    return {
      id: PHOTOS.length + index,
      url,
      title: "Boiboy Moment " + (index + 1),
      rawName: "video" + (index + 1),
      type: 'video' as const,
      category: index % 2 === 0 ? 'Moments' : 'Adventures',
      date: new Date(2025, 0, PHOTOS.length + index + 1).toISOString()
    };
  })
].sort((a, b) => {
  // We want a stable but mixed order
  const hashA = a.id * 1.618 % 1;
  const hashB = b.id * 1.618 % 1;
  return hashA - hashB;
});

const T = {
  all: "All Media",
  photos: "Photos",
  videos: "Videos",
  favorites: "Favorites",
  search: "Search by title or moment...",
  clear: "Clear",
  history: "Search History",
  welcomeTitle: "Exclusive Album Gallery",
  welcomeSubtitle: "A special album gallery to remember memories of being together and to relive the best moments.",
  explore: "Explore Now",
  aboutTitle: "About This Archive",
  aboutPara1: "This is a special album gallery to remember memories of being together and to relive the best moments.",
  aboutPara2: "Crafted with dedication for fans worldwide.",
  terms: "Terms of Use",
  privacy: "Privacy",
  theme: "Theme",
  sorting: "Sorting",
  newest: "Newest",
  oldest: "Oldest",
  light: "Light",
  dark: "Dark",
  download: "Download",
  share: "Share",
  close: "Close",
  noResults: "No media found",
  nowPlaying: "Playing Now",
  save: "SAVE MEDIA"
};

const VideoGridThumbnail = ({ photo, theme }: { photo: any, theme: 'dark' | 'light' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startHover = () => {
    setShowOverlay(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowOverlay(false);
    }, 1000);
    
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const endHover = () => {
    setShowOverlay(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className={`${theme === 'dark' ? 'bg-zinc-900' : 'bg-gray-100'} w-full h-full flex items-center justify-center relative overflow-hidden`}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
    >
      <video 
        ref={videoRef}
        src={photo.url} 
        className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'scale-110 opacity-100' : 'scale-100 opacity-60'}`}
        muted
        loop
        playsInline
      />
      <AnimatePresence>
        {showOverlay && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -10 }}
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          >
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
              {isPlaying ? (
                <Pause className="text-white/90 w-5 h-5 fill-white/90" />
              ) : (
                <Play className="text-white/90 w-5 h-5 fill-white/90 ml-0.5" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <Play className="text-white/40 w-10 h-10 transition-opacity duration-300" />
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('boiboy_search_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'photo' | 'video' | 'favorites'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<typeof PHOTO_DATA[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('boiboy_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [likedIds, setLikedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('boiboy_likes');
    return saved ? JSON.parse(saved) : [];
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    localStorage.setItem('boiboy_likes', JSON.stringify(likedIds));
  }, [likedIds]);

  useEffect(() => {
    localStorage.setItem('boiboy_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('boiboy_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Add to search history logic
  useEffect(() => {
    if (!searchTerm.trim()) return;

    const timer = setTimeout(() => {
      setSearchHistory(prev => {
        const filtered = prev.filter(item => item.toLowerCase() !== searchTerm.toLowerCase());
        const newHistory = [searchTerm, ...filtered].slice(0, 5);
        return newHistory;
      });
    }, 2000); // Wait for 2s of inactivity before saving to history

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Loading Timer and Progress
  useEffect(() => {
    const duration = 3000; // 3 seconds
    const interval = 50; // update every 50ms
    const totalSteps = duration / interval;
    const progressPerStep = 100 / totalSteps;

    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500); // Small buffer after 100%
          return 100;
        }
        return prev + progressPerStep;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const toggleLike = (id: number) => {
    setLikedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };


  // Handle automatic music pausing when video is active
  useEffect(() => {
    if (!audioRef.current) return;

    if (selectedPhoto?.type === 'video') {
      audioRef.current.pause();
    } else if (isPlaying && !showWelcome) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.log("Audio play deferred or interrupted:", e));
      }
    }
  }, [selectedPhoto, isPlaying, showWelcome]);

  const handleVideoEnd = () => {
    if (isPlaying && audioRef.current && selectedPhoto?.type === 'video') {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => console.log("Audio resume after video failed:", e));
      }
    }
  };

  const filteredPhotos = useMemo(() => {
    const term = searchTerm.toLowerCase().replace(/\s+/g, '');
    let filtered = PHOTO_DATA.filter(photo => {
      const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           photo.rawName.toLowerCase().includes(term) ||
                           photo.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' 
        ? true 
        : activeFilter === 'favorites' 
          ? likedIds.includes(photo.id)
          : photo.type === activeFilter;
      
      return matchesSearch && matchesFilter;
    });

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return filtered;
  }, [searchTerm, activeFilter, likedIds, sortBy]);

  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handlePhotoClick = (photo: typeof PHOTO_DATA[0]) => {
    setLoadingId(photo.id);
    // Short delay to show the blur effect on the grid photo
    setTimeout(() => {
      setSelectedPhoto(photo);
      setLoadingId(null);
    }, 300);
  };

  const handleStartApp = () => {
    setShowWelcome(false);
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio play blocked:", err));
      setIsPlaying(true);
    }
  };

  const handleDownload = async (photo: typeof PHOTO_DATA[0]) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const extension = photo.type === 'video' ? 'mp4' : 'jpg';
      link.download = `${photo.title}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(photo.url, '_blank');
    }
  };

  const handleShare = async (photo: typeof PHOTO_DATA[0]) => {
    const shareData = {
      title: photo.title,
      text: `Check out this memory from BoboiBoy MEMORIES: ${photo.title} ✨`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return; // User canceled, do nothing
        }
        console.error("Share failed", err);
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Clipboard fallback failed", err);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#fafafa] text-gray-900'} font-sans pb-32 overflow-hidden relative`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background Effects */}
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute w-[500px] h-[500px] rounded-full bg-white/5 blur-[120px]"
            />
            
            <div className="relative z-10 w-full max-w-xs px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <div className="inline-block relative mb-6">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-white/10 scale-150"
                  />
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl">
                    <Heart size={32} fill="white" className="text-white" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase italic">
                  Loading Moments
                </h2>
                <div className="flex justify-center gap-2 mt-4">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Progress Bar Container */}
              <div className="relative h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ ease: "linear" }}
                  className="absolute h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
              </div>
              
              <div className="mt-6 flex justify-between items-center text-[9px] text-white/40 font-black uppercase tracking-[0.3em]">
                <span>
                  {loadingProgress < 20 ? 'System Initialization' :
                   loadingProgress < 40 ? 'Loading Memories' :
                   loadingProgress < 60 ? 'Optimizing Assets' :
                   loadingProgress < 80 ? 'Connecting Security' :
                   'Ready to Explore'}
                </span>
                <span className="text-white">{Math.round(loadingProgress)}%</span>
              </div>
            </div>

            {/* Floating details */}
            <div className="absolute bottom-12 left-0 right-0 text-center">
              <p className="text-gray-500 text-[8px] uppercase tracking-[0.5em] font-black opacity-30">
                Crafting Memories • 2025 Edition
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Particles - Optimized for Mobile Performance */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.2 + 0.05,
              scale: Math.random() * 1 + 0.5
            }}
            animate={{
              x: [
                (Math.random() * 100) + "%",
                (Math.random() * 100) + "%",
              ],
              y: [
                (Math.random() * 100) + "%",
                (Math.random() * 100) + "%",
              ],
              opacity: [0.05, 0.2, 0.05],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ willChange: 'transform, opacity' }}
            className={`absolute w-[3px] h-[3px] rounded-full ${
              i % 5 === 0 ? 'bg-blue-500/30 shadow-[0_0_8px_rgba(59,130,246,0.2)]' : (theme === 'dark' ? 'bg-white/5' : 'bg-black/5')
            }`}
          />
        ))}
      </div>

      <audio ref={audioRef} src={SONG_URL} loop />

      {/* Welcome Popup */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center ${theme === 'dark' ? 'bg-[#111] text-white border border-white/5' : 'bg-white text-gray-900 border border-gray-100'}`}
            >
              <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-white/5 text-blue-400' : 'bg-blue-50 text-blue-500'} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <Info size={32} />
              </div>
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-black uppercase tracking-tighter mb-4"
                >
                  {T.welcomeTitle}
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-xs md:text-sm font-medium leading-relaxed max-w-md mx-auto mb-12 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}
                >
                  {T.welcomeSubtitle}
                </motion.p>
                <motion.button 
                  onClick={handleStartApp}
                  className={`px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95 ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'}`}
                >
                  {T.explore}
                </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`rounded-3xl p-8 max-w-md w-full shadow-2xl relative border ${theme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-white border-gray-100'}`}
            >
              <button 
                onClick={() => setShowAbout(false)}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
              </button>

              <div className="text-center mb-8">
                <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Heart size={32} fill={theme === 'dark' ? 'black' : 'white'} />
                </div>
                <h2 className={`text-2xl font-black italic tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{T.aboutTitle}</h2>
                <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Version 1.0.4</p>
              </div>

              <div className="space-y-6">
                <div className={`p-4 ${theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-600'} rounded-2xl text-sm leading-relaxed`}>
                  {T.aboutPara1} 
                </div>
                
                <div className="space-y-3">
                  {/* Sorting Toggle */}
                  <div className={`flex items-center justify-between p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <ArrowUpDown size={18} className="opacity-50" />
                      <span className={`text-[10px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{T.sorting}</span>
                    </div>
                    <div className={`flex ${theme === 'dark' ? 'bg-black/40' : 'bg-black/5'} rounded-lg p-1`}>
                      <button 
                        onClick={() => setSortBy('newest')}
                        className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${sortBy === 'newest' ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') : 'text-gray-500'}`}
                      >
                        {T.newest}
                      </button>
                      <button 
                        onClick={() => setSortBy('oldest')}
                        className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${sortBy === 'oldest' ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') : 'text-gray-500'}`}
                      >
                        {T.oldest}
                      </button>
                    </div>
                  </div>

                  {/* Theme Toggle */}
                  <div className={`flex items-center justify-between p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      {theme === 'dark' ? <Moon size={18} className="opacity-50" /> : <Sun size={18} className="opacity-50" />}
                      <span className={`text-[10px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{T.theme}</span>
                    </div>
                    <div className={`flex ${theme === 'dark' ? 'bg-black/40' : 'bg-black/5'} rounded-lg p-1`}>
                      <button 
                        onClick={() => setTheme('dark')}
                        className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${theme === 'dark' ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') : 'text-gray-500'}`}
                      >
                        {T.dark}
                      </button>
                      <button 
                        onClick={() => setTheme('light')}
                        className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${theme === 'light' ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') : 'text-gray-500'}`}
                      >
                        {T.light}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 pt-4">
                  <div className={`flex justify-between items-center p-3 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} rounded-xl transition-colors cursor-pointer group`}>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{T.terms}</span>
                    <Share2 size={16} className="text-gray-300 group-hover:text-current transition-colors" />
                  </div>
                  <div className={`flex justify-between items-center p-3 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'} rounded-xl transition-colors cursor-pointer group`}>
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{T.privacy}</span>
                    <Share2 size={16} className="text-gray-300 group-hover:text-current transition-colors" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowAbout(false)}
                className={`w-full mt-8 ${theme === 'dark' ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} py-4 rounded-2xl font-bold transition-colors active:scale-95`}
              >
                {T.close}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050505]/70' : 'bg-white/70'} backdrop-blur-lg border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-white' : 'bg-black'} rounded-2xl flex items-center justify-center shadow-lg`}>
              <Heart size={20} className={theme === 'dark' ? 'text-black' : 'text-white'} fill={theme === 'dark' ? 'black' : 'white'} />
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              BoboiBoy <span className="text-blue-500">MEMORIES</span>
            </motion.h1>
          </div>

          <div className="hidden md:flex relative flex-1 max-w-md mx-8 flex-col">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder={T.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-gray-100/50'} border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-black/5 transition-all text-sm outline-none`}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'}`}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {/* Search History Chips - Desktop */}
            <AnimatePresence>
              {searchHistory.length > 0 && !searchTerm && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 flex flex-wrap gap-2 px-2"
                >
                  {searchHistory.map((term, i) => (
                    <motion.button
                      key={term}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSearchTerm(term)}
                      className={`text-[10px] ${theme === 'dark' ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white' : 'bg-white border-gray-100 text-gray-500 hover:text-black'} px-3 py-1 rounded-full transition-all shadow-sm flex items-center gap-1 font-medium`}
                    >
                      <Search size={10} className="opacity-50" />
                      {term}
                    </motion.button>
                  ))}
                  <button 
                    onClick={() => setSearchHistory([])}
                    className="text-[8px] uppercase tracking-widest text-gray-300 hover:text-rose-500 transition-colors font-black ml-auto bg-transparent border-none cursor-pointer"
                  >
                    {T.clear}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <button 
                onClick={() => setSearchTerm(searchTerm === '' ? ' ' : '')} 
                className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Search size={20} />
              </button>
            </div>
            <button 
              onClick={() => setShowAbout(true)}
              className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar Expansion (Optional, for better UX) */}
        {searchTerm !== '' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="md:hidden mt-4 pb-2"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-black/5 transition-all text-sm outline-none ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-gray-100/50 text-gray-900'}`}
              />
              <button 
                 onClick={() => setSearchTerm('')}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search History Chips - Mobile */}
            <AnimatePresence>
              {searchHistory.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 flex flex-wrap gap-2"
                >
                  {searchHistory.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchTerm(term)}
                      className={`text-[10px] ${theme === 'dark' ? 'bg-white/5 border-white/10 text-gray-400 active:bg-white/10' : 'bg-white border-gray-100 text-gray-500 active:bg-gray-50'} border px-3 py-1.5 rounded-full font-medium flex items-center gap-1 shadow-sm`}
                    >
                      <Search size={10} />
                      {term}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Filter Tabs */}
        <div className="max-w-7xl mx-auto mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 px-6">
          {[
            { id: 'all', label: T.all },
            { id: 'photo', label: T.photos },
            { id: 'video', label: T.videos },
            { id: 'favorites', label: T.favorites }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === tab.id 
                ? (theme === 'dark' ? 'bg-white text-black shadow-[0_0_20px_white/10]' : 'bg-black text-white shadow-lg') + ' scale-105' 
                : (theme === 'dark' ? 'bg-white/5 text-gray-500 hover:text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200')
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence initial={false}>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`group relative ${theme === 'dark' ? 'bg-[#111]' : 'bg-white'} rounded-2xl overflow-hidden shadow-lg border ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}
              >
                <div 
                  className="aspect-square overflow-hidden cursor-pointer relative"
                  onClick={() => handlePhotoClick(photo)}
                >
                  {photo.type === 'photo' ? (
                    <motion.img 
                      src={photo.url} 
                      alt={photo.title}
                      loading="lazy"
                      animate={{ 
                        filter: loadingId === photo.id ? 'blur(8px)' : 'blur(0px)',
                        scale: loadingId === photo.id ? 0.98 : 1
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <VideoGridThumbnail photo={photo} theme={theme} />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="text-white w-8 h-8" />
                  </div>
                </div>
                
                <div className={`p-4 ${theme === 'dark' ? 'bg-[#111]' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'} truncate tracking-tight uppercase italic`}>{photo.title}</h3>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wide">{photo.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(photo.id);
                        }}
                        className={`transition-colors ${likedIds.includes(photo.id) ? 'text-rose-500' : 'text-gray-300 hover:text-rose-500'}`}
                      >
                        <Heart className="w-4 h-4" fill={likedIds.includes(photo.id) ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(photo);
                        }}
                        className="text-gray-300 hover:text-current transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-24">
            <h3 className={`text-xl font-black uppercase italic ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{T.noResults}</h3>
          </div>
        )}
      </main>

      {/* Floating Music Player Bar */}
      <motion.footer 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className={`fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-xl ${theme === 'dark' ? 'bg-[#111]/90' : 'bg-white/90'} backdrop-blur-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] border ${theme === 'dark' ? 'border-white/10' : 'border-white/50'} rounded-3xl px-4 py-3 z-20 flex items-center`}
      >
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-[2.5] md:flex-[1.5] min-w-0">
            <motion.div 
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className={`w-14 h-14 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-900'} relative overflow-hidden`}
            >
              {/* Vinyl lines */}
              <div className="absolute inset-0 rounded-full opacity-20 bg-[repeating-radial-gradient(circle,transparent,transparent_2px,#fff_3px)]" />
              <div className={`w-4 h-4 ${theme === 'dark' ? 'bg-black' : 'bg-gray-800'} rounded-full z-10 border border-gray-700 flex items-center justify-center`}>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
              </div>
            </motion.div>
            <div className="flex-grow min-w-0 overflow-hidden">
              <div className="flex items-center gap-2">
                {isPlaying && (
                  <div className="flex items-center gap-[2px] h-3">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: ['40%', '100%', '40%'] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                        className={`w-0.5 ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'} rounded-full`}
                      />
                    ))}
                  </div>
                )}
                <div className="whitespace-nowrap overflow-hidden mask-fade">
                  <div className="whitespace-nowrap inline-block animate-marquee">
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} pr-12`}>Taylor Swift - The Fate Of Ophelia</span>
                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} pr-12`}>Taylor Swift - The Fate Of Ophelia</span>
                  </div>
                </div>
              </div>
              <p className={`text-[9px] uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} font-black`}>{T.nowPlaying}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1 hidden md:flex">
            <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-current transition-colors"><SkipBack size={20} /></button>
              <button 
                onClick={togglePlay}
                className={`w-10 h-10 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} rounded-full flex items-center justify-center hover:scale-105 transition-transform`}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              <button className="text-gray-400 hover:text-current transition-colors"><SkipForward size={20} /></button>
            </div>
            <div className={`w-full max-w-sm h-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'} rounded-full overflow-hidden`}>
              <motion.div 
                className={`h-full ${theme === 'dark' ? 'bg-white' : 'bg-black'}`}
                animate={{ width: isPlaying ? '100%' : '20%' }}
                transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 flex-shrink-0">
            <button 
              onClick={() => setActiveFilter(activeFilter === 'favorites' ? 'all' : 'favorites')}
              className={`transition-colors hidden sm:block ${activeFilter === 'favorites' ? 'text-rose-500 scale-110' : 'text-gray-400 hover:text-rose-500'}`}
            >
              <Heart size={20} fill={activeFilter === 'favorites' ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={() => handleShare(selectedPhoto || PHOTO_DATA[0])}
              className="text-gray-400 hover:text-current transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </motion.footer>

      {/* Lightbox / Detail View */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-black overflow-hidden"
          >
            {/* Ambient Background Glow (Simplified for performance) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              <motion.img 
                src={selectedPhoto.url} 
                className="w-full h-full object-cover blur-[60px]"
                style={{ transform: 'scale(1.2)' }}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Top Bar Viewer - Frosted Glass (Flex-none to keep height) */}
            <motion.div 
              initial={{ y: -70 }}
              animate={{ y: 0 }}
              className="flex-none bg-black/40 backdrop-blur-3xl border-b border-white/10 flex items-center justify-between px-6 py-5 z-20 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleLike(selectedPhoto.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 ${
                    likedIds.includes(selectedPhoto.id) 
                    ? 'bg-rose-500 border-rose-400' 
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <Heart size={18} className="text-white" fill={likedIds.includes(selectedPhoto.id) ? "white" : "none"} />
                </button>
                <div className="text-white">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500/80">BoboiBoy memories</p>
                  <p className="text-sm font-black tracking-tight drop-shadow-sm">{selectedPhoto.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full transition-all active:scale-90 border border-white/20"
              >
                <X size={22} strokeWidth={3} />
              </button>
            </motion.div>
            
            {/* Main Image Container - Locked Size for Consistency */}
            <div className="flex-grow flex items-center justify-center p-4 md:p-8 z-10 overflow-hidden relative">
              <div className="relative w-full max-w-4xl aspect-[4/5] md:aspect-[16/10] bg-black/20 rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5">
                {selectedPhoto.type === 'photo' ? (
                  <motion.img 
                    layoutId={selectedPhoto.id.toString()}
                    src={selectedPhoto.url} 
                    alt={selectedPhoto.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <motion.video 
                    layoutId={selectedPhoto.id.toString()}
                    src={selectedPhoto.url} 
                    className="w-full h-full object-contain bg-black"
                    preload="auto"
                    onPlay={() => audioRef.current?.pause()}
                    onEnded={handleVideoEnd}
                    controls
                    playsInline
                  />
                )}
                
                {/* Decorative vignette for the locked frame */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
            
            {/* Bottom Info Bar Viewer - Frosted Glass (Flex-none to keep height) */}
            <motion.div 
              initial={{ y: 70 }}
              animate={{ y: 0 }}
              className="flex-none bg-black/40 backdrop-blur-3xl border-t border-white/10 text-center text-white px-8 py-8 md:py-10 z-20 shadow-[-10px_0_50px_rgba(0,0,0,0.5)]"
            >
              <h2 className="text-2xl font-black tracking-widest uppercase italic">{selectedPhoto.title}</h2>
              <p className="text-[10px] text-white/40 mt-1 font-black uppercase tracking-[0.5em]">{selectedPhoto.category} • 2025 MEMORIES</p>
              
              <div className="mt-8 flex items-center justify-center gap-5">
                <button 
                  onClick={() => handleDownload(selectedPhoto)}
                  className="px-8 md:px-10 py-3 md:py-4 bg-white text-black hover:bg-gray-100 transition-all rounded-2xl flex items-center gap-3 text-xs font-black shadow-2xl active:scale-95 group"
                >
                  <Download size={18} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform" /> 
                  {T.save}
                </button>
                <button 
                  onClick={() => toggleLike(selectedPhoto.id)}
                  className={`w-12 h-12 bg-white/10 hover:bg-white/20 transition-all rounded-2xl flex items-center justify-center border group ${
                    likedIds.includes(selectedPhoto.id) ? 'border-rose-500 bg-rose-500/20' : 'border-white/10'
                  }`}
                >
                  <Heart 
                    size={20} 
                    className={`transition-colors ${likedIds.includes(selectedPhoto.id) ? 'text-rose-500' : 'text-white'}`} 
                    fill={likedIds.includes(selectedPhoto.id) ? "currentColor" : "none"}
                  />
                </button>
                <button 
                  onClick={() => handleShare(selectedPhoto)}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 transition-all rounded-2xl flex items-center justify-center border border-white/10 group"
                >
                  <Share2 size={20} className="text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
