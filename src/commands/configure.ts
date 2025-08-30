import chalk from 'chalk';
import ora from 'ora';
import { PowerShellRunner } from '../lib/powershell.js';
import { ProfileManager } from '../lib/profiles.js';

export async function configureCommand(options: any) {
  const ps = new PowerShellRunner();
  const profileManager = new ProfileManager();

  console.log(chalk.blue.bold('\nApplying WinRM Configuration'));

  let config = options;

  if (options.profile) {
    const profile = await profileManager.loadProfile(options.profile);
    config = { ...profile, ...options };
  }

  const spinner = ora('Applying configuration...').start();

  try {
    if (options.check) {
      spinner.info('Dry run mode - no changes will be made');
      console.log(chalk.cyan('\nConfiguration to apply:'));
      console.log(JSON.stringify(config, null, 2));
      spinner.succeed('Dry run complete');
      return;
    }

    await ps.checkAdminPrivileges();

    if (config.cert === 'auto') {
      spinner.text = 'Creating self-signed certificate...';
      await ps.createSelfSignedCertificate();
    }

    spinner.text = 'Configuring WinRM listener...';
    await ps.configureHTTPSListener(config.port || 5986);

    if (config.auth) {
      spinner.text = 'Setting authentication methods...';
      const authMethods = config.auth.split(',').map(s => s.trim());
      await ps.setAuthMethods(authMethods);
    }

    if (!config.skipFirewall) {
      spinner.text = 'Configuring firewall rules...';
      await ps.configureFirewallRules(config.port || 5986);
    }

    if (config.allowUnencrypted && !config.force) {
      spinner.fail('Allow unencrypted requires --force flag for safety');
      return;
    }

    spinner.succeed(chalk.green('Configuration applied successfully'));
  } catch (error) {
    spinner.fail(chalk.red(`Configuration failed: ${error.message}`));
    process.exit(1);
  }
}