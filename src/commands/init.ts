import inquirer from 'inquirer';
import chalk from 'chalk';
import { header, selectPrompt, colors, symbols } from '../lib/ui.js';
import { quickCommand } from './quick.js';
import { configureCommand } from './configure.js';
import { testCommand } from './test.js';
import { statusCommand } from './status.js';
import { removeCommand } from './remove.js';

export async function initCommand(options: any) {
  header('winrmctl', 'Windows Remote Management Configuration');

  const choices = [
    {
      name: 'Quick Setup',
      value: 'quick',
      description: 'Auto-configure with best practices'
    },
    {
      name: 'Custom Setup',
      value: 'custom',
      description: 'Choose settings step-by-step'
    },
    {
      name: 'Test Connection',
      value: 'test',
      description: 'Check if WinRM is working'
    },
    {
      name: 'Show Status',
      value: 'status',
      description: 'View current WinRM settings'
    },
    {
      name: 'Remove Config',
      value: 'remove',
      description: 'Disable and reset WinRM'
    },
    {
      name: colors.dim('Exit'),
      value: 'exit',
      description: ''
    }
  ];

  const { selection } = await selectPrompt('Select an option:', choices);

  switch (selection) {
    case 'quick':
      await quickCommand(options);
      break;
    case 'custom':
      await customSetupWizard(options);
      break;
    case 'test':
      await testConnectionWizard(options);
      break;
    case 'status':
      await statusCommand(options);
      break;
    case 'remove':
      await removeCommand(options);
      break;
    case 'exit':
      console.log(colors.muted('\n  Goodbye!\n'));
      process.exit(0);
  }
}

async function customSetupWizard(options: any) {
  console.log();
  console.log(colors.muted('  Configuration Profile\n'));
  
  const profileChoices = [
    {
      name: 'Production',
      value: 'production',
      description: 'Enterprise-ready • Domain auth • Maximum security'
    },
    {
      name: 'Development',
      value: 'development',
      description: 'Local testing • Mixed auth • Flexible security'
    },
    {
      name: 'Testing',
      value: 'testing',
      description: 'CI/CD ready • Simple auth • Minimal restrictions'
    },
    {
      name: 'Custom',
      value: 'custom',
      description: 'Configure everything manually'
    }
  ];

  const { selection: profile } = await selectPrompt('Choose a profile:', profileChoices);

  if (profile === 'custom') {
    console.log();
    console.log(colors.muted('  Custom Configuration\n'));
    
    const customConfig = await inquirer.prompt([
      {
        type: 'number',
        name: 'port',
        message: colors.muted('  HTTPS port:'),
        default: 5986,
        prefix: colors.muted(symbols.pointer),
      },
      {
        type: 'checkbox',
        name: 'auth',
        message: colors.muted('  Authentication methods:'),
        choices: ['Basic', 'NTLM', 'Kerberos', 'CredSSP'],
        default: ['NTLM', 'Kerberos'],
        prefix: colors.muted(symbols.pointer),
      },
      {
        type: 'list',
        name: 'cert',
        message: colors.muted('  Certificate handling:'),
        choices: ['Auto-generate self-signed', 'Use existing', 'Import from file'],
        prefix: colors.muted(symbols.pointer),
        pageSize: 15,
      },
      {
        type: 'confirm',
        name: 'firewall',
        message: colors.muted('  Configure firewall rules?'),
        default: true,
        prefix: colors.muted(symbols.pointer),
      },
    ]);

    await configureCommand({ ...options, ...customConfig });
  } else {
    await configureCommand({ ...options, profile });
  }
}

async function testConnectionWizard(options: any) {
  console.log();
  console.log(colors.muted('  Connection Details\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'host',
      message: colors.muted('  Target host:'),
      default: 'localhost',
      prefix: colors.muted(symbols.pointer),
    },
    {
      type: 'input',
      name: 'user',
      message: colors.muted('  Username:'),
      default: 'Administrator',
      prefix: colors.muted(symbols.pointer),
    },
    {
      type: 'password',
      name: 'password',
      message: colors.muted('  Password:'),
      prefix: colors.muted(symbols.pointer),
    },
    {
      type: 'confirm',
      name: 'skipCertValidation',
      message: colors.muted('  Skip certificate validation?'),
      default: true,
      prefix: colors.muted(symbols.pointer),
    },
  ]);

  await testCommand({ ...options, ...answers });
}