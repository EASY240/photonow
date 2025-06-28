// src/constants/avatarStyles.ts

export interface AvatarStyle { 
  name: string; 
  imageUrl: string; 
  gender: 'male' | 'female';
  prompt: string; 
}

export const avatarStyles: AvatarStyle[] = [
    // Male Styles
  {
    name: 'Action Figure',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_avatar/1745922035468.jpg',
    gender: 'male',
    prompt: 'A photorealistic portrait of a male as an Action Figure, dynamic pose, plastic texture, cinematic lighting.'
  },
  {
    name: 'Celebrity',
    imageUrl: 'https://d2k373fi2nomq1.cloudfront.net/7966a18a3de743c3b899e8ef13db2563/8a2d11fcfc2041209dbf40df261096f6',
    gender: 'male',
    prompt: 'A high-fashion portrait of a male celebrity, magazine cover style, sharp focus, glamorous.'
  },
  {
    name: 'Superhero',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/superhero.jpg',
    gender: 'male',
    prompt: 'A cinematic portrait of a male superhero, dramatic lighting, detailed costume, powerful expression.'
  },
  {
    name: 'Warrior',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/warrior.jpg',
    gender: 'male',
    prompt: 'A gritty portrait of a male warrior, ancient armor, battle-worn, epic fantasy style.'
  },
  {
    name: 'Muscular',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/mascular.jpg',
    gender: 'male',
    prompt: 'A fitness portrait of a muscular male, strong physique, dramatic shadows, powerful stance.'
  },
  {
    name: 'Anime',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/anime.jpg',
    gender: 'male',
    prompt: 'A portrait of a male in a vibrant Japanese anime style, sharp lines, expressive eyes.'
  },
  {
    name: 'Fantasy',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/fantasy.jpg',
    gender: 'male',
    prompt: 'A portrait of a male in a high-fantasy style, elven or magical elements, ethereal lighting.'
  },
  {
    name: 'Vintage',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/vintage.jpg',
    gender: 'male',
    prompt: 'A portrait of a male in a vintage, old-fashioned photograph style, sepia tones, classic attire.'
  },
  {
    name: 'Sci-Fi',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/sci_fi.jpg',
    gender: 'male',
    prompt: 'A futuristic portrait of a male in a sci-fi setting, neon lights, advanced technology, space explorer.'
  },
  {
    name: 'Cyberpunk',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/cyberpunk.jpg',
    gender: 'male',
    prompt: 'A portrait of a male in a cyberpunk style, neon-drenched city, cybernetic enhancements, dystopian future.'
  },
  {
    name: 'Steampunk',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/steampunk.jpg',
    gender: 'male',
    prompt: 'A portrait of a male in a steampunk style, victorian clothing with brass gears and clockwork.'
  },
  {
    name: 'Medieval',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/medieval.jpg',
    gender: 'male',
    prompt: 'A portrait of a male knight in a medieval style, shining armor, castle background.'
  },
  {
    name: 'Celeb',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/hollywood.jpg',
    gender: 'male',
    prompt: 'A portrait of a male as a Hollywood celebrity on the red carpet, paparazzi flashes, glamorous.'
  },
  {
    name: 'Doll',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/doll.jpg',
    gender: 'male',
    prompt: 'A portrait of a male as a polished, porcelain doll, perfectly crafted features.'
  },
  {
    name: 'Astronaut',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/astronaut.jpg',
    gender: 'male',
    prompt: 'A portrait of a male astronaut in a spacesuit, reflection of stars in the helmet visor.'
  },
  {
    name: 'Cartoon',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/cartoon.jpg',
    gender: 'male',
    prompt: 'A portrait of a male in a modern 3D cartoon style, like a character from an animated movie.'
  },
  {
    name: 'Sculpture',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/sculpture.jpg',
    gender: 'male',
    prompt: 'A portrait of a male as a classical marble sculpture, detailed stone texture, dramatic lighting.'
  },
  {
    name: 'Alien',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/alien.jpg',
    gender: 'male',
    prompt: 'A portrait of a male as a friendly or mysterious alien being, otherworldly features.'
  },
  {
    name: 'Cyborg',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/cyborg.jpg',
    gender: 'male',
    prompt: 'A portrait of a male as a cyborg, blending human and machine, glowing circuits.'
  },
  {
    name: 'Zombie',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/zombie.jpg',
    gender: 'male',
    prompt: 'A stylized portrait of a male as a zombie, post-apocalyptic theme.'
  },
  {
    name: 'Spooky',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/spooky.jpg',
    gender: 'male',
    prompt: 'A spooky, gothic horror portrait of a male, dark atmosphere, mysterious shadows.'
  },
  {
    name: 'Clown',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/Clown.jpg',
    gender: 'male',
    prompt: 'A portrait of a male as a friendly circus clown, colorful makeup and costume.'
  },
  {
    name: 'Halloween',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/male.png',
    gender: 'male',
    prompt: 'A portrait of a male in a fun Halloween costume, jack-o-lanterns and spooky decorations.'
  },
  {
    name: 'Diwali',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/Diwali/002.png',
    gender: 'male',
    prompt: 'A portrait of a male celebrating Diwali, traditional Indian attire, festive lights (diyas).'
  },
  {
    name: 'Christmas',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/male/Christmas_male512.png',
    gender: 'male',
    prompt: 'A festive portrait of a male in a Christmas setting, wearing a Santa hat or ugly sweater.'
  },
  {
    name: 'Surprises',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/29.jpg',
    gender: 'male',
    prompt: 'A fun, surprising portrait of a male, maybe with confetti or a pop art background.'
  },

  // Female Styles
  {
    name: 'Action Figure',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_avatar/1745922059362.png',
    gender: 'female',
    prompt: 'A photorealistic portrait of a female as an Action Figure, dynamic pose, plastic texture, cinematic lighting.'
  },
  {
    name: 'Celebrity',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_avatar/1745233095138.jpg',
    gender: 'female',
    prompt: 'A high-fashion portrait of a female celebrity, magazine cover style, sharp focus, glamorous.'
  },
  {
    name: 'Doll',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/doll.jpg',
    gender: 'female',
    prompt: 'A portrait of a female as a beautiful, polished doll with perfect features, vibrant outfit.'
  },
  {
    name: 'Warrior',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/warrior.jpg',
    gender: 'female',
    prompt: 'A gritty portrait of a female warrior, ornate armor, determined expression, epic fantasy style.'
  },
  {
    name: 'Muscular',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/mascular.jpg',
    gender: 'female',
    prompt: 'A fitness portrait of a muscular female, strong and toned physique, dramatic shadows, athletic stance.'
  },
  {
    name: 'Superhero',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/superhero.jpg',
    gender: 'female',
    prompt: 'A cinematic portrait of a female superhero, dramatic lighting, detailed costume, powerful expression.'
  },
  {
    name: 'Vintage',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/vintage.jpg',
    gender: 'female',
    prompt: 'A portrait of a female in a vintage, old-fashioned photograph style, sepia tones, classic 1920s glamour.'
  },
  {
    name: 'Fantasy',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/fantasy.jpg',
    gender: 'female',
    prompt: 'A portrait of a female in a high-fantasy style, as an elegant elf or powerful sorceress, ethereal lighting.'
  },
  {
    name: 'Medieval',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/medieval.jpg',
    gender: 'female',
    prompt: 'A portrait of a female queen or princess in a medieval style, elegant gown, castle background.'
  },
  {
    name: 'Anime',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/anime.jpg',
    gender: 'female',
    prompt: 'A portrait of a female in a vibrant Japanese anime style, sharp lines, large expressive eyes.'
  },
  {
    name: 'Steampunk',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/steampunk.jpg',
    gender: 'female',
    prompt: 'A portrait of a female in a steampunk style, victorian dress with brass goggles and clockwork details.'
  },
  {
    name: 'Sci-Fi',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/sci_fi.jpg',
    gender: 'female',
    prompt: 'A futuristic portrait of a female in a sci-fi setting, sleek armor, neon lights, space explorer.'
  },
  {
    name: 'Spooky',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/spooky.jpg',
    gender: 'female',
    prompt: 'A spooky, gothic horror portrait of a female, ghostly appearance, dark and mysterious atmosphere.'
  },
  {
    name: 'Cyberpunk',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/cyberpunk.jpg',
    gender: 'female',
    prompt: 'A portrait of a female in a cyberpunk style, neon-drenched city, cybernetic enhancements, dystopian future.'
  },
  {
    name: 'Celeb',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/hollywood.jpg',
    gender: 'female',
    prompt: 'A portrait of a female as a Hollywood celebrity on the red carpet, paparazzi flashes, glamorous gown.'
  },
  {
    name: 'Astronaut',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/astronaut.jpg',
    gender: 'female',
    prompt: 'A portrait of a female astronaut in a spacesuit, reflection of Earth in the helmet visor.'
  },
  {
    name: 'Alien',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/alien.jpg',
    gender: 'female',
    prompt: 'A portrait of a female as a beautiful and mysterious alien queen, otherworldly features.'
  },
  {
    name: 'Cartoon',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/cartoon.jpg',
    gender: 'female',
    prompt: 'A portrait of a female in a modern 3D cartoon style, like a character from a Disney or Pixar movie.'
  },
  {
    name: 'Cyborg',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/cyborg.jpg',
    gender: 'female',
    prompt: 'A portrait of a female as a cyborg, elegant blend of human and machine, glowing circuits.'
  },
  {
    name: 'Zombie',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/zombie.jpg',
    gender: 'female',
    prompt: 'A stylized portrait of a female as a zombie, post-apocalyptic survivor theme.'
  },
  {
    name: 'Clown',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/Clown.jpg',
    gender: 'female',
    prompt: 'A portrait of a female as a charming circus clown or pierrot, colorful and friendly makeup.'
  },
  {
    name: 'Sculpture',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/sculpture.jpg',
    gender: 'female',
    prompt: 'A portrait of a female as a graceful classical marble sculpture, detailed stone texture, museum lighting.'
  },
  {
    name: 'Halloween',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/female.png',
    gender: 'female',
    prompt: 'A portrait of a female in a fun Halloween costume, like a witch or vampire, with spooky decorations.'
  },
  {
    name: 'Diwali',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/Diwali/001.png',
    gender: 'female',
    prompt: 'A portrait of a female celebrating Diwali, wearing a beautiful traditional saree, festive lights (diyas).'
  },
  {
    name: 'Christmas',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/female/Christmas_female512.png',
    gender: 'female',
    prompt: 'A festive portrait of a female in a Christmas setting, warm cozy sweater, by a decorated tree.'
  },
  {
    name: 'Valentine\'s Day',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_avatar_styles_thumbs/36.jpg',
    gender: 'female',
    prompt: 'A romantic portrait of a female for Valentine\'s Day, surrounded by hearts and roses, soft lighting.'
  },
];