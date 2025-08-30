import { PowerShellRunner } from '../lib/powershell.js';
import { ProfileManager } from '../lib/profiles.js';
import { withSpinner, colors, symbols, messages, configSummary, alert } from '../lib/ui.js';

export async function configureCommand(options: any) {
  const ps = new PowerShellRunner();
  const profileManager = new ProfileManager();

  console.log();
  console.log(colors.muted('  Applying WinRM Configuration\n'));

  let config = options;

  if (options.profile) {
    const profile = await profileManager.loadProfile(options.profile);
    config = { ...profile, ...options };
  }

  try {
    if (options.check) {
      alert(messages.info.dryRun, 'info');
      configSummary(config);
      console.log(colors.success(`  ${symbols.check} Dry run complete\n`));
      return;
    }

    await ps.checkAdminPrivileges();

    if (config.cert === 'auto') {
      await withSpinner(messages.info.creatingCert, async () => {
        await ps.createSelfSignedCertificate();
      });
    }

    await withSpinner(messages.info.configuringHTTPS, async () => {
      await ps.configureHTTPSListener(config.port || 5986);
    });

    if (config.auth) {
      await withSpinner(messages.info.settingAuth, async () => {
        const authMethods = config.auth.split(',').map((s: string) => s.trim());
        await ps.setAuthMethods(authMethods);
      });
    }

    if (!config.skipFirewall) {
      await withSpinner(messages.info.updatingFirewall, async () => {
        await ps.configureFirewallRules(config.port || 5986);
      });
    }

    if (config.allowUnencrypted && !config.force) {
      alert('Allow unencrypted requires --force flag for safety', 'error');
      return;
    }

    console.log(colors.success(`\n  ${symbols.check} ${messages.success.configured}\n`));
  } catch (error: any) {
    console.log(colors.error(`\n  ${symbols.cross} Configuration failed: ${error.message}\n`));
    process.exit(1);
  }
}