import chalk from 'chalk';
import figures from 'figures';
import { PowerShellRunner } from '../lib/powershell.js';

export async function statusCommand(options: any) {
  const ps = new PowerShellRunner();
  
  console.log(chalk.blue.bold('\nWinRM Configuration Status'));
  console.log(chalk.gray('━'.repeat(40)));

  try {
    const status = await ps.getWinRMStatus();
    
    if (options.json) {
      console.log(JSON.stringify(status, null, 2));
      return;
    }

    displayServiceStatus(status.service);
    displayListeners(status.listeners);
    displayAuthentication(status.auth);
    displaySecurity(status.security);
    
  } catch (error) {
    console.error(chalk.red(`Error getting status: ${error.message}`));
    process.exit(1);
  }
}

function displayServiceStatus(service: any) {
  console.log(chalk.cyan('\nService Status'));
  console.log(`  ├─ WinRM Service:     ${service.running ? chalk.green(figures.circleFilled + ' Running') : chalk.red(figures.cross + ' Stopped')}`);
  console.log(`  ├─ Startup Type:      ${service.startupType}`);
  console.log(`  └─ PS Remoting:       ${service.psRemoting ? chalk.green(figures.tick + ' Enabled') : chalk.red(figures.cross + ' Disabled')}`);
}

function displayListeners(listeners: any) {
  console.log(chalk.cyan('\nListeners'));
  if (listeners.http) {
    console.log(`  ├─ HTTP (5985):       ${listeners.http.active ? chalk.green(figures.circleFilled + ' Active') : chalk.gray(figures.circle + ' Inactive')}`);
  }
  if (listeners.https) {
    console.log(`  └─ HTTPS (5986):      ${listeners.https.active ? chalk.green(figures.circleFilled + ' Active') : chalk.gray(figures.circle + ' Inactive')}`);
  }
}

function displayAuthentication(auth: any) {
  console.log(chalk.cyan('\nAuthentication'));
  console.log(`  ├─ Basic:             ${auth.basic ? chalk.yellow(figures.warning + ' Enabled (Insecure)') : chalk.gray(figures.circle + ' Disabled')}`);
  console.log(`  ├─ NTLM:              ${auth.ntlm ? chalk.green(figures.tick + ' Enabled') : chalk.gray(figures.circle + ' Disabled')}`);
  console.log(`  ├─ Kerberos:          ${auth.kerberos ? chalk.green(figures.tick + ' Enabled') : chalk.gray(figures.circle + ' Disabled')}`);
  console.log(`  └─ CredSSP:           ${auth.credssp ? chalk.yellow(figures.warning + ' Enabled (Security Risk)') : chalk.gray(figures.circle + ' Disabled')}`);
}

function displaySecurity(security: any) {
  console.log(chalk.cyan('\nSecurity'));
  if (security.certificate) {
    console.log(`  ├─ Certificate:       ${security.certificate.type}`);
    console.log(`  ├─ Thumbprint:        ${security.certificate.thumbprint?.substring(0, 12)}...`);
  }
  console.log(`  └─ Unencrypted:       ${security.allowUnencrypted ? chalk.red(figures.cross + ' Enabled (Dangerous)') : chalk.green(figures.tick + ' Disabled')}`);
  console.log('');
}