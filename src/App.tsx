import { useEffect, useState, useRef } from "react";
import { Heart, Share2, Copy, Check, LogOut, Sparkles, Users, Tv, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Peer, VideoState, ChatMessage, SignalMessage, AnimeTitle } from "./types";
import VideoPlayer from "./components/VideoPlayer";
import VideoCall from "./components/VideoCall";
import ChatTab from "./components/ChatTab";
import EmojiBursts from "./components/EmojiBursts";

export default function App() {
  // Identity & Room states
  const [roomId, setRoomId] = useState<string>("");
  const [peerId, setPeerId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>("");

  // Sync state received from server
  const [partners, setPartners] = useState<Peer[]>([]);
  const [videoState, setVideoState] = useState<VideoState>({
    videoId: "sintel",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    videoTitle: "Sintel (Fantasy Anime Short)",
    isPlaying: false,
    currentTime: 0,
    playbackSpeed: 1.0,
    actionSeq: 0,
    lastAction: "load",
    senderId: "system",
    updatedAt: Date.now()
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<any[]>([]);
  const [signalsQueue, setSignalsQueue] = useState<SignalMessage[]>([]);

  // Curated anime database
  const [animeList, setAnimeList] = useState<AnimeTitle[]>([]);

  // UI States
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Initialize client peerId
  useEffect(() => {
    // Check URL parameters for room code
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get("room");
    if (roomParam) {
      setRoomId(roomParam.toUpperCase());
    }

    // Load or generate client peer ID (use sessionStorage to prevent tab collisions on the same browser)
    let pid = sessionStorage.getItem("anicouple_peer_id");
    if (!pid) {
      pid = `peer-${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem("anicouple_peer_id", pid);
    }
    setPeerId(pid);

    // Fetch initial anime catalog
    fetch("/api/anime")
      .then((res) => res.json())
      .then((data) => setAnimeList(data))
      .catch((e) => console.error("Could not fetch anime list", e));
  }, []);

  // Sync Polling loop (Runs every 1000ms while joined)
  useEffect(() => {
    if (!isJoined || !roomId || !peerId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            peerId,
            clientTime: Date.now()
          })
        });

        if (!response.ok) {
          if (response.status === 404) {
            setErrorMsg("Room session expired. Please re-create!");
            setIsJoined(false);
          }
          return;
        }

        const data = await response.json();

        // Update partners list
        const peersObj = data.peers || {};
        const peerList: Peer[] = Object.keys(peersObj).map((id) => peersObj[id]);
        setPartners(peerList);

        // Update video player state
        if (data.videoState) {
          setVideoState(data.videoState);
        }

        // Update chats
        if (data.chatMessages) {
          setChatMessages(data.chatMessages);
        }

        // Update reactions
        if (data.reactions) {
          setReactions(data.reactions);
        }

        // Enqueue WebRTC signals
        if (data.signals && data.signals.length > 0) {
          setSignalsQueue((prev) => {
            const currentIds = new Set(prev.map((s) => s.id));
            const newSigs = data.signals.filter((s: SignalMessage) => !currentIds.has(s.id));
            return [...prev, ...newSigs];
          });
        }
      } catch (err) {
        console.warn("Polling sync error", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isJoined, roomId, peerId]);

  // Create a new theatre room session
  const handleCreateRoom = async () => {
    if (!nameInput.trim()) {
      setErrorMsg("Please enter your lovely name first! 💕");
      return;
    }
    setErrorMsg("");

    try {
      const res = await fetch("/api/rooms", { method: "POST" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setErrorMsg(`Failed to start room (Status ${res.status}). ${text.substring(0, 100)}`);
        return;
      }
      const data = await res.json();
      const code = data.roomId;
      if (!code) {
        setErrorMsg("Failed to start room. Server did not return a Room ID.");
        return;
      }
      
      setRoomId(code);
      setUserName(nameInput);
      
      // Update browser URL query without reloading the page
      const newUrl = `${window.location.origin}${window.location.pathname}?room=${code}`;
      window.history.pushState({ path: newUrl }, "", newUrl);

      // Join immediately
      await handleJoinRoom(code, nameInput);
    } catch (e: any) {
      setErrorMsg(`Failed to start room. Connection error: ${e?.message || e}`);
    }
  };

  // Join an existing room
  const handleJoinExistingRoom = async () => {
    if (!nameInput.trim()) {
      setErrorMsg("Please enter your name to enter the date room! 🌸");
      return;
    }
    if (!roomId.trim()) {
      setErrorMsg("Please enter a valid Room Code!");
      return;
    }
    setErrorMsg("");
    await handleJoinRoom(roomId, nameInput);
  };

  const handleJoinRoom = async (code: string, name: string) => {
    try {
      const res = await fetch(`/api/rooms/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peerId, name })
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setErrorMsg(`Could not join room (Status ${res.status}). ${text.substring(0, 100)}`);
        return;
      }

      const data = await res.json();
      setRoomId(data.roomId);
      setUserName(name);
      setIsJoined(true);
      
      if (data.videoState) setVideoState(data.videoState);
      if (data.chatMessages) setChatMessages(data.chatMessages);
    } catch (e: any) {
      setErrorMsg(`Connection failed: ${e?.message || e}`);
    }
  };

  // Callback to update master video state from VideoPlayer
  const handleUpdateVideoState = async (updates: Partial<VideoState>) => {
    // Apply locally first for smooth feedback!
    setVideoState((prev) => ({ ...prev, ...updates }));

    if (!roomId || !peerId) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          peerId,
          clientTime: Date.now(),
          videoStateUpdate: updates
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.videoState) {
          setVideoState(data.videoState);
        }
        if (data.peers) {
          const peersObj = data.peers || {};
          const peerList: Peer[] = Object.keys(peersObj).map((id) => peersObj[id]);
          setPartners(peerList);
        }
      }
    } catch (e) {
      console.warn("Failed to push immediate video state sync:", e);
    }
  };

  // Chat/AI messaging handlers
  const handleSendMessage = async (text: string, isToAi?: boolean) => {
    if (!roomId || !peerId) return;

    try {
      await fetch(`/api/rooms/${roomId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: peerId,
          senderName: userName,
          text,
          isToAi
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendReaction = async (emoji: string) => {
    if (!roomId || !peerId) return;

    try {
      await fetch(`/api/rooms/${roomId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: peerId, emoji })
      });
      
      // Burst locally immediately for instant feedback
      const tempId = `local-react-${Date.now()}`;
      setReactions((prev) => [...prev, { id: tempId, emoji, timestamp: Date.now(), senderId: peerId }]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGetAiRecommendation = async (vibe: string): Promise<string> => {
    if (!roomId) return "";
    try {
      const res = await fetch(`/api/rooms/${roomId}/ai-recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vibe })
      });
      const data = await res.json();
      return data.recommendations || "";
    } catch (e) {
      return "Gomen! Failed to fetch recommendations. Try again in a bit! 💕";
    }
  };

  // WebRTC Signal Sender callback
  const handleSendSignal = async (receiverId: string, type: string, payload: any) => {
    if (!roomId || !peerId) return;
    try {
      await fetch(`/api/rooms/${roomId}/signal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: peerId, receiverId, type, payload })
      });
    } catch (e) {
      console.error("WebRTC signal send error", e);
    }
  };

  // Copy Room Link to Clipboard
  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(inviteLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  // Exit watch room
  const handleExitRoom = () => {
    setIsJoined(false);
    // Clear room query parameter
    const newUrl = `${window.location.origin}${window.location.pathname}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    setRoomId("");
  };

  // Identify partner peer representation
  const partnerPeer = partners.find((p) => p.id !== peerId) || null;

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 flex flex-col justify-between font-sans antialiased relative overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[120px]" />
      </div>

      {/* 1. Portal Welcome Landing Screen */}
      <AnimatePresence mode="wait">
        {!isJoined ? (
          <motion.div
            key="portal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex items-center justify-center p-6 relative z-10"
          >
            <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-3xl p-8 shadow-2xl relative backdrop-blur-xl flex flex-col gap-6 text-center">
              {/* Pulsing launcher logo */}
              <div className="mx-auto w-16 h-16 rounded-lg bg-indigo-500 flex items-center justify-center text-4xl shadow-[0_0_15px_rgba(99,102,241,0.5)] relative font-bold">
                K
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                  Komorebi Sync
                </h1>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  A cozy, free space where you can join a real-time face-to-face video call & watch synchronized anime together with your partner! 💖
                </p>
              </div>

              {errorMsg && (
                <div className="text-xs bg-red-950/30 text-rose-300 border border-red-900/30 px-3.5 py-2.5 rounded-2xl">
                  {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="text-left">
                  <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block mb-1.5 pl-1">
                    Your Date Nickname:
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="Enter your name (e.g. Alice)..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-sm text-gray-200 px-4 py-3 rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {roomId ? (
                  // Flow for people joining an invited URL
                  <div className="flex flex-col gap-3">
                    <div className="bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-2xl text-xs text-indigo-200">
                      🎁 You have been invited to enter private Room: <strong className="text-white text-sm">{roomId}</strong>
                    </div>
                    <button
                      id="btn-join-room-portal"
                      onClick={handleJoinExistingRoom}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm py-3 px-4 rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Tv className="w-4 h-4" /> Enter Date Theatre
                    </button>
                    <button
                      id="btn-cancel-portal"
                      onClick={() => setRoomId("")}
                      className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Or create a new private room
                    </button>
                  </div>
                ) : (
                  // Flow for initiating a room
                  <div className="flex flex-col gap-3">
                    <button
                      id="btn-create-room-portal"
                      onClick={handleCreateRoom}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm py-3 px-4 rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Tv className="w-4 h-4" /> Create Cozy Room
                    </button>

                    <div className="flex items-center my-1">
                      <div className="flex-1 border-b border-white/10"></div>
                      <span className="text-[10px] text-slate-500 px-3 font-semibold uppercase tracking-widest">Or enter code</span>
                      <div className="flex-1 border-b border-white/10"></div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Room Code..."
                        maxLength={6}
                        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                        className="w-1/3 text-center uppercase font-mono tracking-widest bg-white/5 border border-white/10 text-sm text-gray-200 px-2 py-3 rounded-2xl focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        id="btn-join-code-portal"
                        onClick={handleJoinExistingRoom}
                        className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-gray-200 font-semibold text-sm rounded-2xl active:scale-98 transition-all cursor-pointer"
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          // 2. Active Co-Watching Cinema Theatre Layout
          <motion.div
            key="theatre"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col p-4 md:p-6 lg:px-8 max-w-7xl mx-auto w-full gap-5 relative z-10"
          >
            {/* Flying reaction burst components */}
            <EmojiBursts reactions={reactions} myPeerId={peerId} />

            {/* Glowing Header Navigation bar */}
            <header className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] text-white">
                  K
                </div>
                <div>
                  <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                    Komorebi Sync <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400">
                      Room Code: <strong className="text-indigo-300 select-all font-mono">{roomId}</strong>
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-indigo-400" />
                      {partnerPeer ? `With ${partnerPeer.name} 💕` : "Waiting for partner..."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Right Action controls */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                {/* Copy Invite Link */}
                <button
                  id="btn-copy-invite-link"
                  onClick={handleCopyLink}
                  className={`text-xs px-4 py-2 rounded-lg border font-medium flex items-center gap-1.5 cursor-pointer transition-all ${
                    isCopied
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-white/10 text-white hover:bg-white/20 border-white/10"
                  }`}
                  title="Copy Invite Link"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Room Link Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" /> Invite Partner
                    </>
                  )}
                </button>

                {/* Exit Watch Party Room */}
                <button
                  id="btn-exit-theatre"
                  onClick={handleExitRoom}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  title="Exit Room"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Leave Date
                </button>
              </div>
            </header>

            {/* Main Stage Grid Split: Left (Theatre Screen), Right (Dating Cam / Chat) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Stage Container */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <VideoPlayer
                  roomId={roomId}
                  peerId={peerId}
                  peerName={userName}
                  videoState={videoState}
                  onUpdateVideoState={handleUpdateVideoState}
                  animeList={animeList}
                />
              </div>

              {/* Right Sidebar Container (30% like design) */}
              <div className="lg:col-span-4 flex flex-col gap-5 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
                {/* 1. Webcam Stream */}
                <VideoCall
                  roomId={roomId}
                  myPeerId={peerId}
                  myName={userName}
                  partners={partners}
                  signals={signalsQueue}
                  onSendSignal={handleSendSignal}
                />

                {/* 2. Interactive Chat Tab */}
                <ChatTab
                  roomId={roomId}
                  peerId={peerId}
                  peerName={userName}
                  chatMessages={chatMessages}
                  onSendMessage={handleSendMessage}
                  onSendReaction={handleSendReaction}
                  onGetAiRecommendation={handleGetAiRecommendation}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Humble Footer info bar */}
      <footer className="text-center py-6 border-t border-white/5 bg-black/60 mt-6 relative z-10">
        <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5">
          <span>Komorebi Sync</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/45" />
          <span>Immersive Couples Anime Watch Theatre</span>
        </p>
      </footer>
    </div>
  );
}
