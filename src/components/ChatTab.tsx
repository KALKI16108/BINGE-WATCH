import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageCircle, Heart, Zap, Smile, HelpCircle, Loader } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatTabProps {
  roomId: string;
  peerId: string;
  peerName: string;
  chatMessages: ChatMessage[];
  onSendMessage: (text: string, isToAi?: boolean) => void;
  onSendReaction: (emoji: string) => void;
  onGetAiRecommendation: (vibe: string) => Promise<string>;
}

export default function ChatTab({
  roomId,
  peerId,
  peerName,
  chatMessages,
  onSendMessage,
  onSendReaction,
  onGetAiRecommendation
}: ChatTabProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "ai">("chat");
  const [inputText, setInputText] = useState<string>("");
  
  // AI States
  const [aiVibe, setAiVibe] = useState<string>("Romantic");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef<number>(0);

  // Auto scroll chat to bottom when new messages arrive
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // Check if we actually have new messages compared to last check
    const hasNewMessages = chatMessages.length > prevMessagesLength.current;
    
    if (hasNewMessages) {
      // Check if user is scrolled near bottom
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
      
      // Check if last message was sent by me
      const lastMessage = chatMessages[chatMessages.length - 1];
      const isLastMessageFromMe = lastMessage?.senderId === peerId;

      if (isNearBottom || isLastMessageFromMe || prevMessagesLength.current === 0) {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }

    prevMessagesLength.current = chatMessages.length;
  }, [chatMessages, peerId]);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText);
    setInputText("");
  };

  const triggerAskAiHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText, true);
    setInputText("");
    // Automatically switch back to chat tab to see response
    setActiveTab("chat");
  };

  const handleVibeMatch = async (vibe: string) => {
    setAiVibe(vibe);
    setIsAiLoading(true);
    setAiResponse("");
    try {
      const response = await onGetAiRecommendation(vibe);
      setAiResponse(response);
      // Also switch tab or show notification
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const emojis = ["❤️", "🌸", "😂", "😮", "😢", "🎉", "🔥", "✨"];

  return (
    <div id="chat-tabs-container" className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[520px] shadow-xl">
      {/* Tab Selectors */}
      <div className="flex border-b border-white/10 bg-black/40">
        <button
          id="tab-select-chat"
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "chat"
              ? "text-indigo-400 bg-white/5 border-b-2 border-indigo-500"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Live Room Chat
        </button>

        <button
          id="tab-select-ai"
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "ai"
              ? "text-indigo-400 bg-white/5 border-b-2 border-indigo-500"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Anime AI Matchmaker
        </button>
      </div>

      {/* Tab 1: Live Chat Panel */}
      {activeTab === "chat" && (
        <div className="flex-1 flex flex-col min-h-0 bg-black/40 relative">
          {/* Reaction Quick Burst row */}
          <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> Quick Burst:
            </span>
            <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
              {emojis.map((emoji) => (
                <button
                  id={`btn-react-${emoji}`}
                  key={emoji}
                  onClick={() => onSendReaction(emoji)}
                  className="text-lg hover:scale-130 transition-transform px-1.5 active:scale-90 cursor-pointer"
                  title={`Burst ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Stream list */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {chatMessages.map((msg) => {
              const isMe = msg.senderId === peerId;
              const isSys = msg.senderId === "system";
              const isSakura = msg.isAi;

              if (isSys) {
                return (
                  <div key={msg.id} className="flex justify-center">
                    <span className={`text-[10px] px-3 py-1 rounded-full text-center max-w-[90%] leading-relaxed ${
                      isSakura 
                        ? "bg-indigo-950/20 text-indigo-300 border border-indigo-900/30 font-medium" 
                        : "bg-white/5 text-slate-400"
                    }`}>
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? "items-start" : "items-end"}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[10px] font-bold uppercase ${isMe ? "text-indigo-400" : "text-rose-400"}`}>
                      {msg.senderName}
                    </span>
                    <span className="text-[8px] text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className={`text-xs p-3 rounded-2xl max-w-[85%] leading-relaxed border ${
                    isMe
                      ? "bg-white/5 border-white/5 rounded-tr-none rounded-br-xl rounded-bl-xl text-slate-200"
                      : "bg-rose-500/10 border-rose-500/20 rounded-tl-none rounded-br-xl rounded-bl-xl text-rose-100"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Form submission */}
          <form onSubmit={handleSendText} className="p-3 bg-black/40 border-t border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Send a sweet message or ask Sakura-chan..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 text-xs text-slate-200 px-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500/50"
            />
            
            <button
              id="chat-send-btn"
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl cursor-pointer flex items-center justify-center transition-colors shadow-lg shadow-indigo-600/10"
              title="Send text message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>

            <button
              id="chat-ask-ai-btn"
              type="button"
              onClick={triggerAskAiHost}
              className="bg-indigo-950/50 hover:bg-indigo-900/30 text-indigo-300 border border-indigo-500/20 px-2.5 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 text-[10px] font-semibold transition-all"
              title="Ask AI Companion"
              disabled={!inputText.trim()}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Ask AI
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Anime AI Matchmaker Recommendations */}
      {activeTab === "ai" && (
        <div className="flex-1 flex flex-col p-5 bg-black/40 overflow-y-auto space-y-4">
          <div className="bg-indigo-950/15 border border-indigo-500/10 p-4 rounded-2xl flex gap-3 items-start leading-relaxed">
            <span className="text-2xl select-none">🌸</span>
            <div>
              <h4 className="text-xs font-bold text-indigo-300">Konichiwa! I am Sakura-chan ٩(◕‿◕)۶</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                I am your AI date companion! Choose a cozy anime watch vibe below, and I will recommend perfect titles
                tailored for couples watch parties! Or type a message and click <strong>Ask AI</strong> in the chat tab.
              </p>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Select Your Date Night Vibe:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "💖 Romantic & Sweet", value: "Romantic" },
                { label: "🍿 Popcorn & Action", value: "Action" },
                { label: "😭 Heartwarming Tearjerker", value: "Tearjerker" },
                { label: "🧠 Mystery & Fantasy", value: "Fantasy" }
              ].map((v) => (
                <button
                  id={`ai-vibe-${v.value}`}
                  key={v.value}
                  onClick={() => handleVibeMatch(v.value)}
                  className={`py-2 px-3 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer flex items-center justify-between ${
                    aiVibe === v.value
                      ? "bg-indigo-950/20 border-indigo-500 text-indigo-300"
                      : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <span>{v.label}</span>
                  {aiVibe === v.value && <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* AI Output Result Card */}
          <div className="flex-1 bg-black/50 border border-white/5 p-4 rounded-2xl relative min-h-[140px] flex flex-col justify-center">
            {isAiLoading ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <Loader className="w-6 h-6 text-indigo-500 animate-spin" />
                <span className="text-[11px] text-slate-400 animate-pulse">Sakura-chan is consulting anime oracle... 🌸</span>
              </div>
            ) : aiResponse ? (
              <div className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                {aiResponse}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-6">
                <HelpCircle className="w-8 h-8 text-white/10 mx-auto mb-1.5" />
                <span className="text-[11px]">Click a date night vibe above to get immediate recommendations! 💕</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
