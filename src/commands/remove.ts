import inquirer from 'inquirer';
import { colors, symbols, messages, alert, withSpinner } from '../lib/ui.js';
import { PowerShellRunner } from '../lib/powershell.js';

export async function removeCommand(options: any) {
  console.log();
  alert('Remove WinRM Configuration', 'warning');
  console.log(colors.muted('  This will disable WinRM and remove all configuration.\n'));
  
  if (!options.force) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: colors.warning(messages.prompts.confirmRemove),
        default: false,
        prefix: colors.warning(symbols.warning),
      },
    ]);

    if (!confirm) {
      console.log(colors.muted(`\n  ${symbols.info} Operation cancelled.\n`));
      return;
    }
  }

  try {
    const ps = new PowerShellRunner();
    
    await withSpinner('Removing WinRM configuration...', async () => {
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation:
      // await ps.removeWinRMConfiguration();
    });
    
    console.log(colors.success(`\n  ${symbols.check} ${messages.success.removed}\n`));
  } catch (error: any) {
    console.log(colors.error(`\n  ${symbols.cross} Failed to remove configuration: ${error.message}\n`));
    process.exit(1);
  }
}