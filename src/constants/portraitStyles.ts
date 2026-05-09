// src/constants/portraitStyles.ts

export interface PortraitStyle { 
  name: string; 
  imageUrl: string; 
  gender: 'male' | 'female' | 'any';
  prompt: string; 
}

export const portraitStyles: PortraitStyle[] = [

  // --- Male Styles ---
  {
    gender: 'male',
    name: 'Wizard',
    imageUrl: '/images/presets/ai-portrait/Wizard.webp',
    prompt: 'A selfie of a male as a powerful Wizard, wearing magical robes, in a fantasy library setting.'
  },

  {
    gender: 'male',
    name: 'Trench Coat',
    imageUrl: '/images/presets/ai-portrait/Trench Coat.webp',
    prompt: 'A cinematic selfie of a male wearing a stylish Trench Coat on a rainy city street at night.'
  },
  {
    gender: 'male',
    name: 'Sweater',
    imageUrl: '/images/presets/ai-portrait/Sweater.webp',
    prompt: 'A cozy selfie of a male in a warm, knitted sweater, autumn vibes, soft lighting.'
  },
  {
    gender: 'male',
    name: 'Grinch',
    imageUrl: '/images/presets/ai-portrait/Grinch.webp',
    prompt: 'A selfie of a male transformed into the Grinch, with green fur and a mischievous smile, festive theme.'
  },
  {
    gender: 'male',
    name: 'Superhero',
    imageUrl: '/images/presets/ai-portrait/Superhero.webp',
    prompt: 'A dynamic selfie of a male as a powerful Superhero, wearing a modern costume, with a city skyline in the background.'
  },
  {
    gender: 'male',
    name: 'Post Imp',
    imageUrl: '/images/presets/ai-portrait/Post Imp.webp',
    prompt: 'A selfie of a male in a Post-Impressionist art style, with bold colors and expressive brushstrokes.'
  },
  {
    gender: 'male',
    name: 'Abstract',
    imageUrl: '/images/presets/ai-portrait/Abstract.webp',
    prompt: 'A selfie of a male in a vibrant abstract art style, using geometric shapes and non-realistic colors.'
  },


  {
    gender: 'male',
    name: 'Wooden',
    imageUrl: '/images/presets/ai-portrait/Wooden.webp',
    prompt: 'A selfie of a male reimagined as a detailed Wooden sculpture, showing wood grain and texture.'
  },
  {
    gender: 'male',
    name: 'Stone',
    imageUrl: '/images/presets/ai-portrait/Stone.webp',
    prompt: 'A selfie of a male reimagined as a classical Stone sculpture, with a marble or granite texture.'
  },


  {
    gender: 'male',
    name: 'Thriller',
    imageUrl: '/images/presets/ai-portrait/Thriller.webp',
    prompt: 'A selfie of a male in a classic thriller movie style, dramatic shadows, intense expression.'
  },
  {
    gender: 'male',
    name: 'Suave',
    imageUrl: '/images/presets/ai-portrait/Suave.webp',
    prompt: 'A selfie of a suave male in a tailored suit, looking confident and charming, like a secret agent.'
  },
  {
    gender: 'male',
    name: 'Officer',
    imageUrl: '/images/presets/ai-portrait/Officer.webp',
    prompt: 'A professional selfie of a male as a respectable military Officer in a formal uniform.'
  },
  {
    gender: 'male',
    name: 'Cop',
    imageUrl: '/images/presets/ai-portrait/Cop.webp',
    prompt: 'A selfie of a male as a police Cop, wearing a uniform, looking serious and dedicated.'
  },
  {
    gender: 'male',
    name: 'Cyber Warrior',
    imageUrl: '/images/presets/ai-portrait/Cyber Warrior.webp',
    prompt: 'A selfie of a male as a futuristic Cyber Warrior, with high-tech armor and a glowing energy sword.'
  },
  {
    gender: 'male',
    name: 'Viking',
    imageUrl: '/images/presets/ai-portrait/Viking.webp',
    prompt: 'A selfie of a male as a fierce Viking warrior, with braided hair, beard, and traditional armor.'
  },
  {
    gender: 'male',
    name: 'Legacy',
    imageUrl: '/images/presets/ai-portrait/Legacy.webp',
    prompt: 'A selfie of a male with Day of the Dead face paint, celebrating a vibrant legacy with flowers and patterns.'
  },
  {
    gender: 'male',
    name: 'Ancestor',
    imageUrl: '/images/presets/ai-portrait/Ancestor.webp',
    prompt: 'A selfie of a male in the style of a revered Ancestor, with traditional Day of the Dead sugar skull makeup.'
  },
  {
    gender: 'male',
    name: 'Mohawk',
    imageUrl: '/images/presets/ai-portrait/Mohawk.webp',
    prompt: 'A selfie of a male with a cool Mohawk hairstyle, punk rock aesthetic.'
  },
  {
    gender: 'male',
    name: 'Gray',
    imageUrl: '/images/presets/ai-portrait/Gray.webp',
    prompt: 'A selfie of a male with distinguished gray hair, looking handsome and sophisticated.'
  },
  {
    gender: 'male',
    name: 'Sultan',
    imageUrl: '/images/presets/ai-portrait/Sultan.webp',
    prompt: 'A royal selfie of a male as a powerful Sultan, wearing ornate robes and a majestic turban.'
  },
  {
    gender: 'male',
    name: 'Ottoman',
    imageUrl: '/images/presets/ai-portrait/Ottoman.webp',
    prompt: 'A royal selfie of a male in traditional Ottoman empire attire, rich fabrics and intricate details.'
  },
  {
    gender: 'male',
    name: 'Mughal',
    imageUrl: '/images/presets/ai-portrait/Mughal.webp',
    prompt: 'A royal selfie of a male as a Mughal emperor, adorned with jewels and fine silks.'
  },
  {
    gender: 'male',
    name: 'Mayan',
    imageUrl: '/images/presets/ai-portrait/Mayan.webp',
    prompt: 'A royal selfie of a male as a Mayan king, with traditional headdress and intricate carvings.'
  },
  {
    gender: 'male',
    name: 'Heian',
    imageUrl: '/images/presets/ai-portrait/Heian.webp',
    prompt: 'A royal selfie of a male in the style of the Japanese Heian period, elegant and artistic.'
  },
  {
    gender: 'male',
    name: 'European',
    imageUrl: '/images/presets/ai-portrait/European.webp',
    prompt: 'A selfie of a male as classic European royalty, wearing a crown and regal attire.'
  },
  {
    gender: 'male',
    name: 'Chinese',
    imageUrl: '/images/presets/ai-portrait/Chinese.webp',
    prompt: 'A selfie of a male as a historical Chinese emperor, in traditional silk robes.'
  },
  {
    gender: 'male',
    name: 'Byzantine',
    imageUrl: '/images/presets/ai-portrait/Byzantine.webp',
    prompt: 'A selfie of a male in the opulent style of a Byzantine noble, with rich mosaics and gold.'
  },
  {
    gender: 'male',
    name: 'African',
    imageUrl: '/images/presets/ai-portrait/African.webp',
    prompt: 'A selfie of a male as a proud African king, wearing vibrant traditional attire and beads.'
  },
  {
    gender: 'male',
    name: 'Woody',
    imageUrl: '/images/presets/ai-portrait/Wooden.webp',
    prompt: 'A selfie of a male transformed into the cartoon character Woody from Toy Story, 3D animated style.'
  },
  {
    gender: 'male',
    name: 'Tarzaan',
    imageUrl: '/images/presets/ai-portrait/Tarzaan.webp',
    prompt: 'A selfie of a male as the cartoon character Tarzan, in a lush jungle, animated style.'
  },
  {
    gender: 'male',
    name: 'Waist-coat',
    imageUrl: '/images/presets/ai-portrait/Waist-coat.webp',
    prompt: 'A selfie of a male celebrating Diwali, wearing a traditional Kurta with a stylish waist-coat.'
  },
  {
    gender: 'male',
    name: 'Contemporary',
    imageUrl: '/images/presets/ai-portrait/Contemporary.webp',
    prompt: 'A selfie of a male in a contemporary outfit for Diwali, modern and festive.'
  },
  {
    gender: 'male',
    name: 'Adorable',
    imageUrl: '/images/presets/ai-portrait/Adorable.webp',
    prompt: 'An adorable selfie of a male for Valentine\'s Day, with a sweet smile and a background of hearts.'
  },
  {
    gender: 'male',
    name: 'Charming',
    imageUrl: '/images/presets/ai-portrait/Charming.webp',
    prompt: 'A charming selfie of a male on Valentine\'s Day, holding a rose, looking romantic.'
  },
  {
    gender: 'male',
    name: 'Vibrant',
    imageUrl: '/images/presets/ai-portrait/Vibrant.webp',
    prompt: 'A selfie of a male celebrating Holi, face covered in vibrant colored powders.'
  },
  {
    gender: 'male',
    name: 'Phoolrang',
    imageUrl: '/images/presets/ai-portrait/Phoolrang.webp',
    prompt: 'A selfie of a male celebrating Holi with Phoolrang, surrounded by flower petals and colors.'
  },
  {
    gender: 'male',
    name: 'Santa',
    imageUrl: '/images/presets/ai-portrait/Santa.webp',
    prompt: 'A festive selfie of a male dressed as Santa Claus, with a white beard and red hat.'
  },
  {
    gender: 'male',
    name: 'Snow',
    imageUrl: '/images/presets/ai-portrait/Snow.webp',
    prompt: 'A selfie of a male in a winter wonderland, with snow falling gently around him, Christmas theme.'
  },
  {
    gender: 'male',
    name: 'Vibrant',
    imageUrl: '/images/presets/ai-portrait/Vibrant2.webp',
    prompt: 'A selfie of a male at a vibrant New Year\'s party, with confetti and bright lights.'
  },
  {
    gender: 'male',
    name: 'Stylish',
    imageUrl: '/images/presets/ai-portrait/Stylish.webp',
    prompt: 'A stylish selfie of a male dressed up for a New Year\'s celebration, looking sharp in a suit.'
  },



  // --- Female Styles ---
  {
    gender: 'female',
    name: 'Woolen Coat',
    imageUrl: '/images/presets/ai-portrait/female/Woolen Coat.webp',
    prompt: 'A chic selfie of a female in an elegant Woolen Coat, winter fashion in the city.'
  },
  {
    gender: 'female',
    name: 'Tropical',
    imageUrl: '/images/presets/ai-portrait/female/Tropical.webp',
    prompt: 'A selfie of a female in a vibrant Tropical dress, on a sunny beach with palm trees.'
  },
  {
    gender: 'female',
    name: 'Trench Coat',
    imageUrl: '/images/presets/ai-portrait/female/Trench Coat.webp',
    prompt: 'A selfie of a female wearing a classic Trench Coat, sophisticated and timeless look, autumn setting.'
  },
  {
    gender: 'female',
    name: 'Sweater',
    imageUrl: '/images/presets/ai-portrait/female/Sweater.webp',
    prompt: 'A cozy selfie of a female wearing a soft, warm sweater, holding a cup of coffee.'
  },
  {
    gender: 'female',
    name: 'Stylish',
    imageUrl: '/images/presets/ai-portrait/female/Stylish.webp',
    prompt: 'A selfie of a very stylish female in a high-fashion outfit, looking ready for a magazine cover.'
  },
  {
    gender: 'female',
    name: 'Street Style',
    imageUrl: '/images/presets/ai-portrait/female/Street Style.webp',
    prompt: 'A selfie of a female with an edgy Street Style look, in a cool urban environment.'
  },
  {
    gender: 'female',
    name: 'Poncho',
    imageUrl: '/images/presets/ai-portrait/female/Poncho.webp',
    prompt: 'A selfie of a female wearing a fashionable, patterned Poncho, bohemian and chic.'
  },
  {
    gender: 'female',
    name: 'Nightdress',
    imageUrl: '/images/presets/ai-portrait/female/Nightdress.webp',
    prompt: 'A selfie of a female in an elegant silk Nightdress, soft and dreamy bedroom setting.'
  },
  {
    gender: 'female',
    name: 'Jacket',
    imageUrl: '/images/presets/ai-portrait/female/Jacket.webp',
    prompt: 'A selfie of a female in a cool leather Jacket, exuding confidence and style.'
  },
  {
    gender: 'female',
    name: 'Cocktail',
    imageUrl: '/images/presets/ai-portrait/female/Cocktail.webp',
    prompt: 'A selfie of a female in a stunning Cocktail dress, ready for an evening event.'
  },
  {
    gender: 'female',
    name: 'Classic Black',
    imageUrl: '/images/presets/ai-portrait/female/Classic Black.webp',
    prompt: 'A selfie of a female in a timeless, classic black dress, sophisticated and elegant.'
  },
  {
    gender: 'female',
    name: 'Boho',
    imageUrl: '/images/presets/ai-portrait/female/Boho.webp',
    prompt: 'A selfie of a female with a Boho-chic style, flowy dress, and earthy accessories.'
  },
  {
    gender: 'female',
    name: 'Bodysuit',
    imageUrl: '/images/presets/ai-portrait/female/Bodysuit.webp',
    prompt: 'A selfie of a female in a sleek and stylish Bodysuit, modern and fashionable.'
  },
  {
    gender: 'female',
    name: 'Blazer',
    imageUrl: '/images/presets/ai-portrait/female/Blazer.webp',
    prompt: 'A selfie of a female looking sharp and professional in a well-fitted Blazer.'
  },
  {
    gender: 'female',
    name: 'Athleisure',
    imageUrl: '/images/presets/ai-portrait/female/Athleisure.webp',
    prompt: 'A selfie of a female in trendy Athleisure wear, sporty, comfortable, and stylish.'
  },
  {
    gender: 'female',
    name: 'Aesthetic',
    imageUrl: '/images/presets/ai-portrait/female/Aesthetic.webp',
    prompt: 'A selfie of a female with a soft, dreamy aesthetic, pastel colors, and artistic flair.'
  },
  {
    gender: 'female',
    name: 'Goddess',
    imageUrl: '/images/presets/ai-portrait/female/Goddess.webp',
    prompt: 'A selfie of a female transformed into a divine Goddess, with ethereal light and a powerful aura.'
  },
  {
    gender: 'female',
    name: 'Romanticism',
    imageUrl: '/images/presets/ai-portrait/female/Romanticism.webp',
    prompt: 'A selfie of a female in the style of a Romanticism painting, dramatic, emotional, and beautiful.'
  },
  {
    gender: 'female',
    name: 'Abstract',
    imageUrl: '/images/presets/ai-portrait/female/Abstract.webp',
    prompt: 'A selfie of a female rendered in a colorful abstract painting style, bold shapes and lines.'
  },

  {
    gender: 'female',
    name: 'Goddess',
    imageUrl: '/images/presets/ai-portrait/female/Goddess2.webp',
    prompt: 'A fantasy selfie of a female as a celestial Goddess, surrounded by stars and cosmic energy.'
  },
  {
    gender: 'female',
    name: 'Viking',
    imageUrl: '/images/presets/ai-portrait/female/Viking.webp',
    prompt: 'A selfie of a female as a strong Viking warrior, with intricate braids and leather armor.'
  },
  {
    gender: 'female',
    name: 'Tribal',
    imageUrl: '/images/presets/ai-portrait/female/Tribal.webp',
    prompt: 'A selfie of a female with beautiful tribal face paint and traditional accessories, proud and powerful.'
  },
  {
    gender: 'female',
    name: 'Soulful',
    imageUrl: '/images/presets/ai-portrait/female/Soulful.webp',
    prompt: 'A soulful selfie of a female with artistic Day of the Dead makeup, celebrating life and memory.'
  },
  {
    gender: 'female',
    name: 'Sacred',
    imageUrl: '/images/presets/ai-portrait/female/Sacred.webp',
    prompt: 'A selfie of a female with sacred Day of the Dead sugar skull art, adorned with marigolds.'
  },
  {
    gender: 'female',
    name: 'Black Stone',
    imageUrl: '/images/presets/ai-portrait/female/Black Stone.webp',
    prompt: 'A selfie of a female reimagined as an elegant Black Stone sculpture, polished and dramatic.'
  },
  {
    gender: 'female',
    name: 'Stone',
    imageUrl: '/images/presets/ai-portrait/female/Stone.webp',
    prompt: 'A selfie of a female as a graceful Greco-Roman stone sculpture, timeless beauty.'
  },
  {
    gender: 'female',
    name: 'Wavy',
    imageUrl: '/images/presets/ai-portrait/female/Wavy.webp',
    prompt: 'A selfie of a female with beautiful, long wavy hair, looking natural and effortless.'
  },
  {
    gender: 'female',
    name: 'Victoria Roll',
    imageUrl: '/images/presets/ai-portrait/female/Victoria Roll.webp',
    prompt: 'A selfie of a female with an elegant Victoria Roll hairstyle, classic and sophisticated.'
  },
  {
    gender: 'female',
    name: 'Clothes',
    imageUrl: '/images/presets/ai-portrait/female/Clothes.webp',
    prompt: 'A selfie of a female in futuristic clothes with glowing neon accents, cyberpunk fashion.'
  },
  {
    gender: 'female',
    name: 'Space Explorer',
    imageUrl: '/images/presets/ai-portrait/female/Space Explorer.webp',
    prompt: 'A selfie of a female as a neon Space Explorer, with a futuristic suit and helmet.'
  },
  {
    gender: 'female',
    name: 'Spain',
    imageUrl: '/images/presets/ai-portrait/female/Spain.webp',
    prompt: 'A selfie of a female as Spanish royalty, wearing a traditional, elegant gown.'
  },
  {
    gender: 'female',
    name: 'Queen',
    imageUrl: '/images/presets/ai-portrait/female/Queen.webp',
    prompt: 'A royal selfie of a female as a powerful Queen, wearing a crown and regal jewelry.'
  },













];

export const suggestedPortraitPrompts = [
  'Professional headshot with soft lighting',
  'Artistic portrait with dramatic shadows',
  'Vintage style with warm tones',
  'Modern minimalist portrait',
  'Fantasy character transformation',
  'Cinematic movie poster style',
  'Oil painting classical portrait',
  'Digital art cyberpunk style'
];