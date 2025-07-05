// Image resolution options for AI Image Generator
export interface ImageResolution {
  id: string;
  name: string;
  aspectRatio: string;
  dimensions: string;
  width: number;
  height: number;
}

export const imageResolutions: ImageResolution[] = [
  {
    id: 'square',
    name: 'Square',
    aspectRatio: '1:1',
    dimensions: '1024x1024 px',
    width: 1024,
    height: 1024
  },
  {
    id: 'portrait-9-16',
    name: 'Portrait',
    aspectRatio: '9:16',
    dimensions: '768x1360 px',
    width: 768,
    height: 1360
  },
  {
    id: 'landscape-16-9',
    name: 'Landscape',
    aspectRatio: '16:9',
    dimensions: '1360x768 px',
    width: 1360,
    height: 768
  },
  {
    id: 'portrait-3-4',
    name: 'Portrait',
    aspectRatio: '3:4',
    dimensions: '880x1168 px',
    width: 880,
    height: 1168
  },
  {
    id: 'landscape-4-3',
    name: 'Landscape',
    aspectRatio: '4:3',
    dimensions: '1168x880 px',
    width: 1168,
    height: 880
  },
  {
    id: 'portrait-2-3',
    name: 'Portrait',
    aspectRatio: '2:3',
    dimensions: '832x1248 px',
    width: 832,
    height: 1248
  },
  {
    id: 'landscape-3-2',
    name: 'Landscape',
    aspectRatio: '3:2',
    dimensions: '1248x832 px',
    width: 1248,
    height: 832
  }
];

// Suggested prompts for AI Image Generator
export const suggestedPrompts: string[] = [
  'generate cute fawn cartoon character enjoying springtime flowers in highly detailed',
  'create an (old cartoon illustration) of an abandoned boat on the beach surrounded by seagulls and starfish, stormy clouds',
  'generate a serpent with a hypnotic gaze in a magical wonderland, best quality, masterpiece, ultra sharp, hyper-realistic',
  'generate an 8k ultra-realistic image of a beautiful unicorn in heaven, high quality with rich vibrant vivid colors',
  'design a character in the style of Amy Judd blending with Andre Kohn style:1.1), ((neo-figurative fantasy:1.2)), a young woman made of smoke and fog and delicate misty wisps sitting with her side.',
  'knight fighting a giant fantasy dragon, a burned village in the background, highly detailed, dark fantasy, (morning dawn epic scene of dense smoke by Kim Keever)',
  'generate a (glowing eyes:1. 2) smiling medusa with pale white cracked skin, snakes growing out of her head, dramatic with the best quality',
  'generate a realistic (batman:1.3) holding a powerful magical electric thunder ball spellbook with detailed eyes, cinematic',
  'create a photo of the artistic stone cup with 3D carvings of a muscular teenage ninja turtle in vibrant colors body, decorated with amber accents in dark mountain',
  'generate a feudal ninja fighting bravely against a giant colossus straw puppet boss, hyper-detailed, ultra-detailed',
  'create a pixar character of a bull terrier smiling, high resolution, best quality, ((pixar style))',
  'a dzungarian hamster in an adventurer\'s hat with slimy tentacles made of blue and white porcelain in wonderland, fantasy art concept, best quality, masterpiece',
  'create an ethereal beauty of mystical trees with sparkling blossoms illuminated by a red radiant moon casting its glow upon a tree and large landscape',
  'pixar style of transparent king seahorse with a crown (((luminous))) in the ocean covered with bubbles, high detailed, photorealistic, 8k',
  'Alice fighting a Oompa Loompa with a large sword, hyper detailed, high quality',
  'pixar style of lobster, as a cartoon business man character, tinny cute, ((( luminous))), carring a little suitcase, in the ocean, bubbles, smile, high detailed, photorealistic, 8k , smooth, simple',
  'generate a ((leprechaun)) dancing on a big cauldron full of shiny golden coins in front of a dark cave, (evil laugh), ((clover bushes in the foreground)), god rays of rim light from the small cleft, dense dust, dark fantasy art',
  'pixar style of a chubby giraffe with a big tummy like a ball doing yoga poses in yoga pants, smiling, highly detailed, photorealistic'
];