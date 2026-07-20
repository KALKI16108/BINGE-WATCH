import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Settings, FileVideo, Globe, Loader, Search, Sparkles, Film } from "lucide-react";
import { VideoState, AnimeTitle } from "../types";
import { animeSeriesData, Episode } from "../data/animeEpisodes";

interface VideoPlayerProps {
  roomId: string;
  peerId: string;
  peerName: string;
  videoState: VideoState;
  onUpdateVideoState: (updates: Partial<VideoState>) => void;
  animeList: AnimeTitle[];
}

export default function VideoPlayer({
  roomId,
  peerId,
  peerName,
  videoState,
  onUpdateVideoState,
  animeList
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [localVideoFile, setLocalVideoFile] = useState<File | null>(null);
  const [localVideoUrl, setLocalVideoUrl] = useState<string>("");
  const [customInputUrl, setCustomInputUrl] = useState<string>("");
  const [showCustomUrlInput, setShowCustomUrlInput] = useState<boolean>(false);
  const [showFreeStreamingGuide, setShowFreeStreamingGuide] = useState<boolean>(false);

  // Modern Series Episode Finder states
  const [activeCatalogTab, setActiveCatalogTab] = useState<"retro" | "solo-leveling" | "attack-on-titan">("retro");
  const [selectedSeasonNum, setSelectedSeasonNum] = useState<number>(1);
  const [episodeSearchQuery, setEpisodeSearchQuery] = useState<string>("");
  const [languageMode, setLanguageMode] = useState<"sub" | "dub">("sub");
  const [activeEpisode, setActiveEpisode] = useState<{
    seriesTitle: string;
    seasonTitle: string;
    episode: Episode;
  } | null>(null);

  // UI States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string>("In Sync 💕");
  const [syncMessage, setSyncMessage] = useState<string>("");

  const lastProcessedSeq = useRef<number>(-1);
  const isLocalAction = useRef<boolean>(false);
  const ignoreSyncTimeout = useRef<NodeJS.Timeout | null>(null);

  // Track state from server and apply to HTML5 Video Element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const serverSeq = videoState.actionSeq;

    // Only apply if the sequence number is newer than what we last processed
    if (serverSeq > lastProcessedSeq.current) {
      // If we are the sender, skip applying (we already did it locally!)
      if (videoState.senderId === peerId) {
        lastProcessedSeq.current = serverSeq;
        return;
      }

      console.log(`Applying server action ${videoState.lastAction} (seq: ${serverSeq})`);
      lastProcessedSeq.current = serverSeq;

      // Temporarily set a flag so our own event listeners don't report this as a "user action"
      isLocalAction.current = false;

      // Handle custom/curated URLs or local file updates if URL changed
      // Note: For local files, they must have the file selected locally, we can't sync the actual file bytes over HTTP signaling, but we sync state.
      
      // Update playback speed
      if (video.playbackRate !== videoState.playbackSpeed) {
        video.playbackRate = videoState.playbackSpeed;
        setPlaybackSpeed(videoState.playbackSpeed);
      }

      // Handle seeking
      const diff = Math.abs(video.currentTime - videoState.currentTime);
      if (diff > 1.5) {
        video.currentTime = videoState.currentTime;
        setCurrentTime(videoState.currentTime);
      }

      // Handle play/pause
      if (videoState.isPlaying && video.paused) {
        video.play().catch((e) => console.log("Play failed", e));
        setIsPlaying(true);
        showTemporarySyncMsg(`Partner played the video 🌸`);
      } else if (!videoState.isPlaying && !video.paused) {
        video.pause();
        setIsPlaying(false);
        showTemporarySyncMsg(`Partner paused the video ⏸️`);
      }

      if (videoState.lastAction === "seek" && videoState.senderId !== "system") {
        showTemporarySyncMsg(`Synced to ${formatTime(videoState.currentTime)} ✨`);
      }
    }
  }, [videoState, peerId]);

  // Show status messages
  function showTemporarySyncMsg(msg: string) {
    setSyncMessage(msg);
    const timer = setTimeout(() => {
      setSyncMessage("");
    }, 4000);
    return () => clearTimeout(timer);
  }

  // Trigger state change updates to the server
  function sendVideoUpdate(action: "play" | "pause" | "seek" | "load", time: number, forceSpeed?: number) {
    // Lock incoming sync processing briefly
    isLocalAction.current = true;
    if (ignoreSyncTimeout.current) clearTimeout(ignoreSyncTimeout.current);
    ignoreSyncTimeout.current = setTimeout(() => {
      isLocalAction.current = false;
    }, 1200);

    const nextSeq = videoState.actionSeq + 1;
    lastProcessedSeq.current = nextSeq;

    onUpdateVideoState({
      videoId: videoState.videoId,
      videoUrl: videoState.videoUrl,
      videoTitle: videoState.videoTitle,
      isPlaying: action === "play" ? true : action === "pause" ? false : isPlaying,
      currentTime: time,
      playbackSpeed: forceSpeed !== undefined ? forceSpeed : playbackSpeed,
      actionSeq: nextSeq,
      lastAction: action,
      senderId: peerId
    });
  }

  // Video Event Handlers
  const handlePlay = () => {
    if (isLocalAction.current) return;
    setIsPlaying(true);
    const video = videoRef.current;
    if (video) {
      sendVideoUpdate("play", video.currentTime);
    }
  };

  const handlePause = () => {
    if (isLocalAction.current) return;
    setIsPlaying(false);
    const video = videoRef.current;
    if (video) {
      sendVideoUpdate("pause", video.currentTime);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleDurationChange = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const targetTime = parseFloat(e.target.value);
    video.currentTime = targetTime;
    setCurrentTime(targetTime);
    sendVideoUpdate("seek", targetTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const targetVol = parseFloat(e.target.value);
    video.volume = targetVol;
    setVolume(targetVol);
    setIsMuted(targetVol === 0);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
      sendVideoUpdate("play", video.currentTime);
    } else {
      video.pause();
      setIsPlaying(false);
      sendVideoUpdate("pause", video.currentTime);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
    sendVideoUpdate("seek", video.currentTime, speed);
    showTemporarySyncMsg(`Playback speed set to ${speed}x ⚡`);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  // Switch to a curated anime video
  const selectAnime = (anime: AnimeTitle) => {
    setLocalVideoFile(null);
    setLocalVideoUrl("");
    
    // Set video source
    const video = videoRef.current;
    if (video) {
      video.src = anime.url;
      video.load();
      video.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }

    const nextSeq = videoState.actionSeq + 1;
    lastProcessedSeq.current = nextSeq;

    onUpdateVideoState({
      videoId: anime.id,
      videoUrl: anime.url,
      videoTitle: anime.title,
      isPlaying: false,
      currentTime: 0,
      playbackSpeed: 1.0,
      actionSeq: nextSeq,
      lastAction: "load",
      senderId: peerId
    });

    showTemporarySyncMsg(`Loaded: ${anime.title} 🌸`);
  };

  // Switch to an episode of Solo Leveling or Attack on Titan
  const selectEpisode = (seriesTitle: string, seasonTitle: string, episode: Episode, forcedLanguage?: "sub" | "dub") => {
    setLocalVideoFile(null);
    setLocalVideoUrl("");

    const currentLang = forcedLanguage || languageMode;
    const targetUrl = (currentLang === "dub" && episode.dubUrl) ? episode.dubUrl : (episode.subUrl || episode.previewUrl);
    
    // Save as active episode for quick language toggles
    setActiveEpisode({ seriesTitle, seasonTitle, episode });

    const displayTitle = `${seriesTitle} - ${seasonTitle} Ep ${episode.episodeNumber}: ${episode.title} (${currentLang === "dub" ? "Dubbed" : "Subbed"})`;
    
    // Set video source (use trailer / preview URL as the sync base)
    const video = videoRef.current;
    if (video) {
      video.src = targetUrl;
      video.load();
      video.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }

    const nextSeq = videoState.actionSeq + 1;
    lastProcessedSeq.current = nextSeq;

    onUpdateVideoState({
      videoId: `ep-${seriesTitle.toLowerCase().replace(/[^a-z0-9]/g, "")}-${seasonTitle.toLowerCase().replace(/[^a-z0-9]/g, "")}-e${episode.episodeNumber}-${currentLang}`,
      videoUrl: targetUrl,
      videoTitle: displayTitle,
      isPlaying: false,
      currentTime: 0,
      playbackSpeed: 1.0,
      actionSeq: nextSeq,
      lastAction: "load",
      senderId: peerId
    });

    showTemporarySyncMsg(`Loaded: Ep ${episode.episodeNumber} - ${episode.title} [${currentLang.toUpperCase()}] 🎬`);
  };

  // Switch the stream format for the room between SUB and DUB
  const handleLanguageChange = (lang: "sub" | "dub") => {
    setLanguageMode(lang);
    if (activeEpisode) {
      selectEpisode(activeEpisode.seriesTitle, activeEpisode.seasonTitle, activeEpisode.episode, lang);
    } else {
      showTemporarySyncMsg(`Audio preference switched to ${lang === "sub" ? "Japanese (Sub)" : "English (Dub)"} 🗣️`);
    }
  };

  // Load a custom video link (.mp4)
  const handleLoadCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputUrl) return;

    setLocalVideoFile(null);
    setLocalVideoUrl("");

    const video = videoRef.current;
    if (video) {
      video.src = customInputUrl;
      video.load();
      video.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }

    const nextSeq = videoState.actionSeq + 1;
    lastProcessedSeq.current = nextSeq;

    onUpdateVideoState({
      videoId: "custom-url",
      videoUrl: customInputUrl,
      videoTitle: "Custom Anime URL Link",
      isPlaying: false,
      currentTime: 0,
      playbackSpeed: 1.0,
      actionSeq: nextSeq,
      lastAction: "load",
      senderId: peerId
    });

    setShowCustomUrlInput(false);
    showTemporarySyncMsg(`Loaded custom anime URL! 🌐`);
  };

  // Load a local downloaded video file
  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setLocalVideoUrl(objectUrl);

    const video = videoRef.current;
    if (video) {
      video.src = objectUrl;
      video.load();
      video.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }

    // Since we can't send raw bytes, we notify the partner to select their own local file
    const nextSeq = videoState.actionSeq + 1;
    lastProcessedSeq.current = nextSeq;

    onUpdateVideoState({
      videoId: "local-file",
      videoUrl: "local",
      videoTitle: `Local File: ${file.name}`,
      isPlaying: false,
      currentTime: 0,
      playbackSpeed: 1.0,
      actionSeq: nextSeq,
      lastAction: "load",
      senderId: peerId
    });

    showTemporarySyncMsg(`Loaded local file! Ask partner to load the same file! 📁`);
  };

  // Helpers
  function formatTime(secs: number) {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  }

  // Detect current active video source title
  const currentTitle = videoState.videoTitle || "No anime loaded";

  // Match selected series and filter episodes
  const selectedSeries = activeCatalogTab === "solo-leveling" 
    ? animeSeriesData[0] 
    : activeCatalogTab === "attack-on-titan" 
      ? animeSeriesData[1] 
      : null;

  const activeSeason = selectedSeries?.seasons.find(s => s.seasonNumber === selectedSeasonNum) 
    || selectedSeries?.seasons[0];

  const filteredEpisodes = activeSeason?.episodes.filter(ep => {
    if (!episodeSearchQuery) return true;
    const query = episodeSearchQuery.toLowerCase();
    return ep.title.toLowerCase().includes(query) || ep.synopsis.toLowerCase().includes(query);
  }) || [];

  return (
    <div id="anime-theatre-player" className="w-full bg-black/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col backdrop-blur-md">
      {/* Synchronization Banner Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 pointer-events-none">
        <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-indigo-300 border border-white/5 flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          {syncStatus}
        </div>
        {syncMessage && (
          <div className="bg-indigo-950/90 text-white border border-indigo-500/30 text-xs px-3 py-1.5 rounded-xl backdrop-blur-md animate-bounce">
            {syncMessage}
          </div>
        )}
      </div>

      {/* Main Video Display Stage */}
      <div className="relative aspect-video group bg-black flex items-center justify-center overflow-hidden cursor-pointer" onClick={togglePlay}>
        {/* HTML5 video element */}
        <video
          ref={videoRef}
          src={localVideoUrl || videoState.videoUrl}
          className="w-full h-full object-contain"
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          preload="auto"
          playsInline
        />

        {/* Big play button overlay when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center transition-opacity pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-black ml-1 text-black" />
            </div>
          </div>
        )}

        {/* Video Controls bar (glowing glassmorphism) */}
        <div 
          className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex flex-col gap-3 z-30"
          onClick={(e) => e.stopPropagation()} // don't toggle play when clicking controls
        >
          {/* Progress Seek Bar */}
          <div className="flex items-center gap-3 w-full">
            <span className="text-xs font-mono text-gray-300">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 rounded-lg appearance-none bg-white/10 accent-indigo-500 cursor-pointer focus:outline-none hover:h-2 transition-all"
            />
            <span className="text-xs font-mono text-gray-300">{formatTime(duration)}</span>
          </div>

          {/* Action buttons controls row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause Button */}
              <button 
                id="player-play-btn"
                onClick={togglePlay} 
                className="text-white hover:text-indigo-400 transition-colors cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              {/* Loop/Restart */}
              <button
                id="player-restart-btn"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    setCurrentTime(0);
                    sendVideoUpdate("seek", 0);
                  }
                }}
                className="text-white hover:text-indigo-400 transition-colors cursor-pointer"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Volume Bar */}
              <div className="flex items-center gap-2">
                <button id="player-volume-btn" onClick={toggleMute} className="text-white hover:text-indigo-400 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 rounded-lg appearance-none bg-white/15 accent-indigo-400 cursor-pointer"
                />
              </div>

              {/* Currently playing Title Tag */}
              <span className="hidden md:inline-block text-xs text-indigo-300/95 font-medium max-w-xs truncate bg-indigo-950/40 px-2.5 py-1 rounded-md border border-indigo-500/10">
                🎬 {currentTitle}
              </span>
            </div>

            <div className="flex items-center gap-4 relative">
              {/* Language Toggle */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-0.5 flex items-center shrink-0">
                <button
                  id="btn-player-sub"
                  type="button"
                  onClick={() => handleLanguageChange("sub")}
                  className={`text-[9px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    languageMode === "sub"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Switch to Japanese Subbed"
                >
                  SUB
                </button>
                <button
                  id="btn-player-dub"
                  type="button"
                  onClick={() => handleLanguageChange("dub")}
                  className={`text-[9px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    languageMode === "dub"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                  title="Switch to English Dubbed"
                >
                  DUB
                </button>
              </div>

              {/* Playback speed trigger */}
              <button
                id="player-speed-btn"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-xs font-semibold text-slate-300 hover:text-white border border-white/10 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                {playbackSpeed}x
              </button>

              {/* Playback speed dropdown */}
              {showSpeedMenu && (
                <div className="absolute bottom-8 right-10 bg-black/90 border border-white/10 rounded-lg shadow-xl py-1 w-24 flex flex-col z-50 backdrop-blur-xl">
                  {[0.5, 1.0, 1.25, 1.5, 2.0].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => changeSpeed(speed)}
                      className={`text-xs text-left px-3 py-1.5 hover:bg-indigo-900/30 hover:text-indigo-300 ${playbackSpeed === speed ? "text-indigo-400 font-bold" : "text-slate-300"}`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}

              {/* Fullscreen Button */}
              <button id="player-fullscreen-btn" onClick={toggleFullscreen} className="text-white hover:text-indigo-400 transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Video Sourcing / Tray panel */}
      <div className="p-5 border-t border-white/5 bg-black/40 flex flex-col gap-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-indigo-400">✨</span> Choose Anime & Co-Watching Sources
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Sync is completely automatic. Try curated open anime or import yours!</p>
          </div>

          <div className="flex gap-2">
            <button
              id="btn-show-custom-url"
              onClick={() => setShowCustomUrlInput(!showCustomUrlInput)}
              className="text-xs flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              Stream URL
            </button>

            <label className="text-xs flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer">
              <FileVideo className="w-3.5 h-3.5 text-indigo-400" />
              Local File Sync
              <input type="file" accept="video/*" onChange={handleLocalFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Custom URL overlay input */}
        {showCustomUrlInput && (
          <form onSubmit={handleLoadCustomUrl} className="flex gap-2 bg-black/40 p-2 rounded-xl border border-white/10">
            <input
              type="url"
              placeholder="Paste a direct video link (.mp4, .webm)..."
              value={customInputUrl}
              onChange={(e) => setCustomInputUrl(e.target.value)}
              className="flex-1 text-xs bg-white/5 border border-white/10 text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
            <button
              id="submit-custom-url"
              type="submit"
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
            >
              Load Anime
            </button>
          </form>
        )}

        {/* Navigation Tabs for Anime Catalog */}
        <div className="flex border-b border-white/5 pb-2 mb-3 gap-1 overflow-x-auto scrollbar-none">
          <button
            id="tab-retro"
            type="button"
            onClick={() => {
              setActiveCatalogTab("retro");
              setSelectedSeasonNum(1);
            }}
            className={`text-xs px-4 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCatalogTab === "retro"
                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                : "text-slate-400 hover:text-slate-200 bg-white/5 border border-white/5"
            }`}
          >
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            Retro Classics
          </button>
          
          <button
            id="tab-solo-leveling"
            type="button"
            onClick={() => {
              setActiveCatalogTab("solo-leveling");
              setSelectedSeasonNum(1);
            }}
            className={`text-xs px-4 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCatalogTab === "solo-leveling"
                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                : "text-slate-400 hover:text-slate-200 bg-white/5 border border-white/5"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Solo Leveling (S1 & S2)
          </button>

          <button
            id="tab-aot"
            type="button"
            onClick={() => {
              setActiveCatalogTab("attack-on-titan");
              setSelectedSeasonNum(1);
            }}
            className={`text-xs px-4 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCatalogTab === "attack-on-titan"
                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                : "text-slate-400 hover:text-slate-200 bg-white/5 border border-white/5"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            Attack on Titan (All Ep)
          </button>
        </div>

        {activeCatalogTab === "retro" ? (
          /* Curated anime quick selectors cards (Original List) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-1">
            {animeList.map((anime) => (
              <button
                id={`anime-select-${anime.id}`}
                key={anime.id}
                onClick={() => selectAnime(anime)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer group relative flex flex-col justify-between ${
                  videoState.videoId === anime.id
                    ? "bg-indigo-950/20 border-indigo-500/40 text-indigo-200"
                    : "bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/10 text-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-semibold text-xs truncate max-w-[80%] group-hover:text-indigo-400 transition-colors">
                      {anime.title.split(" (")[0]}
                    </span>
                    <span className="text-[10px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                      {anime.duration}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {anime.description}
                  </p>
                </div>

                {videoState.videoId === anime.id && (
                  <div className="mt-2 text-[9px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                    </span>
                    Now Playing
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : selectedSeries ? (
          /* Modern Anime Series Episode Selector Hub */
          <div className="flex flex-col gap-3">
            {/* Header Series info block */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4">
              <img 
                src={selectedSeries.coverImage} 
                alt={selectedSeries.title} 
                referrerPolicy="no-referrer"
                className="w-full md:w-28 h-36 md:h-28 object-cover rounded-xl border border-white/10 shadow-lg shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      {selectedSeries.title}
                    </h4>
                    <div className="flex gap-1">
                      {selectedSeries.genres.map(genre => (
                        <span key={genre} className="text-[9px] bg-indigo-500/15 text-indigo-300 px-1.5 py-0.5 rounded-md font-medium border border-indigo-500/10">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {selectedSeries.description}
                  </p>
                </div>

                {/* Season Tabs for Series with multiple seasons */}
                {selectedSeries.seasons.length > 1 && (
                  <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
                    {selectedSeries.seasons.map((s) => (
                      <button
                        id={`btn-season-${s.seasonNumber}`}
                        key={s.seasonNumber}
                        type="button"
                        onClick={() => {
                          setSelectedSeasonNum(s.seasonNumber);
                          setEpisodeSearchQuery("");
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          selectedSeasonNum === s.seasonNumber
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]"
                            : "text-slate-400 hover:text-slate-200 bg-white/5 border border-white/5"
                        }`}
                      >
                        {s.seasonTitle}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={`Search in ${selectedSeries.title} ${activeSeason?.seasonTitle || "episodes"}...`}
                value={episodeSearchQuery}
                onChange={(e) => setEpisodeSearchQuery(e.target.value)}
                className="w-full text-xs bg-white/5 border border-white/10 text-slate-200 pl-9 pr-4 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
              />
              {episodeSearchQuery && (
                <button
                  type="button"
                  onClick={() => setEpisodeSearchQuery("")}
                  className="absolute right-3 top-2 text-[10px] bg-white/10 hover:bg-white/20 text-slate-300 px-1.5 py-0.5 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Episode Grid */}
            {filteredEpisodes.length === 0 ? (
              <div className="bg-white/5 border border-white/5 p-8 rounded-2xl text-center text-slate-400 text-xs">
                😭 No episodes found matching "{episodeSearchQuery}" in this season.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredEpisodes.map((ep) => {
                  const isPlayingThisEpisode = videoState.videoTitle.includes(`Ep ${ep.episodeNumber}: ${ep.title}`) || 
                                              (videoState.videoTitle.includes(selectedSeries.title) && videoState.videoTitle.includes(`Ep ${ep.episodeNumber}`));

                  return (
                    <div
                      id={`ep-card-${ep.episodeNumber}`}
                      key={ep.episodeNumber}
                      className={`p-3 rounded-xl border flex flex-col justify-between transition-all group ${
                        isPlayingThisEpisode
                          ? "bg-indigo-950/20 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.08)]"
                          : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs text-slate-200">
                            Episode {ep.episodeNumber}
                          </span>
                          <span className="text-[9px] bg-black/40 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                            {ep.duration}
                          </span>
                        </div>
                        <h5 className="font-semibold text-xs text-indigo-300 mt-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                          {ep.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {ep.synopsis}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2">
                        <button
                          id={`btn-watch-ep-${ep.episodeNumber}`}
                          type="button"
                          onClick={() => selectEpisode(selectedSeries.title, activeSeason?.seasonTitle || "Season 1", ep)}
                          className={`text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                            isPlayingThisEpisode
                              ? "bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                              : "bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/20"
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          {isPlayingThisEpisode ? "Now Playing" : "Co-Watch Ep"}
                        </button>

                        <a
                          href={`https://www.google.com/search?q=intitle%3A%22index+of%22+%22mp4%22+%22${encodeURIComponent(selectedSeries.title)}%22+%22Episode+${ep.episodeNumber}%22+${languageMode === "dub" ? "dub" : "sub"}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          referrerPolicy="no-referrer"
                          className="text-[9px] bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-2 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all shrink-0"
                          title={`Search for a direct-stream ${languageMode === "dub" ? "English Dubbed" : "Japanese Subtitled"} link on Google to load inside the box`}
                        >
                          <Globe className="w-2.5 h-2.5 text-indigo-400" />
                          Find {languageMode === "dub" ? "Dub" : "Sub"} Link
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        {/* Free Anime Streaming Finder Guide */}
        <div className="mt-2 pt-2 border-t border-white/5 flex flex-col gap-2">
          <button
            id="btn-toggle-stream-guide"
            type="button"
            onClick={() => setShowFreeStreamingGuide(!showFreeStreamingGuide)}
            className="w-full text-left text-xs text-indigo-300 hover:text-indigo-200 transition-colors flex items-center justify-between py-2 bg-indigo-950/20 px-3 rounded-xl border border-indigo-500/10 cursor-pointer"
          >
            <span className="flex items-center gap-1.5 font-semibold">
              💡 <span>Free Anime Direct Streaming Guide & Finder Tools (Click here!)</span>
            </span>
            <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-indigo-400 font-mono font-bold">
              {showFreeStreamingGuide ? "Hide" : "Show Help"}
            </span>
          </button>

          {showFreeStreamingGuide && (
            <div className="bg-black/50 border border-white/5 p-4 rounded-xl flex flex-col gap-3 animate-fade-in text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-indigo-300 flex items-center gap-1">
                <span>🎥</span> How to stream *literally any anime* for free together:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex flex-col gap-1">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="text-indigo-400">1.</span> Direct Video URL Method
                  </span>
                  <p className="text-[11px] text-slate-400">
                    If you have a direct video link ending in <span className="font-mono text-indigo-300">.mp4</span>, <span className="font-mono text-indigo-300">.webm</span>, or <span className="font-mono text-indigo-300">.m3u8</span> from any free online library, paste it in <strong>Stream URL</strong> and load it!
                  </p>
                  <p className="text-[10px] text-slate-500 italic mt-1">
                    Tip: You can upload your offline episode files to Google Drive, Dropbox, or Discord and copy the raw link!
                  </p>
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex flex-col gap-1">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="text-rose-400">2.</span> Free Unlimited Local Sync
                  </span>
                  <p className="text-[11px] text-slate-400">
                    If you have downloaded files on your device, use <strong>Local File Sync</strong>!
                  </p>
                  <p className="text-[10px] text-indigo-300 font-medium mt-1">
                    Once you and your partner load the same local file, our room synchronizes everything completely free with ZERO lag or buffering!
                  </p>
                </div>
              </div>

              {/* Free Anime Sites and Search Helpers */}
              <div className="bg-indigo-950/20 p-3 rounded-lg border border-indigo-500/10 flex flex-col gap-2">
                <span className="font-semibold text-indigo-300 flex items-center gap-1">
                  <span>🔍</span> Curated Free Search Engines:
                </span>
                <p className="text-[11px] text-slate-400">
                  Many legal databases (like <strong>Archive.org</strong>) host thousands of anime episodes streamable as direct MP4s. Click below to explore:
                </p>
                
                <div className="flex flex-wrap gap-2 mt-1">
                  <a
                    href="https://archive.org/search?query=subject%3A%22anime%22+AND+mediatype%3A%22movies%22"
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-2.5 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    🏛️ Search Archive.org Anime Collection
                  </a>
                  <a
                    href="https://www.google.com/search?q=intitle%3A%22index+of%22+%22mp4%22+anime"
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-2.5 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    📂 Google Search Free Parent Directories
                  </a>
                  <a
                    href="https://archive.org/details/Kimba_The_White_Lion_Series_1"
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 px-2.5 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    🦁 Retro Kimba on Archive
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {videoState.videoId === "local-file" && (
          <div className="bg-amber-950/20 text-amber-300/90 text-[11px] border border-amber-900/30 p-2.5 rounded-xl leading-relaxed">
            💡 <strong>Watching your own downloaded anime:</strong> Since video files cannot be streamed over our free server, 
            simply make sure your partner loads the exact same video file from their computer using the <strong>Local File Sync</strong> button! 
            Our player will then synchronize play, pause, and seeking perfectly as if you were streaming! 💖
          </div>
        )}
      </div>
    </div>
  );
}
