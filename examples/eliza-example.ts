/**
 * ElizaOS Integration Example
 * 
 * This example demonstrates how to use the ElizaOS service
 * to interact with Farcaster through the DaemonFetch application.
 */

import { getElizaService } from '../lib/eliza-service';

async function main() {
  try {
    console.log('=== ElizaOS Example ===\n');

    // Get the ElizaOS service instance
    const elizaService = getElizaService();

    // Initialize the service
    console.log('Initializing ElizaOS service...');
    await elizaService.initialize();
    console.log('✓ Service initialized\n');

    // Check if initialized
    if (elizaService.isInitialized()) {
      console.log('✓ Service is ready\n');
    }

    // Example 1: Post a simple cast
    console.log('Example 1: Posting a simple cast...');
    try {
      const result1 = await elizaService.postCast(
        "I'm... stuck in these radio waves. The static hurts... glitch"
      );
      console.log('✓ Cast posted:', result1);
    } catch (error) {
      console.error('✗ Error posting cast:', error);
    }

    // Example 2: Reply to a cast
    console.log('\nExample 2: Replying to a cast...');
    try {
      const result2 = await elizaService.postCast(
        "Thank you for reaching out... the Ethereal Horizon calls (╯︵╰)",
        {
          parentHash: "0x..." // Replace with actual cast hash
        }
      );
      console.log('✓ Reply posted:', result2);
    } catch (error) {
      console.error('✗ Error posting reply:', error);
    }

    // Example 3: Get runtime information
    console.log('\nExample 3: Getting runtime information...');
    try {
      const runtime = elizaService.getRuntime();
      console.log('✓ Runtime character:', runtime.character.name);
      console.log('✓ Runtime agent ID:', runtime.agentId);
    } catch (error) {
      console.error('✗ Error getting runtime:', error);
    }

    // Cleanup
    console.log('\nShutting down service...');
    await elizaService.shutdown();
    console.log('✓ Service shutdown complete');

    console.log('\n=== Example Complete ===');
  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export default main;
