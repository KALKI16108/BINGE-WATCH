import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number; // percentage width
  delay: number;
}

interface EmojiBurstsProps {
  reactions: Array<{ id: string; emoji: string; timestamp: number; senderId: string }>;
  myPeerId: string;
}

export default function EmojiBursts({ reactions, myPeerId }: EmojiBurstsProps) {
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);

  // Monitor incoming reactions and trigger visual bursts
  useEffect(() => {
    if (!reactions || reactions.length === 0) return;

    // Get the most recent reaction (e.g., added in the last 2 seconds)
    const now = Date.now();
    const newReactions = reactions.filter((r) => now - r.timestamp < 2000);

    setFloatingEmojis((prev) => {
      // Filter out existing ones to prevent infinite accumulation
      const currentIds = new Set(prev.map((e) => e.id));
      const toAdd: FloatingEmoji[] = [];

      newReactions.forEach((r) => {
        if (!currentIds.has(r.id)) {
          // Generate 4-6 little floating items per reaction click for a "burst" effect!
          const burstSize = r.senderId === myPeerId ? 3 : 5; // Smaller for local, bigger for remote
          for (let i = 0; i < burstSize; i++) {
            toAdd.push({
              id: `${r.id}-${i}`,
              emoji: r.emoji,
              x: 10 + Math.random() * 80, // Random percentage across the screen
              delay: i * 0.15,
            });
          }
        }
      });

      return [...prev, ...toAdd].slice(-40); // cap at 40 floating items max
    });
  }, [reactions, myPeerId]);

  // Clean up floating emojis after animation duration
  useEffect(() => {
    if (floatingEmojis.length === 0) return;
    const timer = setTimeout(() => {
      setFloatingEmojis([]);
    }, 6000);
    return () => clearTimeout(timer);
  }, [floatingEmojis]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      <AnimatePresence>
        {floatingEmojis.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: "100%", scale: 0.3 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: ["100%", "20%", "0%"],
              scale: [0.3, 1.4, 1.0, 0.4],
              x: [`${item.x}%`, `${item.x + (Math.random() * 20 - 10)}%`],
              rotate: [0, Math.random() * 90 - 45],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3.5 + Math.random() * 1.5,
              ease: "easeOut",
              delay: item.delay,
            }}
            className="absolute text-4xl select-none"
            style={{ bottom: 0 }}
          >
            {item.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
