import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Peer, VideoState, ChatMessage, SignalMessage, ReactionMessage } from "./types";

dotenv.config();

// Initialize Gemini API
export const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

export interface Room {
  id: string;
  peers: { [peerId: string]: Peer };
  videoState: VideoState;
  chatMessages: ChatMessage[];
  reactions: ReactionMessage[];
  signals: SignalMessage[];
}

// In-memory database of active watch rooms
export const rooms: { [roomId: string]: Room } = {};

// Initial curated anime selection (open source / public domain retro classics)
export const defaultAnimeList = [
  {
    id: "astro-boy",
    title: "Astro Boy (1963) - Episode 1",
    url: "https://archive.org/download/astro-boy-1963-series/Astro_Boy_1963_-_Episode_01_-_The_Birth_of_Astro_Boy.mp4",
    description: "The legendary first-ever episode of Tezuka's absolute classic! Watch the birth of Astro Boy and his initial adventures in beautiful retro style.",
    duration: "24:35"
  },
  {
    id: "kimba-lion",
    title: "Kimba the White Lion (1965) - Episode 1",
    url: "https://archive.org/download/KimbaTheWhiteLion/KimbaTheWhiteLion_Episode01_GoeneWild_512kb.mp4",
    description: "The groundbreaking 1965 color masterpiece! Follow Kimba's early savanna journey as he dreams of peaceful coexistence.",
    duration: "25:12"
  },
  {
    id: "sita-blues",
    title: "Sita Sings the Blues (Feature Film)",
    url: "https://archive.org/download/Sita_Sings_the_Blues/Sita_Sings_the_Blues_1080p.mp4",
    description: "An award-winning, vibrant indie animated feature film that combines ancient Sanskrit epic, shadow puppets, and gorgeous modern jazz.",
    duration: "1:21:54"
  },
  {
    id: "lofi-chill",
    title: "Lo-Fi Starry Cosmic Cosmic Chill Loop",
    url: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-background-1611-large.mp4",
    description: "Set a romantic mood, dim the lights, and co-watch a calming starry loop while playing your favorite music or talking on camera!",
    duration: "Infinite"
  }
];

export const fallbackRecommendations: { [vibe: string]: string } = {
  romcom: `Here are my top sweet recommendations for a cozy rom-com night! ✨

1. **Horimiya** (Romance / Slice of Life)
A sweet and realistic high school romance about discovering each other's hidden sides.
*Couples Connection Tip:* Snuggle up close and share your favorite sweet treats! 🍬

2. **Toradora!** (Rom-Com)
A classic opposites-attract story with amazing character chemistry and touching moments.
*Couples Connection Tip:* Keep a cozy blanket nearby for when things get emotional! 🥺

3. **Kaguya-sama: Love is War** (Comedy / Romance)
Two geniuses engage in hilarious mind games trying to force each other to confess first.
*Couples Connection Tip:* Take a playful sip of your drink whenever they overthink things! 🥤`,

  emotional: `Here are some heartwarming, tearjerker recommendations for your date night! 🌸

1. **Kimi no Na wa (Your Name)** (Drama / Romance)
A breathtaking body-swap romance with spectacular visuals and a cosmic soulmate connection.
*Couples Connection Tip:* Keep a tissue box nearby—this one is a beautiful emotional rollercoaster! 😭

2. **Shigatsu wa Kimi no Uso (Your Lie in April)** (Music / Drama)
A deeply touching story about a pianist finding inspiration, courage, and love through a violinist.
*Couples Connection Tip:* Close your eyes during the violin solos and enjoy the music together! 🎻

3. **Tenki no Ko (Weathering With You)** (Drama / Fantasy)
An incredibly gorgeous story of a boy who will change the weather and choose love over the world.
*Couples Connection Tip:* Perfect for a rainy day date under a warm duvet! 🌧️`,

  fantasy: `Here are my magical adventure and fantasy picks for your couples night! 🔮

1. **Sousou no Frieren (Frieren: Beyond Journey's End)** (Fantasy / Adventure)
A beautiful, slow-burn fantasy exploring time, precious memories, and the meaning of connections.
*Couples Connection Tip:* Talk about your favorite memories together after watching! 🗺️

2. **Sword Art Online** (Sci-Fi / Fantasy)
A thrilling survival game romance with high stakes and a legendary partnership between Kirito and Asuna.
*Couples Connection Tip:* Cheering for their teamwork makes the combat scenes twice as epic! ⚔️

3. **KonoSuba: God's Blessing on this Wonderful World!** (Fantasy / Comedy)
A hilarious and chaotic parody of the fantasy genre that will keep you both in stitches.
*Couples Connection Tip:* Laugh out loud and enjoy the lighthearted adventure! 😆`,

  hype: `Get ready for some high-energy action and mind-blowing thrillers! ⚡

1. **Solo Leveling** (Action / Fantasy / Overpowered)
From the weakest hunter of all mankind to a god-like warrior with a shadow army! Visually breathtaking action scenes.
*Couples Connection Tip:* Squeal together whenever Sung Jinwoo says "Arise!" 💀

2. **Shingeki no Kyojin (Attack on Titan)** (Action / Thriller)
An intense, masterpiece mystery with dark twists and turns that will keep you on the absolute edge of your seats.
*Couples Connection Tip:* Pause between episodes to share your theories on what happens next! 🧠

3. **Spy x Family** (Action / Comedy)
A legendary spy, a deadly assassin, and a cute telepath child form a wholesome fake family. Absolutely charming!
*Couples Connection Tip:* Spot Anya's legendary reaction faces and try to imitate them! 🕵️‍♂️`
};

