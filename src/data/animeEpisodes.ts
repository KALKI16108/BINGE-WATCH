export interface Episode {
  episodeNumber: number;
  title: string;
  synopsis: string;
  duration: string;
  previewUrl: string;
  subUrl?: string;
  dubUrl?: string;
}

export interface Season {
  seasonNumber: number;
  seasonTitle: string;
  episodes: Episode[];
}

export interface AnimeSeries {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  genres: string[];
  seasons: Season[];
}

export const animeSeriesData: AnimeSeries[] = [
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "In a world where hunters must battle deadly monsters to protect mankind, Sung Jinwoo, the weakest hunter of all mankind, finds himself in a struggle for survival in an ultra-deadly double dungeon. After surviving, he awakens with a unique ability: a game-like leveling system.",
    genres: ["Action", "Fantasy", "System", "Overpowered"],
    seasons: [
      {
        seasonNumber: 1,
        seasonTitle: "Season 1",
        episodes: [
          {
            episodeNumber: 1,
            title: "Already Used to Everyday Life",
            synopsis: "Jinwoo and his raid party venture into a seemingly low-rank dungeon, unaware that a terrifying trap is waiting for them in the hidden double dungeon deeper inside.",
            duration: "23:40",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          {
            episodeNumber: 2,
            title: "If I Had One More Chance",
            synopsis: "Trapped in the temple of the God Statues, Jinwoo must decipher the hidden commandments to survive the horrific trials as his teammates panic.",
            duration: "24:10",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          {
            episodeNumber: 3,
            title: "It's Like a Game",
            synopsis: "Jinwoo wakes up in a hospital bed to find a floating video-game-like quest screen that only he can see. He must complete daily physical quests or face deadly penalties.",
            duration: "23:55",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          {
            episodeNumber: 4,
            title: "I've Gotta Get Stronger",
            synopsis: "Jinwoo enters his first instanced solo dungeon—the subway station. He fights hordes of giant lycans and realizes he can literally level up his stats.",
            duration: "24:05",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          {
            episodeNumber: 5,
            title: "A Pretty Good Deal",
            synopsis: "Needing money, Jinwoo joins a C-rank strike team led by Hwang Dongsoo. However, the raid team has a dark secret regarding how they deal with weak players.",
            duration: "23:50",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          {
            episodeNumber: 6,
            title: "The Real Hunt Begins",
            synopsis: "Betrayed and locked inside a giant spider boss room, Jinwoo has to unleash his full combat potential to defeat the beast and confront the traitorous party.",
            duration: "24:15",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          {
            episodeNumber: 7,
            title: "Let's See How Far I Can Go",
            synopsis: "Jinwoo prepares for an incredibly dangerous S-rank quest to gather components for the Elixir of Life, pushing his newly acquired combat powers to the limit.",
            duration: "23:45",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          {
            episodeNumber: 8,
            title: "This is Just the Beginning",
            synopsis: "Jinwoo joins a dungeon raid with standard hunters, encountering a mysterious hunter defense agency inspector with highly suspicious motives.",
            duration: "24:00",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          {
            episodeNumber: 9,
            title: "You've Been Hiding Your Skills",
            synopsis: "The raid goes completely wrong as the inspector betrays the team. Jinwoo is forced to show his true overpowered abilities in front of survivors.",
            duration: "24:20",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          {
            episodeNumber: 10,
            title: "What is This, a Raid?",
            synopsis: "Jinwoo partners with Jinho to run a series of low-level dungeons rapidly, catching the attention of the massive Korean Hunter guilds.",
            duration: "23:52",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          {
            episodeNumber: 11,
            title: "A Knight Who Defends an Empty Throne",
            synopsis: "Jinwoo enters a terrifying Job Change quest dungeon where he must fight endless waves of ghost knights and the terrifying boss, Blood-Red Commander Igris.",
            duration: "24:12",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          },
          {
            episodeNumber: 12,
            title: "Arise",
            synopsis: "Jinwoo successfully changes his class to Necromancer—a rare, dark magic class. He commands the fallen souls of his enemies to rise as his shadow army.",
            duration: "24:45",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          }
        ]
      },
      {
        seasonNumber: 2,
        seasonTitle: "Season 2: Arise from the Shadow",
        episodes: [
          {
            episodeNumber: 1,
            title: "The Shadow Army's First March",
            synopsis: "Jinwoo tests his new Shadow Soldiers in an A-rank dungeon, perfecting his commands while the Hunter Association watches his power escalation in awe.",
            duration: "23:45",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          {
            episodeNumber: 2,
            title: "The Demon Castle's Gateway",
            synopsis: "Armed with the rare key to the multi-level Demon Castle instanced dungeon, Jinwoo initiates a grueling climb to find the ingredients for his mother's cure.",
            duration: "24:15",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          {
            episodeNumber: 3,
            title: "The Elixir of Life",
            synopsis: "Reaching the final floor of the Demon Castle, Jinwoo confronts Baran, the King of Demons, in an epic duel for the purified blood of a divine creature.",
            duration: "24:30",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          {
            episodeNumber: 4,
            title: "The Rank Evaluation",
            synopsis: "Jinwoo resubmits his credentials for re-evaluation, officially shock-waves the entire nation as he is declared Korea's tenth S-rank Hunter.",
            duration: "23:58",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          {
            episodeNumber: 5,
            title: "The Jeju Island Crisis",
            synopsis: "S-rank Hunters assemble as the massive mutated ant colony on Jeju Island breaks boundaries and threatens to annihilate the entire mainland.",
            duration: "24:02",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          {
            episodeNumber: 6,
            title: "A Cold Reunion",
            synopsis: "Jinwoo visits his comatose mother in the hospital, successfully administering the holy water of life to cure her after years of slumber.",
            duration: "24:10",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          {
            episodeNumber: 7,
            title: "The Joint Raid Begins",
            synopsis: "The S-rank strike team from Korea and Japan starts the raid on Jeju Island, clearing initial insect waves, unaware of a hatched supreme disaster.",
            duration: "24:12",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          {
            episodeNumber: 8,
            title: "The Ultimate Predator",
            synopsis: "The terrifying King Ant makes its entrance, instantly decimating several S-rank hunters with overwhelming speed and telepathic fear.",
            duration: "24:20",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          {
            episodeNumber: 9,
            title: "Arise, Jeju!",
            synopsis: "Using Shadow Exchange, Jinwoo instantly teleports onto the island. He unleashes Commander Igris and his full army to face the King Ant.",
            duration: "24:45",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          {
            episodeNumber: 10,
            title: "A New Shadow General",
            synopsis: "After a breathtaking battle, Jinwoo defeats the King Ant and extracts its soul, birthing 'Beru'—his most powerful, loyal shadow commander.",
            duration: "24:08",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          {
            episodeNumber: 11,
            title: "The Gathering Storm",
            synopsis: "The Scavenger guild and Hwang Dongsoo watch Jinwoo's actions. Deep cosmic rifts open globally, revealing giant stone statue designs.",
            duration: "24:14",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          },
          {
            episodeNumber: 12,
            title: "Monarch of Shadows",
            synopsis: "Jinwoo is invited to the Double Dungeon once more. There, he learns the truth of his leveling system and embraces his destiny as the Monarch.",
            duration: "25:30",
            previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            subUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            dubUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          }
        ]
      }
    ]
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan",
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
    genres: ["Action", "Mystery", "Drama", "Thriller", "Military"],
    seasons: [
      {
        seasonNumber: 1,
        seasonTitle: "Season 1",
        episodes: [
          { episodeNumber: 1, title: "To You, in 2000 Years: The Fall of Shiganshina, Part 1", synopsis: "Humanity enjoys a century of peace behind massive walls, until a Colossal Titan suddenly appears and breaches the outer defense.", duration: "24:10", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 2, title: "That Day: The Fall of Shiganshina, Part 2", synopsis: "Eren, Mikasa, and Armin escape the city's destruction. Eren vows absolute vengeance against every single Titan.", duration: "24:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 3, title: "A Dim Light Amid Despair: Humanity's Comeback, Part 1", synopsis: "The trio enlists in the 104th Training Corps, learning the ropes of the vertical maneuvering equipment under tough instructors.", duration: "23:55", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 4, title: "The Night of the Disbanding Ceremony: Humanity's Comeback, Part 2", synopsis: "After five years of grueling training, the cadets graduate. Just as they make plans, the Colossal Titan strikes again.", duration: "24:02", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 5, title: "First Battle: The Struggle for Trost, Part 1", synopsis: "Eren's squad engages the Titans in Trost. In a shocking turn, Eren makes the ultimate sacrifice to save Armin.", duration: "23:58", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 6, title: "The World in the Girl's Eyes: The Struggle for Trost, Part 2", synopsis: "Armin breaks the terrible news to Mikasa. We flash back to how Mikasa and Eren first met as children.", duration: "24:05", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 7, title: "Small Blade: The Struggle for Trost, Part 3", synopsis: "Running low on gas, the cadets lose hope. Mikasa inspires them to fight, only to face a mysterious, rogue Titan that attacks other Titans.", duration: "24:12", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 8, title: "I Can Hear a Heartbeat: The Struggle for Trost, Part 4", synopsis: "The rogue Titan helps clear the supply depot. Armin formulates a daring plan to reclaim the fuel reserves.", duration: "24:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 9, title: "Where the Left Arm Went: The Struggle for Trost, Part 5", synopsis: "A miraculous revelation occurs as Eren emerges from the nape of the rogue Titan, terrifying the military forces.", duration: "23:48", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 10, title: "Response: The Struggle for Trost, Part 6", synopsis: "Armin makes an impassioned plea to the garrison commander, arguing that Eren's Titan powers are a major asset.", duration: "24:03", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 11, title: "Idol: The Struggle for Trost, Part 7", synopsis: "Commanding officer Pixis proposes a daring plan: Eren must carry a giant boulder to seal the hole in Wall Rose.", duration: "24:10", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 12, title: "Wound: The Struggle for Trost, Part 8", synopsis: "In his Titan form, Eren loses control and attacks Mikasa. Armin tries desperately to wake up Eren's consciousness.", duration: "24:15", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 13, title: "Primal Desire: The Struggle for Trost, Part 9", synopsis: "With his mind cleared, Eren successfully carries the boulder and seals the breach, scoring humanity's first victory.", duration: "24:22", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 14, title: "Can't Look into His Eyes Yet: Eve of the Counteroffensive, Part 1", synopsis: "Eren faces a high-stakes military tribunal. The Scout Regiment, led by Commander Erwin, bids to take custody of him.", duration: "23:55", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 15, title: "Special Operations Squad: Eve of the Counteroffensive, Part 2", synopsis: "Eren is assigned to Captain Levi's elite squad and relocated to an old castle headquarters to test his limits.", duration: "24:05", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 16, title: "What Needs to Be Done Now: Eve of the Counteroffensive, Part 3", synopsis: "The cadets of the 104th choose their military branches. Jean joins the Scouts in memory of Marco.", duration: "24:02", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 17, title: "Female Titan: The 57th Exterior Scouting Mission, Part 1", synopsis: "The Scouts venture outside Wall Rose. They are suddenly ambushed by a highly intelligent Female Titan.", duration: "24:11", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 18, title: "Forest of Giant Trees: The 57th Exterior Scouting Mission, Part 2", synopsis: "The Female Titan pursues them into a giant forest. Eren must decide whether to trust his squad or fight solo.", duration: "23:58", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 19, title: "Bite: The 57th Exterior Scouting Mission, Part 3", synopsis: "The Scouts spring a massive trap and capture the Female Titan, but she summons hordes of standard Titans to devour her.", duration: "24:07", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 20, title: "Erwin Smith: The 57th Exterior Scouting Mission, Part 4", synopsis: "The Female Titan escapes by vaporizing into a human form, hunting down Levi's squad one by one.", duration: "24:14", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 21, title: "Crushing Blow: The 57th Exterior Scouting Mission, Part 5", synopsis: "Devastated by the death of his squad, Eren transforms and fights the Female Titan in an epic duel.", duration: "24:18", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 22, title: "The Defeated: The 57th Exterior Scouting Mission, Part 6", synopsis: "Levi and Mikasa execute a rescue mission to pull Eren from the Female Titan's jaws as they retreat.", duration: "24:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 23, title: "Smile: Raid on Stohess District, Part 1", synopsis: "Armin enlists Annie Leonhart's help to smuggle Eren out of Stohess, leading to a shocking confrontation.", duration: "24:05", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 24, title: "Mercy: Raid on Stohess District, Part 2", synopsis: "Annie transforms inside Stohess District. Eren struggles with the emotional weight of fighting a former comrade.", duration: "24:12", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 25, title: "Wall: Raid on Stohess District, Part 3", synopsis: "Eren and Annie collide in a brutal battle. As Annie crystallizes herself, a terrifying secret is revealed in the wall.", duration: "24:30", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }
        ]
      },
      {
        seasonNumber: 2,
        seasonTitle: "Season 2",
        episodes: [
          { episodeNumber: 1, title: "Beast Titan", synopsis: "As Titans appear within Wall Rose, Section Commander Hange inspects a Titan face trapped inside the wall.", duration: "24:02", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 2, title: "I'm Home", synopsis: "Sasha travels to her native village to warn her father and encounters a Titan eating a house.", duration: "23:55", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 3, title: "Southwestward", synopsis: "Conny is horrified to find a Titan lying on top of his family home that cannot move.", duration: "24:10", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 4, title: "Soldier", synopsis: "The recruits are trapped at Utgard Castle under night attack by Titans led by the Beast Titan.", duration: "24:05", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 5, title: "Historia", synopsis: "Ymir reveals a massive secret by transforming into a Titan to save Christa and the recruits.", duration: "24:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 6, title: "Warrior", synopsis: "In one of anime's most shocking scenes, Reiner and Bertholdt casually reveal their true identities to Eren.", duration: "24:15", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 7, title: "Close Combat", synopsis: "Eren battles Reiner's Armored Titan in a martial-arts-focused clash on the wall.", duration: "23:58", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 8, title: "The Hunters", synopsis: "The Scouts gather reinforcements to pursue Reiner and Bertholdt, who have kidnapped Eren.", duration: "24:02", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 9, title: "Opening", synopsis: "Eren and Ymir are held hostage in the Giant Forest, trying to extract answers from Reiner.", duration: "24:08", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 10, title: "Children", synopsis: "Ymir recalls her tragic background as an orphan and her transformation back to human form.", duration: "24:11", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 11, title: "Charge", synopsis: "Erwin leads a desperate cavalry charge directly into a Titan horde to rescue Eren.", duration: "24:13", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 12, title: "Scream", synopsis: "Faced with the Titan that killed his mother, Eren awakens the absolute coordinate power.", duration: "24:40", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }
        ]
      },
      {
        seasonNumber: 3,
        seasonTitle: "Season 3",
        episodes: [
          { episodeNumber: 1, title: "Smoke Signal", synopsis: "Levi's new squad is formed as they go into hiding to protect Eren and Historia from the crown.", duration: "24:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 2, title: "Pain", synopsis: "Levi is hunted by Kenny the Ripper through the streets of Trost in a stunning, high-octane battle.", duration: "24:12", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 3, title: "Old Story", synopsis: "Historia shares her tragic childhood as the illegitimate daughter of Rod Reiss.", duration: "23:55", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 4, title: "Trust", synopsis: "The Scouts work to expose the Military Police's conspiracy to the citizens.", duration: "24:05", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 5, title: "Reply", synopsis: "Commander Erwin orchestrates a flawless bloodless coup d'etat against the fake king.", duration: "24:02", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 6, title: "Sin", synopsis: "Eren learns the truth about how he obtained his Titan powers from his father.", duration: "24:10", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 7, title: "Wish", synopsis: "Historia refuses her father's command to eat Eren, choosing her own destiny.", duration: "24:08", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 8, title: "Outside the Walls of Orvud District", synopsis: "Rod Reiss transforms into a colossal, crawling abomination heading for Orvud.", duration: "24:14", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 9, title: "Ruler of the Walls", synopsis: "Historia delivers the final blow to her father, crowning herself queen of the walls.", duration: "24:15", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 10, title: "Friends", synopsis: "A dying Kenny the Ripper gives Levi a Titan injection serum and shares his philosophy.", duration: "24:01", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 11, title: "Bystander", synopsis: "Eren seeks out Keith Shadis, learning more about his father's arrival in the walls.", duration: "24:05", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 12, title: "Night of the Battle to Reclaim the Wall", synopsis: "The Scouts share a hearty meat feast on the eve of the campaign to reclaim Shiganshina.", duration: "24:20", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 13, title: "The Town Where Everything Began", synopsis: "The Scouts arrive at Shiganshina and quickly realize the enemies are hiding inside the walls.", duration: "24:08", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 14, title: "Thunder Spears", synopsis: "The Scouts deploy a newly developed explosive weapon to penetrate the Armored Titan.", duration: "24:11", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 15, title: "Descent", synopsis: "Bertholdt is thrown over the wall and transforms, unleashing a nuclear-like blast.", duration: "23:59", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 16, title: "Perfect Game", synopsis: "Erwin leads a suicide charge to distract the Beast Titan, buying time for Levi.", duration: "24:05", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 17, title: "Hero", synopsis: "Levi absolutely decimates the Beast Titan, while Armin makes a heroic sacrifice.", duration: "24:15", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 18, title: "Midnight Sun", synopsis: "An agonizing choice must be made: who should receive the serum—Erwin or Armin?", duration: "24:22", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 19, title: "The Basement", synopsis: "Eren finally opens his father's basement door, uncovering the shocking truth of the world.", duration: "24:18", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 20, title: "That Day", synopsis: "Grisha's childhood in the internment zone of Marley is revealed, showing the Eldian struggle.", duration: "24:10", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 21, title: "The Attack Titan", synopsis: "Grisha learns of the nine Titans and inherits the Attack Titan from Eren Kruger.", duration: "24:02", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 22, title: "To the Other Side of the Wall", synopsis: "Six months later, the Scouts venture outside and finally reach the beautiful, endless sea.", duration: "24:45", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }
        ]
      },
      {
        seasonNumber: 4,
        seasonTitle: "Season 4 (Final Season)",
        episodes: [
          { episodeNumber: 1, title: "The Other Side of the Sea", synopsis: "Marley forces, including Gabi and Falco, fight a brutal trench battle against the Mid-East Allied Forces.", duration: "24:05", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 2, title: "Midnight Train", synopsis: "The warrior candidates return home on a military train, reflecting on the brutal costs of war.", duration: "23:58", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 3, title: "The Door of Hope", synopsis: "Reiner recalls his training days in Marley and the heavy weight of infiltrating the walls.", duration: "24:10", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 4, title: "From One Hand to Another", synopsis: "Falco delivers a secret letter for a mysterious, injured Eldian soldier named Kruger.", duration: "24:02", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 5, title: "Declaration of War", synopsis: "In a dark basement, Reiner is reunited with Eren as Willy Tybur declares war on Paradis.", duration: "24:15", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 6, title: "The War Hammer Titan", synopsis: "Eren transforms, killing Willy Tybur. The Scout Regiment launches a shocking surprise attack in Liberio.", duration: "24:11", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 7, title: "Assault", synopsis: "Armin obliterates the Marleyan navy, and Eren brutally uses the Jaw Titan to crush the War Hammer.", duration: "24:14", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 8, title: "Assassin's Bullet", synopsis: "Gabi boards the retreating Scout airship, firing a shot that shocks the fandom forever.", duration: "24:20", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 9, title: "Brave Volunteers", synopsis: "Paradis celebrates their victory but grieves their immense, tragic losses.", duration: "24:05", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 10, title: "A Sound Argument", synopsis: "The military debates the Zeke Jaeger plan, while Eren grows increasingly rebellious.", duration: "24:02", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 11, title: "Deceiver", synopsis: "Gabi and Falco escape custody, finding refuge at Sasha's family farm.", duration: "23:55", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 12, title: "Guides", synopsis: "Eren escapes prison, uniting with his fanatical faction of followers: the Jaegerists.", duration: "24:08", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 13, title: "Children of the Forest", synopsis: "Nicolo reveals the spinal-fluid-tainted wine as a tense confrontation unfolds at the restaurant.", duration: "24:12", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 14, title: "Savagery", synopsis: "Eren confronts Armin and Mikasa, uttering words that tear their bond apart.", duration: "24:15", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 15, title: "Sole Salvation", synopsis: "Zeke recalls his upbringing and how he was converted to the euthanasia plan.", duration: "24:01", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 16, title: "Heaven and Earth", synopsis: "Zeke detonates a thunder spear at point-blank range, leaving Levi severely injured.", duration: "24:22", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 17, title: "Judgment", synopsis: "Marley launches a massive counter-invasion, and Reiner engages Eren in a brutal battle.", duration: "24:08", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 18, title: "Sneak Attack", synopsis: "The Marleyan military forces decimate Paradis defenses, but Zeke finally arrives.", duration: "24:05", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 19, title: "Two Brothers", synopsis: "Eren is decapitated by Gabi, but Zeke catches his head, entering the Paths.", duration: "24:15", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 20, title: "Memories of the Future", synopsis: "Zeke takes Eren through Grisha's memories, only to discover Eren manipulated history.", duration: "24:12", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 21, title: "From You, 2,000 Years Ago", synopsis: "Eren reaches Ymir, freeing her from her chains. He initiates the world-destroying Rumbling.", duration: "24:25", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 22, title: "Thaw", synopsis: "The walls crumble, releasing millions of colossal Titans. Eren declares his genocidal plans.", duration: "24:02", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 23, title: "Sunset", synopsis: "Annie Leonhart wakes up from her crystalline slumber, joining forces with Hitch.", duration: "23:59", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 24, title: "Pride", synopsis: "The remaining Scouts and Marleyan warriors form a desperate alliance to stop Eren.", duration: "24:05", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 25, title: "Night of the End", synopsis: "The alliance members share a tense campfire meal, confronting their mutual atrocities.", duration: "24:12", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 26, title: "Traitor", synopsis: "The alliance battles former comrades at the port to secure the flying boat.", duration: "24:08", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 27, title: "Retrospective", synopsis: "The port battle intensifies. Shadis and Magath make a heroic joint sacrifice.", duration: "24:14", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 28, title: "The Dawn of Humanity", synopsis: "The Rumbling reaches the shores of Marley. Eren remembers his core promise to wipe out the world.", duration: "24:30", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 29, title: "The Final Chapters: Special Part 1 - Section 1", synopsis: "The flying boat takes off as Hange makes a spectacular final stand against the Rumbling.", duration: "25:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 30, title: "The Final Chapters: Special Part 1 - Section 2", synopsis: "Eren summons the alliance to the Paths, declaring that they must fight to the end.", duration: "25:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 31, title: "The Final Chapters: Special Part 1 - Section 3", synopsis: "Marleyan survivors flee to Fort Salta, watching the colossals approach in dread.", duration: "25:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 32, title: "The Final Chapters: Special Part 2 - Section 1", synopsis: "The alliance leaps onto Eren's skeletal Titan form to stop him, initiating the final battle.", duration: "28:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 33, title: "The Final Chapters: Special Part 2 - Section 2", synopsis: "Zeke Jaeger is killed by Levi, halting the Rumbling. Jean detonates explosives around Eren's neck.", duration: "28:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 34, title: "The Final Chapters: Special Part 2 - Section 3", synopsis: "Mikasa enters the Titan's mouth, ending Eren's life with a final, tearful farewell.", duration: "32:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
          { episodeNumber: 35, title: "The Final Chapters: Special Part 2 - Epilogue", synopsis: "The aftermath of the battle. Eldians are freed from the Titan curse, and Armin recounts the final memories Eren shared.", duration: "35:00", previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }
        ]
      }
    ]
  }
];
