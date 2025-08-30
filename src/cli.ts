#!/usr/bin/env bun
import { Command } from 'commander';
import chalk from 'chalk';
import { quickCommand } from './commands/quick.js';
import { initCommand } from './commands/init.js';
import { configureCommand } from './commands/configure.js';
import { testCommand } from './commands/test.js';
import { statusCommand } from './commands/status.js';
import { removeCommand } from './commands/remove.js';
import { profilesCommand } from './commands/profiles.js';

const program = new Command();

program
  .name('winrmctl')
  .description('CLI tool to simplify WinRM configuration for Ansible and remote management')
  .version('0.1.0')
  .option('--json', 'Output as JSON')
  .option('-v, --verbose', 'Verbose output')
  .option('--check', 'Dry run mode')
  .option('--profile <name>', 'Use configuration profile');

program
  .command('quick')
  .description('One-command setup with secure defaults')
  .action(quickCommand);

program
  .command('init')
  .description('Interactive setup wizard')
  .action(initCommand);

program
  .command('configure')
  .description('Apply configuration (non-interactive)')
  .option('--port <port>', 'HTTPS port', '5986')
  .option('--auth <methods>', 'Authentication methods (comma-separated)')
  .option('--cert <type>', 'Certificate handling (auto|path)')
  .option('--allow-unencrypted', 'Allow unencrypted (NOT recommended)')
  .option('--skip-firewall', 'Skip firewall configuration')
  .option('--force', 'Override safety checks')
  .action(configureCommand);

program
  .command('test')
  .description('Test WinRM connectivity')
  .option('--host <host>', 'Target host')
  .option('--user <username>', 'Username')
  .option('--password <password>', 'Password')
  .option('--cert-validation <mode>', 'Certificate validation (skip|strict)')
  .action(testCommand);

program
  .command('status')
  .description('Show current config & health')
  .action(statusCommand);

program
  .command('remove')
  .description('Remove WinRM configuration')
  .option('--force', 'Skip confirmation')
  .action(removeCommand);

program
  .command('profiles')
  .description('Manage configuration profiles')
  .option('--list', 'List available profiles')
  .option('--show <name>', 'Show profile details')
  .option('--create <name>', 'Create new profile')
  .option('--delete <name>', 'Delete profile')
  .action(profilesCommand);

program.parse();