export const fallbackChatReplies = [
  "Kyaa! I was just thinking how cute you two look watching anime together! 🌸 Did you know that the creator of 'Your Name' was inspired by classical Japanese poetry? What's your favorite romantic movie of all time? 💕",
  "Okaeri! My systems got a tiny bit overloaded by your love, but I wanted to suggest a sweet tip: try turning down the lights to get that authentic cinema vibe! 🎬 Do you prefer cozying up with popcorn or sweet snacks? ✨",
  "Uwah! Sakura-chan is here! ٩(◕‿◕)۶ If you could travel to any anime world together, would you visit a magical fantasy village, a cyberpunk metropolis, or a cozy slice-of-life school town? 🗺️",
  "Yatta! Here's a cute connection tip: during the next emotional scene, give your partner's hand a gentle squeeze! 🥺 What anime character reminds you most of each other? 💕",
  "Moshi moshi! 🌸 Did you know that the word 'Komorebi' refers to sunlight filtering through the trees? It's the perfect name for a cozy date room like this! Let's watch something magical together! ✨"
];

// Helper to generate room IDs
export function generateRoomId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Clean up stale rooms or peers (inactive for > 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    Object.keys(rooms).forEach((roomId) => {
      const room = rooms[roomId];
      Object.keys(room.peers).forEach((peerId) => {
        if (now - room.peers[peerId].lastActive > 300000) {
          delete room.peers[peerId];
        }
      });
      // Keep chat and history, but clean up older signals (> 2 min)
      room.signals = room.signals.filter((s) => now - s.timestamp < 120000);
      // Clean up older reactions (> 30 seconds)
      room.reactions = room.reactions.filter((r) => now - r.timestamp < 30000);

      // If no peers for 1 hour, delete room
      if (Object.keys(room.peers).length === 0) {
        delete rooms[roomId];
      }
    });
  }, 60000);
}

// Setup Express application
const app = express();

app.use(express.json());

// Support both prefixed /api/rooms and raw /rooms routes (crucial for clean Vercel serverless routing)
app.use((req, res, next) => {
  const originalUrl = req.url;
  let cleanUrl = req.url || "/";
  
  // Vercel serverless functions can sometimes prefix the handler's filename to req.url
  if (cleanUrl.startsWith("/api/index.ts")) {
    cleanUrl = cleanUrl.substring("/api/index.ts".length);
  } else if (cleanUrl.startsWith("/api/index.js")) {
    cleanUrl = cleanUrl.substring("/api/index.js".length);
  } else if (cleanUrl.startsWith("/api/index")) {
    cleanUrl = cleanUrl.substring("/api/index".length);
  }
  
  // Normalize any multiple/double slashes
  cleanUrl = cleanUrl.replace(/\/+/g, "/");
  if (!cleanUrl) {
    cleanUrl = "/";
  }

  // Ensure /api prefix is present so Express router matches correctly
  if (!cleanUrl.startsWith("/api") && !cleanUrl.startsWith("/static")) {
    cleanUrl = "/api" + cleanUrl;
  }
  
  // Normalize double slashes again just in case
  cleanUrl = cleanUrl.replace(/\/+/g, "/");

  req.url = cleanUrl;
  console.log(`[ROUTE DEBUG] Method: ${req.method} | Original: ${originalUrl} | Final: ${req.url}`);
  next();
});

