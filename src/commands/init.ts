import inquirer from 'inquirer';
import chalk from 'chalk';
import { quickCommand } from './quick.js';
import { configureCommand } from './configure.js';
import { testCommand } from './test.js';
import { statusCommand } from './status.js';
import { removeCommand } from './remove.js';

export async function initCommand(options: any) {
  console.clear();
  displayHeader();

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        {
          name: `${chalk.green('🚀')} Quick Setup ${chalk.gray('(Recommended)')}\n     ${chalk.gray('→ Secure defaults, one click')}`,
          value: 'quick',
        },
        {
          name: `${chalk.blue('⚙️')}  Custom Setup\n     ${chalk.gray('→ Full control over config')}`,
          value: 'custom',
        },
        {
          name: `${chalk.yellow('🔍')} Test Connection\n     ${chalk.gray('→ Verify existing setup')}`,
          value: 'test',
        },
        {
          name: `${chalk.cyan('📊')} Show Status\n     ${chalk.gray('→ Current configuration')}`,
          value: 'status',
        },
        {
          name: `${chalk.red('🗑️')}  Remove Configuration\n     ${chalk.gray('→ Clean up WinRM settings')}`,
          value: 'remove',
        },
        new inquirer.Separator(),
        {
          name: chalk.gray('Exit'),
          value: 'exit',
        },
      ],
    },
  ]);

  switch (action) {
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
      console.log(chalk.gray('\nGoodbye!'));
      process.exit(0);
  }
}

function displayHeader() {
  const header = `
╔══════════════════════════════════════╗
║         ${chalk.bold.cyan('winrmctl Setup Wizard')}        ║
╚══════════════════════════════════════╝
`;
  console.log(chalk.blue(header));
}

async function customSetupWizard(options: any) {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'profile',
      message: 'Select configuration profile:',
      choices: [
        {
          name: `${chalk.green('Production')} ${chalk.gray('(Recommended)')}\n  ${chalk.gray('• Kerberos/NTLM auth\n  • Required certificates\n  • Strict firewall')}`,
          value: 'production',
        },
        {
          name: `${chalk.yellow('Development')}\n  ${chalk.gray('• Basic/NTLM auth\n  • Self-signed certs OK\n  • Relaxed firewall')}`,
          value: 'development',
        },
        {
          name: `${chalk.blue('Testing')}\n  ${chalk.gray('• Basic auth enabled\n  • Self-signed certs\n  • Open firewall')}`,
          value: 'testing',
        },
        {
          name: `${chalk.magenta('Custom')}\n  ${chalk.gray('• Configure everything manually')}`,
          value: 'custom',
        },
      ],
    },
  ]);

  if (answers.profile === 'custom') {
    const customConfig = await inquirer.prompt([
      {
        type: 'number',
        name: 'port',
        message: 'HTTPS port:',
        default: 5986,
      },
      {
        type: 'checkbox',
        name: 'auth',
        message: 'Authentication methods:',
        choices: ['Basic', 'NTLM', 'Kerberos', 'CredSSP'],
        default: ['NTLM', 'Kerberos'],
      },
      {
        type: 'list',
        name: 'cert',
        message: 'Certificate handling:',
        choices: ['Auto-generate self-signed', 'Use existing', 'Import from file'],
      },
      {
        type: 'confirm',
        name: 'firewall',
        message: 'Configure firewall rules?',
        default: true,
      },
    ]);

    await configureCommand({ ...options, ...customConfig });
  } else {
    await configureCommand({ ...options, profile: answers.profile });
  }
}

async function testConnectionWizard(options: any) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'host',
      message: 'Target host:',
      default: 'localhost',
    },
    {
      type: 'input',
      name: 'user',
      message: 'Username:',
      default: 'Administrator',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password:',
    },
    {
      type: 'confirm',
      name: 'skipCertValidation',
      message: 'Skip certificate validation?',
      default: true,
    },
  ]);

  await testCommand({ ...options, ...answers });
}