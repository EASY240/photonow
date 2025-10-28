import { tools } from '../data/tools';

export interface ImageMapping {
  toolId: string;
  toolName: string;
  imagePath: string;
  imageExists: boolean;
  altText: string;
}

export interface MappingResult {
  successful: ImageMapping[];
  failed: {
    toolId: string;
    toolName: string;
    reason: string;
  }[];
  summary: {
    totalTools: number;
    successfulMappings: number;
    failedMappings: number;
  };
}

/**
 * Normalizes tool names to match potential image filenames
 * Handles various naming conventions and formats
 */
export function normalizeToolName(toolName: string): string[] {
  const normalized = toolName.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Generate multiple possible variations
  const variations = [
    normalized,
    normalized.replace(/-/g, ''), // Remove all hyphens
    normalized.replace(/-/g, '_'), // Replace hyphens with underscores
    toolName.toLowerCase().replace(/\s+/g, ''), // Remove all spaces, keep original case pattern
    toolName.toLowerCase().replace(/\s+/g, '_'), // Replace spaces with underscores
  ];

  // Remove duplicates
  return [...new Set(variations)];
}

/**
 * Special mapping for tools where the filename doesn't match the tool name exactly
 */
const SPECIAL_FILENAME_MAPPINGS: Record<string, string> = {
  'AI Caricature': 'AI Caricature Generator Tool.jpg',
  'AI Expand': 'Ai Expand tool.jpg',
  'AI Replace': 'AI Replace tool.jpg',
  'Remove Background': 'Remove Background tool.jpg'
};

/**
 * Generates possible image filenames based on tool ID and name
 */
export function generateImageFilenames(toolId: string, toolName: string): string[] {
  // Check for special mappings first
  if (SPECIAL_FILENAME_MAPPINGS[toolName]) {
    return [SPECIAL_FILENAME_MAPPINGS[toolName]];
  }

  const filenames: string[] = [];
  
  // Use the tool name as-is for most cases
  const cleanName = toolName.replace(/^AI\s+/, ''); // Remove "AI " prefix if present
  
  // Most common pattern: "AI [Tool Name] Tool.jpg" (capital T)
  filenames.push(`AI ${cleanName} Tool.jpg`);
  
  // Alternative pattern: "AI [Tool Name] tool.jpg" (lowercase t)
  filenames.push(`AI ${cleanName} tool.jpg`);
  
  // Pattern with lowercase "Ai": "Ai [Tool Name] tool.jpg"
  filenames.push(`Ai ${cleanName} tool.jpg`);
  
  // Special case for Remove Background: "[Tool Name] tool.jpg" (no AI prefix)
  filenames.push(`${cleanName} tool.jpg`);
  
  // Fallback patterns
  filenames.push(`AI ${cleanName}.jpg`);
  filenames.push(`${cleanName}.jpg`);
  
  // Also try with the full tool name
  filenames.push(`${toolName} Tool.jpg`);
  filenames.push(`${toolName} tool.jpg`);
  filenames.push(`${toolName}.jpg`);

  return [...new Set(filenames)]; // Remove duplicates
}

/**
 * Checks if an image file exists in the tools images directory
 */
export async function checkImageExists(filename: string): Promise<boolean> {
  // In Node.js environment (for testing)
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');
    
    try {
      const imagePath = path.join(process.cwd(), 'public', 'images', 'tools images', filename);
      return fs.existsSync(imagePath);
    } catch {
      return false;
    }
  }
  
  // In browser environment
  try {
    const response = await fetch(`/images/tools images/${filename}`, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Finds the correct image file for a tool
 */
export async function findToolImage(toolId: string, toolName: string): Promise<string | null> {
  const possibleFilenames = generateImageFilenames(toolId, toolName);
  
  for (const filename of possibleFilenames) {
    if (await checkImageExists(filename)) {
      return filename;
    }
  }
  
  return null;
}

/**
 * Generates appropriate alt text for tool images
 */
export function generateAltText(toolName: string): string {
  return `${toolName} - AI-powered photo editing tool interface and features`;
}

/**
 * Creates a comprehensive mapping of all tools to their images
 */
export async function createToolImageMapping(): Promise<MappingResult> {
  const successful: ImageMapping[] = [];
  const failed: { toolId: string; toolName: string; reason: string; }[] = [];

  console.log('🔍 Starting tool image mapping process...');
  console.log(`📊 Total tools to process: ${tools.length}`);

  for (const tool of tools) {
    try {
      console.log(`🔄 Processing tool: ${tool.name} (ID: ${tool.id})`);
      
      const imageFilename = await findToolImage(tool.id, tool.name);
      
      if (imageFilename) {
        const mapping: ImageMapping = {
          toolId: tool.id,
          toolName: tool.name,
          imagePath: `/images/tools images/${imageFilename}`,
          imageExists: true,
          altText: generateAltText(tool.name)
        };
        
        successful.push(mapping);
        console.log(`✅ Successfully mapped: ${tool.name} → ${imageFilename}`);
      } else {
        failed.push({
          toolId: tool.id,
          toolName: tool.name,
          reason: 'No matching image file found'
        });
        console.log(`❌ Failed to find image for: ${tool.name}`);
      }
    } catch (error) {
      failed.push({
        toolId: tool.id,
        toolName: tool.name,
        reason: `Error during processing: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      console.log(`💥 Error processing ${tool.name}: ${error}`);
    }
  }

  const result: MappingResult = {
    successful,
    failed,
    summary: {
      totalTools: tools.length,
      successfulMappings: successful.length,
      failedMappings: failed.length
    }
  };

  console.log('\n📈 Mapping Summary:');
  console.log(`✅ Successful mappings: ${result.summary.successfulMappings}`);
  console.log(`❌ Failed mappings: ${result.summary.failedMappings}`);
  console.log(`📊 Success rate: ${((result.summary.successfulMappings / result.summary.totalTools) * 100).toFixed(1)}%`);

  if (failed.length > 0) {
    console.log('\n❌ Failed mappings details:');
    failed.forEach(failure => {
      console.log(`  • ${failure.toolName} (${failure.toolId}): ${failure.reason}`);
    });
  }

  return result;
}

/**
 * Validates image file format
 */
export function isValidImageFormat(filename: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validExtensions.includes(extension);
}

/**
 * Generates responsive image HTML with proper styling
 */
export function generateImageHTML(mapping: ImageMapping): string {
  return `
    <div className="tool-feature-image mb-8 mt-6">
      <img 
        src="${mapping.imagePath}"
        alt="${mapping.altText}"
        className="w-full max-w-2xl mx-auto rounded-lg shadow-lg object-cover"
        style={{
          maxHeight: '400px',
          objectFit: 'cover'
        }}
        loading="lazy"
        onError={(e) => {
          console.error('Failed to load tool image:', '${mapping.imagePath}');
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  `;
}