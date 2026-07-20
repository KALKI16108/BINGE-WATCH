import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Mic, MicOff, Video, Heart, RefreshCw, Sparkles } from "lucide-react";
import { Peer, SignalMessage } from "../types";

interface VideoCallProps {
  roomId: string;
  myPeerId: string;
  myName: string;
  partners: Peer[];
  signals: SignalMessage[];
  onSendSignal: (receiverId: string, type: string, payload: any) => void;
}

export default function VideoCall({
  roomId,
  myPeerId,
  myName,
  partners,
  signals,
  onSendSignal
}: VideoCallProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCamOn, setIsCamOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [mediaError, setMediaError] = useState<string>("");

  // Styling filters
  const [activeFilter, setActiveFilter] = useState<string>("none"); // none, sepia, sakura, noir, retro

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const tracksAdded = useRef<boolean>(false);

  // Identify our partner
  const partner = partners.find((p) => p.id !== myPeerId) || null;

  // Initialize camera and microphone stream
  useEffect(() => {
    async function setupMedia() {
      try {
        setMediaError("");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, frameRate: 15 },
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.warn("Could not access camera/mic:", err);
        setMediaError(
          "Camera & Mic access is currently blocked or unavailable! 🔒 Inside the AI Studio preview iframe, browsers block camera/microphone access for safety. To start video/voice calling, please click the 'Open in new tab' button at the top-right of the preview, or copy and load the dev URL directly! Displaying cute partner placeholder cards for now. 🌸"
        );
        setLocalStream(null);
      }
    }
    setupMedia();

    return () => {
      // Clean up local tracks
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);

  // Sync local controls with track state
  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isCamOn;
      });
    }
  }, [isCamOn, localStream]);

  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMicOn;
      });
    }
  }, [isMicOn, localStream]);

  // WebRTC Connection Setup and Signalling handling
  useEffect(() => {
    if (!partner) {
      // If partner leaves, reset peer connection
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      setRemoteStream(null);
      tracksAdded.current = false;
      return;
    }

    const partnerPeerId = partner.id;

    // To prevent simultaneous offers causing double connections:
    // Alphabetically smaller peerId initiates the RTCPeerConnection offer.
    const isInitiator = myPeerId < partnerPeerId;

    if (!pcRef.current) {
      console.log(`Setting up RTCPeerConnection. Initiator: ${isInitiator}`);
      
      const configuration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" }
        ]
      };

      const pc = new RTCPeerConnection(configuration);
      pcRef.current = pc;

      // Handle ICE Candidate generation
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          onSendSignal(partnerPeerId, "candidate", event.candidate);
        }
      };

      // Handle remote track arrival
      pc.ontrack = (event) => {
        console.log("Remote track received:", event.streams[0]);
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("WebRTC Connection State changed to:", pc.connectionState);
        if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
          setRemoteStream(null);
        }
      };
    }

    const pc = pcRef.current;

    // Add local tracks to peer connection
    if (localStream && !tracksAdded.current) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
      tracksAdded.current = true;
    }

    // If we are the initiator, create the offer
    if (isInitiator && pc.signalingState === "stable") {
      pc.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true })
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          if (pc.localDescription) {
            onSendSignal(partnerPeerId, "offer", pc.localDescription);
          }
        })
        .catch((err) => console.error("Error creating offer:", err));
    }
  }, [partner, localStream, myPeerId]);

  // Process signals arrived from the server signal queue
  useEffect(() => {
    if (!pcRef.current || signals.length === 0) return;

    signals.forEach(async (sig) => {
      const pc = pcRef.current;
      if (!pc) return;

      try {
        if (sig.type === "offer") {
          console.log("Processing incoming WebRTC Offer");
          await pc.setRemoteDescription(new RTCSessionDescription(sig.payload));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          onSendSignal(sig.senderId, "answer", answer);
        } else if (sig.type === "answer") {
          console.log("Processing incoming WebRTC Answer");
          if (pc.signalingState !== "stable") {
            await pc.setRemoteDescription(new RTCSessionDescription(sig.payload));
          }
        } else if (sig.type === "candidate") {
          console.log("Adding remote ICE Candidate");
          await pc.addIceCandidate(new RTCIceCandidate(sig.payload));
        }
      } catch (err) {
        console.error("Error processing WebRTC signal:", err);
      }
    });
  }, [signals]);

  // Toggle filter cycles
  const cycleFilter = () => {
    const filters = ["none", "sepia", "sakura", "noir", "retro"];
    const currentIndex = filters.indexOf(activeFilter);
    const nextIndex = (currentIndex + 1) % filters.length;
    setActiveFilter(filters[nextIndex]);
  };

  const getFilterStyleClass = (filter: string) => {
    switch (filter) {
      case "sepia":
        return "sepia contrast-125 saturate-75";
      case "sakura":
        return "hue-rotate-[320deg] brightness-110 saturate-120 animate-pulse";
      case "noir":
        return "grayscale contrast-150 brightness-90";
      case "retro":
        return "brightness-95 contrast-110 saturate-150 hue-rotate-15";
      default:
        return "";
    }
  };

  return (
    <div id="video-call-panel" className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Live Cam & Audio 💖
        </h2>
        
        {localStream && (
          <button
            id="btn-cycle-filter"
            onClick={cycleFilter}
            className="text-[10px] bg-white/10 text-indigo-300 hover:bg-white/20 border border-white/10 px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
            title="Cycle Camera Filter"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Filter: {activeFilter.toUpperCase()}
          </button>
        )}
      </div>

      {mediaError && (
        <div className="text-[11px] bg-white/5 text-slate-400 p-2.5 rounded-xl border border-white/5 leading-relaxed">
          {mediaError}
        </div>
      )}

      {/* Floating Couple Video Cam Feeds */}
      <div className="flex flex-col gap-4">
        {/* Local feed (ME) */}
        <div className="relative aspect-video rounded-2xl border border-white/20 overflow-hidden shadow-lg bg-gradient-to-br from-indigo-800 to-purple-900 flex items-center justify-center group">
          {localStream && isCamOn ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover scale-x-[-1] ${getFilterStyleClass(activeFilter)}`}
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-center p-2">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center animate-pulse text-xl text-indigo-300 font-serif italic">
                {myName ? myName.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">{myName || "Alex"} (You)</span>
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-medium text-slate-200">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> {myName || "Alex"} {isMicOn ? "🎤" : "🔇"}
          </div>
        </div>

        {/* Remote feed (PARTNER) */}
        <div className="relative aspect-video rounded-2xl border border-rose-500/40 overflow-hidden shadow-[0_0_20px_rgba(225,29,72,0.15)] bg-gradient-to-br from-rose-800 to-amber-900 flex items-center justify-center">
          {partner ? (
            remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center p-2">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center animate-bounce">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
                <span className="text-[10px] text-rose-200 font-medium">{partner.name} joined!</span>
                <span className="text-[8px] text-slate-400 animate-pulse">Connecting video...</span>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center gap-1 text-center p-2">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 text-lg">
                M
              </div>
              <span className="text-[10px] text-slate-500">Waiting for partner...</span>
            </div>
          )}

          {partner && (
            <>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/40 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-medium text-slate-200">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> {partner.name}
              </div>
              <div className="absolute top-3 right-3">
                <div className="bg-rose-500 rounded-full p-1 shadow-lg shadow-rose-500/50">
                  <Heart className="w-3 h-3 text-white fill-white" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cam & Mic Hardware controllers panel */}
      <div className="flex justify-center gap-3 mt-1">
        <button
          id="btn-toggle-cam"
          onClick={() => setIsCamOn(!isCamOn)}
          className={`p-2.5 rounded-full border transition-all cursor-pointer ${
            isCamOn
              ? "bg-white/10 hover:bg-white/20 text-slate-200 border-white/10"
              : "bg-rose-950/30 hover:bg-rose-950/50 text-rose-400 border-rose-800/40"
          }`}
          title={isCamOn ? "Turn Camera Off" : "Turn Camera On"}
          disabled={!localStream}
        >
          {isCamOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
        </button>

        <button
          id="btn-toggle-mic"
          onClick={() => setIsMicOn(!isMicOn)}
          className={`p-2.5 rounded-full border transition-all cursor-pointer ${
            isMicOn
              ? "bg-white/10 hover:bg-white/20 text-slate-200 border-white/10"
              : "bg-rose-950/30 hover:bg-rose-950/50 text-rose-400 border-rose-800/40"
          }`}
          title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          disabled={!localStream}
        >
          {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        {!localStream && (
          <button
            id="btn-retry-media"
            onClick={async () => {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({
                  video: { width: 320, height: 240, frameRate: 15 },
                  audio: true
                });
                setLocalStream(stream);
                setMediaError("");
                if (localVideoRef.current) {
                  localVideoRef.current.srcObject = stream;
                }
              } catch (e) {
                console.log("Retry media failed");
              }
            }}
            className="text-[10px] bg-white/10 border border-white/10 hover:bg-white/20 text-slate-200 px-3 rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-indigo-400 animate-spin" />
            Enable Camera
          </button>
        )}
      </div>
    </div>
  );
}