// API: Get Curated Anime List
app.get(["/api/anime", "/anime"], (req, res) => {
  res.json(defaultAnimeList);
});

// API: Create a room
app.post(["/api/rooms", "/rooms"], (req, res) => {
  const id = generateRoomId();
  const newRoom: Room = {
    id,
    peers: {},
    videoState: {
      videoId: "astro-boy",
      videoUrl: "https://archive.org/download/astro-boy-1963-series/Astro_Boy_1963_-_Episode_01_-_The_Birth_of_Astro_Boy.mp4",
      videoTitle: "Astro Boy (1963) - Episode 1",
      isPlaying: false,
      currentTime: 0,
      playbackSpeed: 1.0,
      actionSeq: 0,
      lastAction: "load",
      senderId: "system",
      updatedAt: Date.now()
    },
    chatMessages: [
      {
        id: "welcome",
        senderId: "system",
        senderName: "Sakura-chan 🌸",
        text: "Welcome to your private Cinema Room! Share the URL with your partner to watch together and start your video call. 💕 Try asking me for anime recommendations in the chatbot tab!",
        timestamp: Date.now(),
        isAi: true
      }
    ],
    reactions: [],
    signals: []
  };
  rooms[id] = newRoom;
  res.json({ roomId: id });
});

// API: Join a room
app.post(["/api/rooms/:id/join", "/rooms/:id/join"], (req, res) => {
  const roomId = req.params.id.toUpperCase();
  const { peerId, name } = req.body;

  if (!peerId || !name) {
    return res.status(400).json({ error: "Missing peerId or name" });
  }

  let room = rooms[roomId];
  if (!room) {
    // Re-create the room if it expired but they have the link
    room = {
      id: roomId,
      peers: {},
      videoState: {
        videoId: "sintel",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        videoTitle: "Sintel (Blender Studio)",
        isPlaying: false,
        currentTime: 0,
        playbackSpeed: 1.0,
        actionSeq: 0,
        lastAction: "load",
        senderId: "system",
        updatedAt: Date.now()
      },
      chatMessages: [
        {
          id: "welcome",
          senderId: "system",
          senderName: "Sakura-chan 🌸",
          text: "Welcome back! This room has been re-activated for you. 💕 Ask me for suggestions or chat with your partner!",
          timestamp: Date.now(),
          isAi: true
        }
      ],
      reactions: [],
      signals: []
    };
    rooms[roomId] = room;
  }

  room.peers[peerId] = {
    id: peerId,
    name,
    lastActive: Date.now()
  };

  // Add a system welcome message for the partner
  const welcomeMsg: ChatMessage = {
    id: `join-${peerId}-${Date.now()}`,
    senderId: "system",
    senderName: "System",
    text: `${name} has entered the room. 💕 Let the date begin!`,
    timestamp: Date.now()
  };
  room.chatMessages.push(welcomeMsg);

  res.json({
    roomId: room.id,
    videoState: room.videoState,
    chatMessages: room.chatMessages,
    peers: room.peers
  });
});

