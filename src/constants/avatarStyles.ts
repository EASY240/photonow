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
    imageUrl: '/images/presets/ai-avatar/Action Figure.webp',
    gender: 'male',
    prompt: 'A photorealistic portrait of a male as an Action Figure, dynamic pose, plastic texture, cinematic lighting.'
  },
  {
    name: 'Celebrity',
    imageUrl: '/images/presets/ai-avatar/Celebrity.webp',
    gender: 'male',
    prompt: 'A high-fashion portrait of a male celebrity, magazine cover style, sharp focus, glamorous.'
  },
  {
    name: 'Superhero',
    imageUrl: '/images/presets/ai-avatar/Superhero.webp',
    gender: 'male',
    prompt: 'A cinematic portrait of a male superhero, dramatic lighting, detailed costume, powerful expression.'
  },
  {
    name: 'Warrior',
    imageUrl: '/images/presets/ai-avatar/Warrior.webp',
    gender: 'male',
    prompt: 'A gritty portrait of a male warrior, ancient armor, battle-worn, epic fantasy style.'
  },
  {
    name: 'Muscular',
    imageUrl: '/images/presets/ai-avatar/Muscular.webp',
    gender: 'male',
    prompt: 'A fitness portrait of a muscular male, strong physique, dramatic shadows, powerful stance.'
  },
  {
    name: 'Anime',
    imageUrl: '/images/presets/ai-avatar/Anime.webp',
    gender: 'male',
    prompt: 'A portrait of a male in a vibrant Japanese anime style, sharp lines, expressive eyes.'
  },
  {
    name: 'Fantasy',
    imageUrl: '/images/presets/ai-avatar/Fantasy.webp',    
    gender: 'male',
    prompt: 'A portrait of a male in a high-fantasy style, elven or magical elements, ethereal lighting.'
  },
  {
    name: 'Vintage',
    imageUrl: '/images/presets/ai-avatar/Vintage.webp',
    gender: 'male',
    prompt: 'A portrait of a male in a vintage, old-fashioned photograph style, sepia tones, classic attire.'
  },
  {
    name: 'Sci-Fi',
    imageUrl: '/images/presets/ai-avatar/Sci-Fi.webp',
    gender: 'male',
    prompt: 'A futuristic portrait of a male in a sci-fi setting, neon lights, advanced technology, space explorer.'
  },
  {
    name: 'Cyberpunk',
    imageUrl: '/images/presets/ai-avatar/Cyberpunk.webp',
    gender: 'male',
    prompt: 'A portrait of a male in a cyberpunk style, neon-drenched city, cybernetic enhancements, dystopian future.'
  },
  {
    name: 'Steampunk',
    imageUrl: '/images/presets/ai-avatar/Steampunk.webp',
    gender: 'male',
    prompt: 'A portrait of a male in a steampunk style, victorian clothing with brass gears and clockwork.'
  },
  {
    name: 'Medieval',
    imageUrl: '/images/presets/ai-avatar/Medieval.webp',
    gender: 'male',
    prompt: 'A portrait of a male knight in a medieval style, shining armor, castle background.'
  },
  {
    name: 'Celeb',
    imageUrl: '/images/presets/ai-avatar/Celeb.webp',
    gender: 'male',
    prompt: 'A portrait of a male as a Hollywood celebrity on the red carpet, paparazzi flashes, glamorous.'
  },
  {
    name: 'Doll',
    imageUrl: '/images/presets/ai-avatar/Doll.webp',
    gender: 'male',
    prompt: 'A portrait of a male as a polished, porcelain doll, perfectly crafted features.'
  },
  {
    name: 'Astronaut',
    imageUrl: '/images/presets/ai-avatar/Astronaut.webp',
    gender: 'male',
    prompt: 'A portrait of a male astronaut in a spacesuit, reflection of stars in the helmet visor.'
  },
  {
    name: 'Cartoon',
    imageUrl: '/images/presets/ai-avatar/Cartoon.webp',
    gender: 'male',
    prompt: 'A portrait of a male in a modern 3D cartoon style, like a character from an animated movie.'
  },
  {
    name: 'Sculpture',
    imageUrl: '/images/presets/ai-avatar/Sculpture.webp',
    gender: 'male',
    prompt: 'A portrait of a male as a classical marble sculpture, detailed stone texture, dramatic lighting.'
  },
  {
    name: 'Alien',
    imageUrl: '/images/presets/ai-avatar/Alien.webp',
    gender: 'male',
    prompt: 'A portrait of a male as a friendly or mysterious alien being, otherworldly features.'
  },
  {
    name: 'Cyborg',
    imageUrl: '/images/presets/ai-avatar/Cyborg.webp',
    gender: 'male',
    prompt: 'A portrait of a male as a cyborg, blending human and machine, glowing circuits.'
  },
  {
    name: 'Zombie',
    imageUrl: '/images/presets/ai-avatar/Zombie.webp',
    gender: 'male',
    prompt: 'A stylized portrait of a male as a zombie, post-apocalyptic theme.'
  },
  {
    name: 'Spooky',
    imageUrl: '/images/presets/ai-avatar/Spooky.webp',
    gender: 'male',
    prompt: 'A spooky, gothic horror portrait of a male, dark atmosphere, mysterious shadows.'
  },
  {
    name: 'Clown',
    imageUrl: '/images/presets/ai-avatar/Clown.webp',
    gender: 'male',
    prompt: 'A portrait of a male as a friendly circus clown, colorful makeup and costume.'
  },
  {
    name: 'Halloween',
    imageUrl: '/images/presets/ai-avatar/Halloween.webp',
    gender: 'male',
    prompt: 'A portrait of a male in a fun Halloween costume, jack-o-lanterns and spooky decorations.'
  },
  {
    name: 'Diwali',
    imageUrl: '/images/presets/ai-avatar/Diwali.webp',
    gender: 'male',
    prompt: 'A portrait of a male celebrating Diwali, traditional Indian attire, festive lights (diyas).'
  },
  {
    name: 'Christmas',
    imageUrl: '/images/presets/ai-avatar/Christmas.webp',
    gender: 'male',
    prompt: 'A festive portrait of a male in a Christmas setting, wearing a Santa hat or ugly sweater.'
  },
  {
    name: 'Surprises',
    imageUrl: '/images/presets/ai-avatar/Surprises.webp',
    gender: 'male',
    prompt: 'A fun, surprising portrait of a male, maybe with confetti or a pop art background.'
  },

  // Female Styles
  {
    name: 'Action Figure',
    imageUrl: '/images/presets/ai-avatar/female/Action Figure.webp',
    gender: 'female',
    prompt: 'A photorealistic portrait of a female as an Action Figure, dynamic pose, plastic texture, cinematic lighting.'
  },
  {
    name: 'Doll',
    imageUrl: '/images/presets/ai-avatar/female/Doll.webp',
    gender: 'female',
    prompt: 'A portrait of a female as a beautiful, polished doll with perfect features, vibrant outfit.'
  },
  {
    name: 'Warrior',
    imageUrl: '/images/presets/ai-avatar/female/Warrior.webp',
    gender: 'female',
    prompt: 'A gritty portrait of a female warrior, ornate armor, determined expression, epic fantasy style.'
  },
  {
    name: 'Muscular',
    imageUrl: '/images/presets/ai-avatar/female/Muscular.webp',
    gender: 'female',
    prompt: 'A fitness portrait of a muscular female, strong and toned physique, dramatic shadows, athletic stance.'
  },
  {
    name: 'Superhero',
    imageUrl: '/images/presets/ai-avatar/female/Superhero.webp',
    gender: 'female',
    prompt: 'A cinematic portrait of a female superhero, dramatic lighting, detailed costume, powerful expression.'
  },
  {
    name: 'Vintage',
    imageUrl: '/images/presets/ai-avatar/female/Vintage.webp',
    gender: 'female',
    prompt: 'A portrait of a female in a vintage, old-fashioned photograph style, sepia tones, classic 1920s glamour.'
  },
  {
    name: 'Fantasy',
    imageUrl: '/images/presets/ai-avatar/female/Fantasy.webp',
    gender: 'female',
    prompt: 'A portrait of a female in a high-fantasy style, as an elegant elf or powerful sorceress, ethereal lighting.'
  },
  {
    name: 'Medieval',
    imageUrl: '/images/presets/ai-avatar/female/Medieval.webp',
    gender: 'female',
    prompt: 'A portrait of a female queen or princess in a medieval style, elegant gown, castle background.'
  },
  {
    name: 'Anime',
    imageUrl: '/images/presets/ai-avatar/female/Anime.webp',
    gender: 'female',
    prompt: 'A portrait of a female in a vibrant Japanese anime style, sharp lines, large expressive eyes.'
  },
  {
    name: 'Steampunk',
    imageUrl: '/images/presets/ai-avatar/female/Steampunk.webp',
    gender: 'female',
    prompt: 'A portrait of a female in a steampunk style, victorian dress with brass goggles and clockwork details.'
  },
  {
    name: 'Sci-Fi',
    imageUrl: '/images/presets/ai-avatar/female/Sci-Fi.webp',
    gender: 'female',
    prompt: 'A futuristic portrait of a female in a sci-fi setting, sleek armor, neon lights, space explorer.'
  },
  {
    name: 'Spooky',
    imageUrl: '/images/presets/ai-avatar/female/Spooky.webp',
    gender: 'female',
    prompt: 'A spooky, gothic horror portrait of a female, ghostly appearance, dark and mysterious atmosphere.'
  },
  {
    name: 'Cyberpunk',
    imageUrl: '/images/presets/ai-avatar/female/Cyberpunk.webp',
    gender: 'female',
    prompt: 'A portrait of a female in a cyberpunk style, neon-drenched city, cybernetic enhancements, dystopian future.'
  },
  {
    name: 'Astronaut',
    imageUrl: '/images/presets/ai-avatar/female/Astronaut.webp', 
    gender: 'female',
    prompt: 'A portrait of a female astronaut in a spacesuit, reflection of Earth in the helmet visor.'
  },
  {
    name: 'Alien',
    imageUrl: '/images/presets/ai-avatar/female/Alien.webp',
    gender: 'female',
    prompt: 'A portrait of a female as a beautiful and mysterious alien queen, otherworldly features.'
  },
  {
    name: 'Cartoon',
    imageUrl: '/images/presets/ai-avatar/female/Cartoon.webp',
    gender: 'female',
    prompt: 'A portrait of a female in a modern 3D cartoon style, like a character from a Disney or Pixar movie.'
  },
  {
    name: 'Cyborg',
    imageUrl: '/images/presets/ai-avatar/female/Cyborg.webp',
    gender: 'female',
    prompt: 'A portrait of a female as a cyborg, elegant blend of human and machine, glowing circuits.'
  },
  {
    name: 'Zombie',
    imageUrl: '/images/presets/ai-avatar/female/Zombie.webp',
    gender: 'female',
    prompt: 'A stylized portrait of a female as a zombie, post-apocalyptic survivor theme.'
  },
  {
    name: 'Clown',
    imageUrl: '/images/presets/ai-avatar/female/Clown.webp',
    gender: 'female',
    prompt: 'A portrait of a female as a charming circus clown or pierrot, colorful and friendly makeup.'
  },
  {
    name: 'Sculpture',
    imageUrl: '/images/presets/ai-avatar/female/Sculpture.webp',
    gender: 'female',
    prompt: 'A portrait of a female as a graceful classical marble sculpture, detailed stone texture, museum lighting.'
  },
  {
    name: 'Halloween',
    imageUrl: '/images/presets/ai-avatar/female/Halloween.webp',
    gender: 'female',
    prompt: 'A portrait of a female in a fun Halloween costume, like a witch or vampire, with spooky decorations.'
  },
  {
    name: 'Diwali',
    imageUrl: '/images/presets/ai-avatar/female/Diwali.webp',
    gender: 'female',
    prompt: 'A portrait of a female celebrating Diwali, wearing a beautiful traditional saree, festive lights (diyas).'
  },
  {
    name: 'Christmas',
    imageUrl: '/images/presets/ai-avatar/female/Christmas.webp',
    gender: 'female',
    prompt: 'A festive portrait of a female in a Christmas setting, warm cozy sweater, by a decorated tree.'
  },
  {
    name: 'Valentine\'s Day',
    imageUrl: '/images/presets/ai-avatar/female/Valentine.webp',
    gender: 'female',
    prompt: 'A romantic portrait of a female for Valentine\'s Day, surrounded by hearts and roses, soft lighting.'
  },
];