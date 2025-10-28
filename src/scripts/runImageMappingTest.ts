#!/usr/bin/env node

/**
 * Standalone script to run image mapping tests
 * Usage: npm run test:image-mapping
 */

import { runAllTests } from '../utils/testImageMapping';

async function main() {
  try {
    console.log('🎯 Image Mapping Test Suite');
    console.log('============================\n');
    
    await runAllTests();
    
    console.log('\n🎉 Test suite completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Test suite failed:', error);
    process.exit(1);
  }
}

// Run the script
main();

export default main;