// API: Heartbeat & State Synchronizer
app.post(["/api/rooms/:id/sync", "/rooms/:id/sync"], (req, res) => {
  const roomId = req.params.id.toUpperCase();
  const { peerId, videoStateUpdate } = req.body;

  let room = rooms[roomId];
  if (!room) {
    // Re-create the room on the fly on this stateless serverless instance
    room = {
      id: roomId,
      peers: {},
      videoState: {
        videoId: "astro-boy",
        videoUrl: "https://archive.org/download/astro-boy-1963-series/Astro_Boy_1963_-_Episode_01_-_The_Birth_of_Astro_Boy.mp4",
        videoTitle: "Astro Boy (1963) - Episode 1",
        isPlaying: false,
        currentTime: 0,
        playbackSpeed: 1.0,
        actionSeq: 0,
        lastAction: "load",
        senderId: "system",
        updatedAt: Date.now()
      },
      chatMessages: [
        {
          id: "welcome",
          senderId: "system",
          senderName: "Sakura-chan 🌸",
          text: "Room synchronized. 💕",
          timestamp: Date.now(),
          isAi: true
        }
      ],
      reactions: [],
      signals: []
    };
    rooms[roomId] = room;
  }

  // Ensure this peer is registered in the re-created room
  if (!room.peers[peerId]) {
    room.peers[peerId] = {
      id: peerId,
      name: "Partner", // Placeholder name until they sync or re-join
      lastActive: Date.now()
    };
  }

  // Update peer liveness
  if (room.peers[peerId]) {
    room.peers[peerId].lastActive = Date.now();
  }

  // Process video state updates if submitted by client
  if (videoStateUpdate) {
    const currentSeq = room.videoState.actionSeq;
    if (videoStateUpdate.actionSeq > currentSeq) {
      room.videoState = {
        ...room.videoState,
        ...videoStateUpdate,
        updatedAt: Date.now()
      };
    }
  }

  // Fetch queued WebRTC signals for this specific peer
  const mySignals = room.signals.filter((s) => s.receiverId === peerId);
  room.signals = room.signals.filter((s) => s.receiverId !== peerId);

  // Filter active peers (within 12 seconds liveness)
  const activePeers: { [id: string]: any } = {};
  const now = Date.now();
  Object.keys(room.peers).forEach((pid) => {
    if (now - room.peers[pid].lastActive < 12000) {
      activePeers[pid] = room.peers[pid];
    }
  });

  // Limit chat messages array from ballooning infinitely
  if (room.chatMessages.length > 100) {
    room.chatMessages = room.chatMessages.slice(-100);
  }

  // Get recent reactions (last 8 seconds to show popup bubbles)
  const recentReactions = room.reactions.filter((r) => now - r.timestamp < 8000);

  res.json({
    peers: activePeers,
    videoState: room.videoState,
    chatMessages: room.chatMessages,
    reactions: recentReactions,
    signals: mySignals,
    serverTime: now
  });
});

