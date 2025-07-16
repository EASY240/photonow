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
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721888196773.jpg',
    prompt: 'A selfie of a male as a powerful Wizard, wearing magical robes, in a fantasy library setting.'
  },

  {
    gender: 'male',
    name: 'Trench Coat',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721890586882.jpg',
    prompt: 'A cinematic selfie of a male wearing a stylish Trench Coat on a rainy city street at night.'
  },
  {
    gender: 'male',
    name: 'Sweater',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721890586740.jpg',
    prompt: 'A cozy selfie of a male in a warm, knitted sweater, autumn vibes, soft lighting.'
  },
  {
    gender: 'male',
    name: 'Grinch',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/a7b8a481-8776-4589-b1bb-9c021da759f5.jpg',
    prompt: 'A selfie of a male transformed into the Grinch, with green fur and a mischievous smile, festive theme.'
  },
  {
    gender: 'male',
    name: 'Superhero',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721817393935.jpg',
    prompt: 'A dynamic selfie of a male as a powerful Superhero, wearing a modern costume, with a city skyline in the background.'
  },
  {
    gender: 'male',
    name: 'Post Imp',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721891374496.jpg',
    prompt: 'A selfie of a male in a Post-Impressionist art style, with bold colors and expressive brushstrokes.'
  },
  {
    gender: 'male',
    name: 'Abstract',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721891373055.jpg',
    prompt: 'A selfie of a male in a vibrant abstract art style, using geometric shapes and non-realistic colors.'
  },


  {
    gender: 'male',
    name: 'Wooden',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721820777377.jpg',
    prompt: 'A selfie of a male reimagined as a detailed Wooden sculpture, showing wood grain and texture.'
  },
  {
    gender: 'male',
    name: 'Stone',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721820777195.jpg',
    prompt: 'A selfie of a male reimagined as a classical Stone sculpture, with a marble or granite texture.'
  },


  {
    gender: 'male',
    name: 'Thriller',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721821925211.jpg',
    prompt: 'A selfie of a male in a classic thriller movie style, dramatic shadows, intense expression.'
  },
  {
    gender: 'male',
    name: 'Suave',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721821925057.jpg',
    prompt: 'A selfie of a suave male in a tailored suit, looking confident and charming, like a secret agent.'
  },
  {
    gender: 'male',
    name: 'Officer',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721890916035.jpg',
    prompt: 'A professional selfie of a male as a respectable military Officer in a formal uniform.'
  },
  {
    gender: 'male',
    name: 'Cop',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721890915894.jpg',
    prompt: 'A selfie of a male as a police Cop, wearing a uniform, looking serious and dedicated.'
  },
  {
    gender: 'male',
    name: 'Cyber Warrior',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_male/1721823784962.jpg',
    prompt: 'A selfie of a male as a futuristic Cyber Warrior, with high-tech armor and a glowing energy sword.'
  },
  {
    gender: 'male',
    name: 'Viking',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_male/1721823787503.jpg',
    prompt: 'A selfie of a male as a fierce Viking warrior, with braided hair, beard, and traditional armor.'
  },
  {
    gender: 'male',
    name: 'Legacy',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1730197112042.jpg',
    prompt: 'A selfie of a male with Day of the Dead face paint, celebrating a vibrant legacy with flowers and patterns.'
  },
  {
    gender: 'male',
    name: 'Ancestor',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1730197109686.jpg',
    prompt: 'A selfie of a male in the style of a revered Ancestor, with traditional Day of the Dead sugar skull makeup.'
  },
  {
    gender: 'male',
    name: 'Mohawk',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721886397418.jpg',
    prompt: 'A selfie of a male with a cool Mohawk hairstyle, punk rock aesthetic.'
  },
  {
    gender: 'male',
    name: 'Gray',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721886397288.jpg',
    prompt: 'A selfie of a male with distinguished gray hair, looking handsome and sophisticated.'
  },
  {
    gender: 'male',
    name: 'Sultan',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721887654277.jpg',
    prompt: 'A royal selfie of a male as a powerful Sultan, wearing ornate robes and a majestic turban.'
  },
  {
    gender: 'male',
    name: 'Ottoman',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721887654139.jpg',
    prompt: 'A royal selfie of a male in traditional Ottoman empire attire, rich fabrics and intricate details.'
  },
  {
    gender: 'male',
    name: 'Mughal',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721887653999.jpg',
    prompt: 'A royal selfie of a male as a Mughal emperor, adorned with jewels and fine silks.'
  },
  {
    gender: 'male',
    name: 'Mayan',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721887653860.jpg',
    prompt: 'A royal selfie of a male as a Mayan king, with traditional headdress and intricate carvings.'
  },
  {
    gender: 'male',
    name: 'Heian',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721887653726.jpg',
    prompt: 'A royal selfie of a male in the style of the Japanese Heian period, elegant and artistic.'
  },
  {
    gender: 'male',
    name: 'European',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721887653548.jpg',
    prompt: 'A selfie of a male as classic European royalty, wearing a crown and regal attire.'
  },
  {
    gender: 'male',
    name: 'Chinese',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721887653334.jpg',
    prompt: 'A selfie of a male as a historical Chinese emperor, in traditional silk robes.'
  },
  {
    gender: 'male',
    name: 'Byzantine',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721887653170.jpg',
    prompt: 'A selfie of a male in the opulent style of a Byzantine noble, with rich mosaics and gold.'
  },
  {
    gender: 'male',
    name: 'African',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721887652980.jpg',
    prompt: 'A selfie of a male as a proud African king, wearing vibrant traditional attire and beads.'
  },
  {
    gender: 'male',
    name: 'Woody',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721889422029.jpg',
    prompt: 'A selfie of a male transformed into the cartoon character Woody from Toy Story, 3D animated style.'
  },
  {
    gender: 'male',
    name: 'Tarzaan',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_male/thumb/1721889421881.jpg',
    prompt: 'A selfie of a male as the cartoon character Tarzan, in a lush jungle, animated style.'
  },
  {
    gender: 'male',
    name: 'Waist-coat',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_male/1721890156866.jpg',
    prompt: 'A selfie of a male celebrating Diwali, wearing a traditional Kurta with a stylish waist-coat.'
  },
  {
    gender: 'male',
    name: 'Contemporary',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_male/1721890157076.jpg',
    prompt: 'A selfie of a male in a contemporary outfit for Diwali, modern and festive.'
  },
  {
    gender: 'male',
    name: 'Adorable',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_male/1737443497129.jpg',
    prompt: 'An adorable selfie of a male for Valentine\'s Day, with a sweet smile and a background of hearts.'
  },
  {
    gender: 'male',
    name: 'Charming',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_male/1737443499416.jpg',
    prompt: 'A charming selfie of a male on Valentine\'s Day, holding a rose, looking romantic.'
  },
  {
    gender: 'male',
    name: 'Vibrant',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_male/1738581601035.jpg',
    prompt: 'A selfie of a male celebrating Holi, face covered in vibrant colored powders.'
  },
  {
    gender: 'male',
    name: 'Phoolrang',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_male/1738581602870.jpg',
    prompt: 'A selfie of a male celebrating Holi with Phoolrang, surrounded by flower petals and colors.'
  },
  {
    gender: 'male',
    name: 'Santa',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_male/1732277851564.jpg',
    prompt: 'A festive selfie of a male dressed as Santa Claus, with a white beard and red hat.'
  },
  {
    gender: 'male',
    name: 'Snow',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_male/1732277851805.jpg',
    prompt: 'A selfie of a male in a winter wonderland, with snow falling gently around him, Christmas theme.'
  },
  {
    gender: 'male',
    name: 'Vibrant',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/28ad386a-6665-46f5-8e87-9e6d9fd2a036.jpg',
    prompt: 'A selfie of a male at a vibrant New Year\'s party, with confetti and bright lights.'
  },
  {
    gender: 'male',
    name: 'Stylish',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/product_thumb/7cd237c1-9274-46e1-bddb-c1953d00f075.jpg',
    prompt: 'A stylish selfie of a male dressed up for a New Year\'s celebration, looking sharp in a suit.'
  },



  // --- Female Styles ---
  {
    gender: 'female',
    name: 'Woolen Coat',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892571754.jpg',
    prompt: 'A chic selfie of a female in an elegant Woolen Coat, winter fashion in the city.'
  },
  {
    gender: 'female',
    name: 'Tropical',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892571591.jpg',
    prompt: 'A selfie of a female in a vibrant Tropical dress, on a sunny beach with palm trees.'
  },
  {
    gender: 'female',
    name: 'Trench Coat',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892571422.jpg',
    prompt: 'A selfie of a female wearing a classic Trench Coat, sophisticated and timeless look, autumn setting.'
  },
  {
    gender: 'female',
    name: 'Sweater',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892571273.jpg',
    prompt: 'A cozy selfie of a female wearing a soft, warm sweater, holding a cup of coffee.'
  },
  {
    gender: 'female',
    name: 'Stylish',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892571131.jpg',
    prompt: 'A selfie of a very stylish female in a high-fashion outfit, looking ready for a magazine cover.'
  },
  {
    gender: 'female',
    name: 'Street Style',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570976.jpg',
    prompt: 'A selfie of a female with an edgy Street Style look, in a cool urban environment.'
  },
  {
    gender: 'female',
    name: 'Poncho',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570828.jpg',
    prompt: 'A selfie of a female wearing a fashionable, patterned Poncho, bohemian and chic.'
  },
  {
    gender: 'female',
    name: 'Nightdress',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570665.jpg',
    prompt: 'A selfie of a female in an elegant silk Nightdress, soft and dreamy bedroom setting.'
  },
  {
    gender: 'female',
    name: 'Jacket',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570497.jpg',
    prompt: 'A selfie of a female in a cool leather Jacket, exuding confidence and style.'
  },
  {
    gender: 'female',
    name: 'Cocktail',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570350.jpg',
    prompt: 'A selfie of a female in a stunning Cocktail dress, ready for an evening event.'
  },
  {
    gender: 'female',
    name: 'Classic Black',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570192.jpg',
    prompt: 'A selfie of a female in a timeless, classic black dress, sophisticated and elegant.'
  },
  {
    gender: 'female',
    name: 'Boho',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892570025.jpg',
    prompt: 'A selfie of a female with a Boho-chic style, flowy dress, and earthy accessories.'
  },
  {
    gender: 'female',
    name: 'Bodysuit',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892569859.jpg',
    prompt: 'A selfie of a female in a sleek and stylish Bodysuit, modern and fashionable.'
  },
  {
    gender: 'female',
    name: 'Blazer',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892569709.jpg',
    prompt: 'A selfie of a female looking sharp and professional in a well-fitted Blazer.'
  },
  {
    gender: 'female',
    name: 'Athleisure',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721892569494.jpg',
    prompt: 'A selfie of a female in trendy Athleisure wear, sporty, comfortable, and stylish.'
  },
  {
    gender: 'female',
    name: 'Aesthetic',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_female/1721893290344.jpg',
    prompt: 'A selfie of a female with a soft, dreamy aesthetic, pastel colors, and artistic flair.'
  },
  {
    gender: 'female',
    name: 'Goddess',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/hd/ai_selfie_female/1721893291279.jpg',
    prompt: 'A selfie of a female transformed into a divine Goddess, with ethereal light and a powerful aura.'
  },
  {
    gender: 'female',
    name: 'Romanticism',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721822384442.jpg',
    prompt: 'A selfie of a female in the style of a Romanticism painting, dramatic, emotional, and beautiful.'
  },
  {
    gender: 'female',
    name: 'Abstract',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721822382528.jpg',
    prompt: 'A selfie of a female rendered in a colorful abstract painting style, bold shapes and lines.'
  },

  {
    gender: 'female',
    name: 'Goddess',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721893611671.jpg',
    prompt: 'A fantasy selfie of a female as a celestial Goddess, surrounded by stars and cosmic energy.'
  },
  {
    gender: 'female',
    name: 'Viking',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721891733226.jpg',
    prompt: 'A selfie of a female as a strong Viking warrior, with intricate braids and leather armor.'
  },
  {
    gender: 'female',
    name: 'Tribal',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721891733082.jpg',
    prompt: 'A selfie of a female with beautiful tribal face paint and traditional accessories, proud and powerful.'
  },
  {
    gender: 'female',
    name: 'Soulful',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1730197129378.jpg',
    prompt: 'A soulful selfie of a female with artistic Day of the Dead makeup, celebrating life and memory.'
  },
  {
    gender: 'female',
    name: 'Sacred',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1730197131255.jpg',
    prompt: 'A selfie of a female with sacred Day of the Dead sugar skull art, adorned with marigolds.'
  },
  {
    gender: 'female',
    name: 'Black Stone',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721880887150.jpg',
    prompt: 'A selfie of a female reimagined as an elegant Black Stone sculpture, polished and dramatic.'
  },
  {
    gender: 'female',
    name: 'Stone',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721825362271.jpg',
    prompt: 'A selfie of a female as a graceful Greco-Roman stone sculpture, timeless beauty.'
  },
  {
    gender: 'female',
    name: 'Wavy',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721881770675.jpg',
    prompt: 'A selfie of a female with beautiful, long wavy hair, looking natural and effortless.'
  },
  {
    gender: 'female',
    name: 'Victoria Roll',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721881770509.jpg',
    prompt: 'A selfie of a female with an elegant Victoria Roll hairstyle, classic and sophisticated.'
  },
  {
    gender: 'female',
    name: 'Clothes',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721882293628.jpg',
    prompt: 'A selfie of a female in futuristic clothes with glowing neon accents, cyberpunk fashion.'
  },
  {
    gender: 'female',
    name: 'Space Explorer',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721882294348.jpg',
    prompt: 'A selfie of a female as a neon Space Explorer, with a futuristic suit and helmet.'
  },
  {
    gender: 'female',
    name: 'Spain',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721885286031.jpg',
    prompt: 'A selfie of a female as Spanish royalty, wearing a traditional, elegant gown.'
  },
  {
    gender: 'female',
    name: 'Queen',
    imageUrl: 'https://d2v5dzhdg4zhx3.cloudfront.net/ai_selfie_female/thumb/1721885285866.jpg',
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