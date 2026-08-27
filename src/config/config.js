const captions = [
  'one of my favourite people', 'good memories >>>', 'certified cutie', 'main character energy',
  'caught being iconic', 'the chaos was worth it', 'tiny moment, huge vibe', 'no explanation needed',
  'soft launch of a core memory', 'peak happiness', 'camera roll royalty', 'this one stays',
  'zero context, full joy', 'just look at that face', 'a very good day', 'too cute to delete',
  'the plot was plotting', 'good times loading...', 'proof of excellent taste', 'forever a favourite',
  'the smile says it all', 'best kind of silly', 'memory unlocked', 'another one for the wall',
  'always worth replaying', 'one more for the memories',
];

const photoExtensions = [
  'webp', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg',
  'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg',
];

export const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

const config = {
  giftAmount: 'Chocolates',
  giftBurstDuration: 5600,
  giftBurstQuantity: 50,
  photoBoothConfig: {
    defaultName: 'Rushi',
    defaultMessage: 'good vibes only ♡',
    messagePresets: [
      'good vibes only ♡',
      'certified cutie ✨',
      'memory unlocked 🔓',
      'best day ever ♡',
      "Rakhi '26 ♡",
      'forever favourite ✦',
      'chaos & love 💫',
    ],
    posePrompts: [
      'Okay, normal one 👀',
      'Now give me your best pose ✨',
      'Okay... final boss 😭',
    ],
    layouts: ['classic', 'horizontal', 'editorial'],
    layoutLabels: {
      classic: 'Classic Strip',
      horizontal: 'Wide Card',
      editorial: 'Editorial Magazine',
    },
    themes: ['pink', 'lavender', 'peach', 'mono', 'candy'],
    themeLabels: {
      pink: 'Neon Pink',
      lavender: 'Cyber Violet',
      peach: 'Sunset Peach',
      mono: 'Studio Noir',
      candy: 'Candy Pop',
    },
    filters: ['original', 'warm', 'cool', 'bw', 'glow'],
    filterLabels: {
      original: 'Original',
      warm: 'Warm Sun',
      cool: 'Pastel Cool',
      bw: 'B&W Film',
      glow: 'Dream Glow',
    },
  },
  photos: photoExtensions.map((extension, index) => ({
    src: assetUrl(`photos/photo${String(index + 1).padStart(2, '0')}.${extension}`),
    alt: `Memory ${index + 1}`,
    caption: captions[index],
  })),
  songs: [
    { title: 'Song 1', file: assetUrl('music/pktk.mp3') },
    { title: 'Song 2', file: assetUrl('music/mb.mp3') },
  ],
  messages: {
    hero: "Because one Rakhi wasn't enough.",
    camera: 'Okay... now look at the camera 👀',
    gift: 'Because you deserve a little extra today.',
    final: 'Stay exactly the way you are. ♡',
  },
};

export default config;
export const siteConfig = config;