// API: Post WebRTC signaling messages
app.post(["/api/rooms/:id/signal", "/rooms/:id/signal"], (req, res) => {
  const roomId = req.params.id.toUpperCase();
  const { senderId, receiverId, type, payload } = req.body;

  const room = rooms[roomId];
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const signal: SignalMessage = {
    id: `sig-${senderId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    senderId,
    receiverId,
    type,
    payload,
    timestamp: Date.now()
  };

  room.signals.push(signal);
  res.json({ success: true });
});

// API: Post chat messages (and trigger AI responses)
app.post(["/api/rooms/:id/chat", "/rooms/:id/chat"], async (req, res) => {
  const roomId = req.params.id.toUpperCase();
  const { senderId, senderName, text } = req.body;

  const room = rooms[roomId];
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const messageId = `msg-${senderId}-${Date.now()}`;
  const newMsg: ChatMessage = {
    id: messageId,
    senderId,
    senderName,
    text,
    timestamp: Date.now()
  };

  room.chatMessages.push(newMsg);

  const lowerText = text.toLowerCase();
  const isAiQuery = lowerText.includes("@sakura") || lowerText.includes("@ai") || req.body.isToAi;

  if (isAiQuery) {
    res.json({ success: true, chatMessages: room.chatMessages });

    setTimeout(async () => {
      try {
        if (!ai) {
          const errorMsg: ChatMessage = {
            id: `ai-err-${Date.now()}`,
            senderId: "system",
            senderName: "Sakura-chan 🌸",
            text: "I'd love to chat, but my Gemini AI API Key is not set in Secrets! Ask my developers to add GEMINI_API_KEY in Secrets. 😊 But we can still watch anime together!",
            timestamp: Date.now(),
            isAi: true
          };
          room.chatMessages.push(errorMsg);
          return;
        }

        const chatContext = room.chatMessages
          .slice(-8)
          .map((m) => `${m.senderName}: ${m.text}`)
          .join("\n");

        const prompt = `You are "Sakura-chan 🌸", an enthusiastic, cute, and knowledgeable anime companion and host for couples watching anime together. 
Your goal is to suggest fun anime titles, answer trivia, explain cultural references, or give playful, romantic, and fun conversation starters for the couple's date night!

Keep your answer:
1. Highly engaging, cute, and helpful (use cute Japanese emojis like ✨, 🌸, 💕, 🥺, ٩(◕‿◕)۶).
2. Short and cozy (under 120 words), perfect for reading quickly during a watch party.
3. Suggest actual real anime titles (like Kimi no Na wa/Your Name, Horimiya, Toradora, Spy x Family, Frieren, Demon Slayer, etc.) based on their vibe or chat context.

Current watch room video: "${room.videoState.videoTitle}"
Recent conversation context:
${chatContext}

Respond back as Sakura-chan directly:`;

        let aiText = "";
        try {
          const aiResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              systemInstruction: "You are Sakura-chan, a cute anime-expert mascot and date night facilitator for a couple. Use friendly, bubbly, romantic tone.",
              temperature: 1.0,
            }
          });
          aiText = aiResponse.text || "Kyaa~ Something went wrong, let me try again! 🌸";
        } catch (apiErr) {
          console.warn("Gemini API Error in chat, applying offline fallback:", apiErr);
          const randomIndex = Math.floor(Math.random() * fallbackChatReplies.length);
          aiText = `*(Moshi moshi! The anime cosmos is a bit crowded right now, but Sakura-chan wanted to say:)*\n\n${fallbackChatReplies[randomIndex]}`;
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          senderId: "system",
          senderName: "Sakura-chan 🌸",
          text: aiText,
          timestamp: Date.now(),
          isAi: true
        };
        room.chatMessages.push(aiMsg);
      } catch (err) {
        console.error("Critical chat error:", err);
      }
    }, 100);
  } else {
    res.json({ success: true, chatMessages: room.chatMessages });
  }
});

// API: Post a reaction (emoji burst)
app.post(["/api/rooms/:id/reaction", "/rooms/:id/reaction"], (req, res) => {
  const roomId = req.params.id.toUpperCase();
  const { senderId, emoji } = req.body;

  const room = rooms[roomId];
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  const reaction: ReactionMessage = {
    id: `react-${senderId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    senderId,
    emoji,
    timestamp: Date.now()
  };

  room.reactions.push(reaction);
  res.json({ success: true });
});

// API: Ask AI for suggestions directly (button trigger)
app.post(["/api/rooms/:id/ai-recommend", "/rooms/:id/ai-recommend"], async (req, res) => {
  const roomId = req.params.id.toUpperCase();
  const { vibe } = req.body;

  const room = rooms[roomId];
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  if (!ai) {
    return res.json({
      recommendations: "Kyaa! My Gemini API Key is missing. Add GEMINI_API_KEY in Secrets, and I will recommend amazing personalized anime matches for you! 💕"
    });
  }

  try {
    const prompt = `Give a romantic couple's watch recommendation for a "${vibe}" mood. 
Recommend exactly 3 actual real-world anime titles (e.g. romance, action, slice-of-life, tearjerker). 
Format each with:
- **Title** (Genre)
- A 1-sentence synopsis explaining why it's amazing for couples to watch together.
- A cute "Couples Connection Tip" (e.g., have tissues ready, snuggle up!).

Keep the total text short, cozy, and formatted beautifully in clean Markdown under 150 words. Be Sakura-chan 🌸!`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    const recommendationText = aiResponse.text || "Oh noes! Let me try matching again. 🌸";

    const aiMsg: ChatMessage = {
      id: `ai-rec-${Date.now()}`,
      senderId: "system",
      senderName: "Sakura-chan 🌸",
      text: `Here are my **${vibe}** recommendations for your date night! ✨\n\n${recommendationText}`,
      timestamp: Date.now(),
      isAi: true
    };
    room.chatMessages.push(aiMsg);

    res.json({ recommendations: recommendationText });
  } catch (err) {
    console.warn("Anime recommendation error, applying fallback:", err);
    const normalizedVibe = String(vibe || "romcom").toLowerCase();
    let recommendationText = fallbackRecommendations[normalizedVibe] || fallbackRecommendations["romcom"];
    
    recommendationText = `*(Kyaa~ The anime oracle is experiencing extremely high demand, but Sakura-chan has prepared my personal secret list of favorites for you!)* 💕\n\n${recommendationText}`;

    const aiMsg: ChatMessage = {
      id: `ai-rec-fallback-${Date.now()}`,
      senderId: "system",
      senderName: "Sakura-chan 🌸",
      text: `Here are my **${vibe}** recommendations for your date night! ✨\n\n${recommendationText}`,
      timestamp: Date.now(),
      isAi: true
    };
    room.chatMessages.push(aiMsg);

    res.json({ recommendations: recommendationText });
  }
});

export default app;
