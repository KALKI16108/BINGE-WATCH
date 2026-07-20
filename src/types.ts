export interface Peer {
  id: string;
  name: string;
  lastActive: number;
}

export interface VideoState {
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number;
  actionSeq: number;
  lastAction: "play" | "pause" | "seek" | "load";
  senderId: string;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isAi?: boolean;
}

export interface SignalMessage {
  id: string;
  senderId: string;
  receiverId: string;
  type: string;
  payload: any;
  timestamp: number;
}

export interface ReactionMessage {
  id: string;
  senderId: string;
  emoji: string;
  timestamp: number;
}

export interface AnimeTitle {
  id: string;
  title: string;
  url: string;
  description: string;
  duration: string;
}
