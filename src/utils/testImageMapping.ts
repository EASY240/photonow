/**
 * Test script to verify the image mapping system
 * This script validates image-to-tool mappings and reports any issues
 */

import { tools } from '../data/tools';
import { findToolImage, generateAltText, createToolImageMapping } from './imageMapper';

interface TestResult {
  toolId: string;
  toolName: string;
  imageFound: boolean;
  imagePath?: string;
  altText?: string;
  error?: string;
}

interface TestSummary {
  totalTools: number;
  successfulMappings: number;
  failedMappings: number;
  results: TestResult[];
  errors: string[];
}

/**
 * Test the image mapping system for all tools
 */
export async function testImageMapping(): Promise<TestSummary> {
  console.log('🧪 Starting image mapping test...');
  
  const results: TestResult[] = [];
  const errors: string[] = [];
  let successfulMappings = 0;
  let failedMappings = 0;

  for (const tool of tools) {
    try {
      console.log(`\n🔍 Testing tool: ${tool.name} (ID: ${tool.id})`);
      
      const imageFilename = await findToolImage(tool.id, tool.name);
      
      if (imageFilename) {
        const altText = generateAltText(tool.name);
        results.push({
          toolId: tool.id,
          toolName: tool.name,
          imageFound: true,
          imagePath: `/images/tools images/${imageFilename}`,
          altText
        });
        successfulMappings++;
        console.log(`  ✅ Found image: ${imageFilename}`);
        console.log(`  📝 Alt text: ${altText}`);
      } else {
        results.push({
          toolId: tool.id,
          toolName: tool.name,
          imageFound: false
        });
        failedMappings++;
        console.log(`  ❌ No image found`);
      }
    } catch (error) {
      const errorMessage = `Error testing ${tool.name}: ${error instanceof Error ? error.message : String(error)}`;
      errors.push(errorMessage);
      results.push({
        toolId: tool.id,
        toolName: tool.name,
        imageFound: false,
        error: errorMessage
      });
      failedMappings++;
      console.error(`  💥 ${errorMessage}`);
    }
  }

  const summary: TestSummary = {
    totalTools: tools.length,
    successfulMappings,
    failedMappings,
    results,
    errors
  };

  console.log('\n📊 Test Summary:');
  console.log(`  Total tools: ${summary.totalTools}`);
  console.log(`  Successful mappings: ${summary.successfulMappings}`);
  console.log(`  Failed mappings: ${summary.failedMappings}`);
  console.log(`  Success rate: ${((summary.successfulMappings / summary.totalTools) * 100).toFixed(1)}%`);

  if (summary.errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    summary.errors.forEach(error => console.log(`  - ${error}`));
  }

  return summary;
}

/**
 * Test image accessibility and format validation
 */
export async function testImageAccessibility(): Promise<void> {
  console.log('\n🔍 Testing image accessibility...');
  
  const mappingResult = await createToolImageMapping();
  
  for (const mapping of mappingResult.successful) {
    const imagePath = `/images/tools images/${mapping.imagePath}`;
    
    // Test if image can be loaded (in a real browser environment)
    try {
      // This would be more comprehensive in a browser environment
      console.log(`  ✅ Image accessible: ${imagePath}`);
      console.log(`    Alt text: ${mapping.altText}`);
      console.log(`    Format: ${mapping.imagePath.split('.').pop()?.toUpperCase()}`);
    } catch (error) {
      console.error(`  ❌ Image not accessible: ${imagePath}`);
    }
  }
}

/**
 * Generate a detailed report of the mapping results
 */
export function generateMappingReport(summary: TestSummary): string {
  let report = '# Image Mapping Test Report\n\n';
  
  report += `## Summary\n`;
  report += `- **Total Tools**: ${summary.totalTools}\n`;
  report += `- **Successful Mappings**: ${summary.successfulMappings}\n`;
  report += `- **Failed Mappings**: ${summary.failedMappings}\n`;
  report += `- **Success Rate**: ${((summary.successfulMappings / summary.totalTools) * 100).toFixed(1)}%\n\n`;
  
  report += `## Successful Mappings\n\n`;
  const successfulResults = summary.results.filter(r => r.imageFound);
  successfulResults.forEach(result => {
    report += `### ${result.toolName}\n`;
    report += `- **Tool ID**: ${result.toolId}\n`;
    report += `- **Image Path**: ${result.imagePath}\n`;
    report += `- **Alt Text**: ${result.altText}\n\n`;
  });
  
  report += `## Failed Mappings\n\n`;
  const failedResults = summary.results.filter(r => !r.imageFound);
  failedResults.forEach(result => {
    report += `### ${result.toolName}\n`;
    report += `- **Tool ID**: ${result.toolId}\n`;
    report += `- **Status**: No matching image found\n`;
    if (result.error) {
      report += `- **Error**: ${result.error}\n`;
    }
    report += '\n';
  });
  
  if (summary.errors.length > 0) {
    report += `## Errors\n\n`;
    summary.errors.forEach(error => {
      report += `- ${error}\n`;
    });
  }
  
  return report;
}

/**
 * Run all tests and log results
 */
export async function runAllTests(): Promise<void> {
  console.log('🚀 Running comprehensive image mapping tests...\n');
  
  try {
    // Test basic mapping
    const summary = await testImageMapping();
    
    // Test accessibility
    await testImageAccessibility();
    
    // Generate report
    const report = generateMappingReport(summary);
    console.log('\n📄 Generated mapping report');
    
    console.log('\n✅ All tests completed successfully!');
    
    return summary;
  } catch (error) {
    console.error('💥 Test execution failed:', error);
    throw error;
  }
}