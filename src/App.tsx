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
  Menu
} from 'lucide-react';

const PHOTOS = [
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619885/foto1_i3ftiq.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619886/foto2_zw5y2d.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619897/foto3_lb3fhr.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619914/foto4_nsx0sm.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619929/foto5_nvduvv.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619936/foto7_wubv4o.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619937/foto8_sntkaq.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619897/foto28_tp9i71.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619884/foto11_hl6mqd.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619884/foto12_yrhhkp.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619884/foto13_p7kydj.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619884/foto15_w3xsnm.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619887/foto19_zn9oxc.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619913/foto38_qngn3j.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619915/foto41_phzjde.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619920/foto42_la9qwp.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619921/foto43_kcfq2e.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619923/foto46_jvrx6b.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619924/foto47_dbkpqz.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619930/foto52_cvenmq.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619908/foto34_errnoe.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619908/foto35_nfvzkq.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619909/foto36_ncdamp.jpg",
  "https://res.cloudinary.com/dlzivwcxc/image/upload/v1778619884/foto10_j7kkzs.jpg",
];

const VIDEOS = [
  "https://res.cloudinary.com/dlzivwcxc/video/upload/v1778620808/bg_ourtb1.mp4"
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
      category: index % 2 === 0 ? 'Vacation' : 'Moments'
    };
  }),
  ...VIDEOS.map((url, index) => {
    return {
      id: PHOTOS.length + index,
      url,
      title: "BoboiBoy Video " + (index + 1),
      rawName: "video" + (index + 1),
      type: 'video' as const,
      category: 'Moments'
    };
  })
];

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
    if (audioRef.current) {
      if (selectedPhoto?.type === 'video') {
        audioRef.current.pause();
      } else if (isPlaying && !showWelcome) {
        audioRef.current.play().catch(e => console.log("Audio play deferred:", e));
      }
    }
  }, [selectedPhoto, isPlaying, showWelcome]);

  const handleVideoEnd = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  };

  const filteredPhotos = useMemo(() => {
    const term = searchTerm.toLowerCase().replace(/\s+/g, '');
    return PHOTO_DATA.filter(photo => {
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
  }, [searchTerm, activeFilter]);

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

  const handleShareWhatsApp = (title: string) => {
    const message = `Check out this memory from BoboiBoy MEMORIES: ${title} ✨\n\nView the full collection here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
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
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-900 pb-32 overflow-hidden relative">
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
                  Loading BoboiBoy
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

      {/* Background Particles - High Density & Dynamic Visibility */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.3 + 0.1,
              scale: Math.random() * 1.2 + 0.5
            }}
            animate={{
              x: [
                (Math.random() * 120 - 10) + "%",
                (Math.random() * 120 - 10) + "%",
                (Math.random() * 120 - 10) + "%"
              ],
              y: [
                (Math.random() * 120 - 10) + "%",
                (Math.random() * 120 - 10) + "%",
                (Math.random() * 120 - 10) + "%"
              ],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute w-[4px] h-[4px] rounded-full blur-[0.5px] ${
              i % 5 === 0 ? 'bg-blue-400/60 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-black/30'
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
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Info size={32} />
              </div>
              <h2 className="text-xl font-bold mb-2">Welcome to Your Album</h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                To download any photo, simply click to expand it, then right-click and select "Save image as..." 
              </p>
              <button 
                onClick={handleStartApp}
                className="w-full bg-black text-white py-4 rounded-2xl font-medium hover:bg-gray-800 transition-colors active:scale-95"
              >
                Close
              </button>
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
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowAbout(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart size={32} fill="white" />
                </div>
                <h2 className="text-2xl font-black italic tracking-tight">About BoboiBoy MEMORIES</h2>
                <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">Version 1.0.4</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl text-sm text-gray-600 leading-relaxed">
                  BoboiBoy MEMORIES is a premium digital gallery experience designed to showcase high-quality imagery with a refined, interactive interface. 
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                    <span className="text-sm font-medium">Terms of Use</span>
                    <Share2 size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                  </div>
                  <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                    <span className="text-sm font-medium">Privacy Policy</span>
                    <Share2 size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowAbout(false)}
                className="w-full mt-8 bg-gray-100 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors active:scale-95"
              >
                Close Menu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [-10, 10, -10],
                y: [-5, 5, -5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -inset-4 bg-blue-400/30 blur-2xl rounded-full z-0 pointer-events-none"
            />
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 text-2xl font-black tracking-tighter bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 bg-[length:200%_auto] animate-gradient-text bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(37,99,235,0.4)]"
            >
              BoboiBoy MEMORIES
            </motion.h1>
          </div>

          <div className="hidden md:flex relative flex-1 max-w-md mx-8 flex-col">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by title or moment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100/50 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-black/5 transition-all text-sm outline-none"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
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
                      className="text-[10px] bg-white border border-gray-100 px-3 py-1 rounded-full text-gray-500 hover:bg-gray-50 hover:text-black transition-all shadow-sm flex items-center gap-1 font-medium"
                    >
                      <Search size={10} className="opacity-50" />
                      {term}
                    </motion.button>
                  ))}
                  <button 
                    onClick={() => setSearchHistory([])}
                    className="text-[8px] uppercase tracking-widest text-gray-300 hover:text-rose-500 transition-colors font-black ml-auto"
                  >
                    Clear
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <div className="md:hidden">
              <button 
                onClick={() => setSearchTerm(searchTerm === '' ? ' ' : '')} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search size={20} className="text-gray-600" />
              </button>
            </div>
            <button 
              onClick={() => setShowAbout(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu size={24} className="text-gray-900" />
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
                className="w-full bg-gray-100/50 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-black/5 transition-all text-sm outline-none"
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
                      className="text-[10px] bg-white border border-gray-100 px-3 py-1.5 rounded-full text-gray-500 font-medium flex items-center gap-1 active:bg-gray-50 shadow-sm"
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
        <div className="max-w-7xl mx-auto mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'all', label: 'All Media' },
            { id: 'photo', label: 'Photos' },
            { id: 'video', label: 'Videos' },
            { id: 'favorites', label: 'Favorites' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                activeFilter === tab.id 
                ? 'bg-black text-white shadow-lg scale-105' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {tab.id === 'favorites' && <Heart size={12} fill={activeFilter === 'favorites' ? "white" : "none"} />}
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)] transition-all duration-300 border border-gray-100"
              >
                <div 
                  className="aspect-square overflow-hidden cursor-pointer relative"
                  onClick={() => handlePhotoClick(photo)}
                >
                  {photo.type === 'photo' ? (
                    <motion.img 
                      src={photo.url} 
                      alt={photo.title}
                      animate={{ 
                        filter: loadingId === photo.id ? 'blur(12px)' : 'blur(0px)',
                        scale: loadingId === photo.id ? 0.95 : 1
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                      <video 
                        src={photo.url} 
                        className="w-full h-full object-cover opacity-60"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                          <Play className="text-white w-6 h-6 fill-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 className="text-white w-8 h-8" />
                  </div>
                </div>
                
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <h3 className="font-black text-sm text-gray-900 truncate tracking-tight">{photo.title}</h3>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wide">{photo.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-0.5 bg-gray-100 rounded text-[8px] font-black uppercase tracking-tighter text-gray-500">
                        {photo.type}
                      </div>
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
                        className="text-gray-300 hover:text-black transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareWhatsApp(photo.title);
                        }}
                        className="text-gray-300 hover:text-black transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-400">No photos found matching your search.</p>
          </div>
        )}
      </main>

      {/* Music Player Bar */}
      <motion.footer 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-xl bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 rounded-3xl px-4 py-3 z-20 flex items-center"
      >
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-[2.5] md:flex-[1.5] min-w-0">
            <motion.div 
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className={`w-14 h-14 bg-black rounded-full flex-shrink-0 flex items-center justify-center shadow-lg border-4 border-gray-900 relative overflow-hidden`}
            >
              {/* Vinyl lines */}
              <div className="absolute inset-0 rounded-full opacity-20 bg-[repeating-radial-gradient(circle,transparent,transparent_2px,#fff_3px)]" />
              <div className="w-4 h-4 bg-gray-800 rounded-full z-10 border border-gray-700 flex items-center justify-center">
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
                        className="w-0.5 bg-blue-500 rounded-full"
                      />
                    ))}
                  </div>
                )}
                <div className="whitespace-nowrap overflow-hidden mask-fade">
                  <div className="whitespace-nowrap inline-block animate-marquee">
                    <span className="text-sm font-bold text-gray-900 pr-12">Taylor Swift - The Fate Of Ophelia</span>
                    <span className="text-sm font-bold text-gray-900 pr-12">Taylor Swift - The Fate Of Ophelia</span>
                  </div>
                </div>
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-blue-500 font-black">Playing Now</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1 hidden md:flex">
            <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-black transition-colors"><SkipBack size={20} /></button>
              <button 
                onClick={togglePlay}
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              <button className="text-gray-400 hover:text-black transition-colors"><SkipForward size={20} /></button>
            </div>
            <div className="w-full max-w-sm h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-black"
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
              onClick={() => handleShareWhatsApp("My Favorite Memories")}
              className="text-gray-400 hover:text-black transition-colors"
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
            {/* Ambient Background Glow (Gives the bars something to blur) */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <motion.img 
                src={selectedPhoto.url} 
                className="w-full h-full object-cover blur-[100px] scale-150"
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
                    className="w-full h-full object-cover"
                    autoPlay
                    loop={false}
                    onPlay={() => audioRef.current?.pause()}
                    onPause={() => isPlaying && audioRef.current?.play()}
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
                  SAVE MEDIA
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
                  onClick={() => handleShareWhatsApp(selectedPhoto.title)}
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
