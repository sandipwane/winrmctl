import chalk from 'chalk';
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
  console.log(`  ├─ WinRM Service:     ${service.running ? chalk.green('✅ Running') : chalk.red('❌ Stopped')}`);
  console.log(`  ├─ Startup Type:      ${service.startupType}`);
  console.log(`  └─ PS Remoting:       ${service.psRemoting ? chalk.green('✅ Enabled') : chalk.red('❌ Disabled')}`);
}

function displayListeners(listeners: any) {
  console.log(chalk.cyan('\nListeners'));
  if (listeners.http) {
    console.log(`  ├─ HTTP (5985):       ${listeners.http.active ? chalk.green('✅ Active') : chalk.red('❌ Inactive')}`);
  }
  if (listeners.https) {
    console.log(`  └─ HTTPS (5986):      ${listeners.https.active ? chalk.green('✅ Active') : chalk.red('❌ Inactive')}`);
  }
}

function displayAuthentication(auth: any) {
  console.log(chalk.cyan('\nAuthentication'));
  console.log(`  ├─ Basic:             ${auth.basic ? chalk.yellow('⚠️  Enabled') : chalk.green('❌ Disabled')}`);
  console.log(`  ├─ NTLM:              ${auth.ntlm ? chalk.green('✅ Enabled') : chalk.red('❌ Disabled')}`);
  console.log(`  ├─ Kerberos:          ${auth.kerberos ? chalk.green('✅ Enabled') : chalk.red('❌ Disabled')}`);
  console.log(`  └─ CredSSP:           ${auth.credssp ? chalk.yellow('⚠️  Enabled') : chalk.green('❌ Disabled')}`);
}

function displaySecurity(security: any) {
  console.log(chalk.cyan('\nSecurity'));
  if (security.certificate) {
    console.log(`  ├─ Certificate:       ${security.certificate.type}`);
    console.log(`  ├─ Thumbprint:        ${security.certificate.thumbprint?.substring(0, 12)}...`);
  }
  console.log(`  └─ Unencrypted:       ${security.allowUnencrypted ? chalk.red('⚠️  Enabled') : chalk.green('❌ Disabled')}`);
  console.log(chalk.gray('\n━'.repeat(40)));
}