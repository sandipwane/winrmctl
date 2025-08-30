import { PowerShellRunner } from '../lib/powershell.js';
import { withSpinner, colors, symbols, messages, header, statusLine } from '../lib/ui.js';

export async function testCommand(options: any) {
  const ps = new PowerShellRunner();
  
  header('WinRM Connection Test');

  const host = options.host || 'localhost';
  const user = options.user || process.env.USERNAME || 'Administrator';
  const port = options.port || 5986;

  console.log(colors.muted('  Connection Details'));
  console.log(statusLine('Host', host));
  console.log(statusLine('Port', port.toString()));
  console.log(statusLine('User', user));
  console.log(statusLine('Cert Validation', options.certValidation === 'skip' ? 'Skipped' : 'Strict',
    options.certValidation === 'skip' ? 'warning' : 'success'));
  console.log();

  try {
    const result = await withSpinner('Testing connection...', async () => {
      return await ps.testWinRMConnection(host, port, {
        user,
        password: options.password,
        skipCertValidation: options.certValidation === 'skip' || options.skipCertValidation,
      });
    });

    if (result.success) {
      console.log(colors.success(`\n  ${symbols.check} ${messages.success.tested}`));
      
      if (result.details) {
        console.log();
        console.log(colors.muted('  Connection Metrics'));
        console.log(statusLine('Protocol', result.details.protocol));
        console.log(statusLine('Auth Method', result.details.authMethod));
        console.log(statusLine('Response Time', `${result.details.responseTime}ms`,
          result.details.responseTime < 100 ? 'success' : result.details.responseTime < 500 ? 'warning' : 'error'));
      }
    } else {
      console.log(colors.error(`\n  ${symbols.cross} ${messages.errors.connectionFailed}`));
      
      if (result.error) {
        console.log(colors.error(`\n  Error: ${result.error}`));
        
        if (result.troubleshooting) {
          console.log();
          console.log(colors.warning(`  ${symbols.info} Troubleshooting Tips:`));
          result.troubleshooting.forEach((tip: string) => {
            console.log(colors.muted(`    ${symbols.bullet} ${tip}`));
          });
        }
      }
    }
  } catch (error: any) {
    console.log(colors.error(`\n  ${symbols.cross} Test failed: ${error.message}`));
    process.exit(1);
  }
}