#!/usr/bin/env node
import { 
  runAllTests, 
  runWeeklyTest, 
  runSpecialWindowsTest, 
  runStatusTest 
} from './testOperatingHours.js';

const command = process.argv[2];

switch (command) {
  case 'all':
    console.log('Running all operating hours tests...');
    await runAllTests();
    break;
  
  case 'weekly':
    console.log('Running weekly hours test...');
    await runWeeklyTest();
    break;
  
  case 'special':
    console.log('Running special windows test...');
    await runSpecialWindowsTest();
    break;
  
  case 'status':
    console.log('Running status test...');
    await runStatusTest();
    break;
  
  default:
    console.log('Usage: node runHoursTests.js [all|weekly|special|status]');
    console.log('');
    console.log('Commands:');
    console.log('  all     - Run all operating hours tests');
    console.log('  weekly  - Test weekly hours configuration only');
    console.log('  special - Test special windows (monthly/seasonal) only');
    console.log('  status  - Test status check only (no auth required)');
    console.log('');
    console.log('Examples:');
    console.log('  node runHoursTests.js all');
    console.log('  node runHoursTests.js weekly');
    console.log('  node runHoursTests.js status');
    break;
}
