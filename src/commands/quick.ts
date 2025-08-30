import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import { WinRMConfig } from '../types/config.js';
import { PowerShellRunner } from '../lib/powershell.js';
import { CertificateManager } from '../lib/certificate.js';

export async function quickCommand(options: any) {
  console.log(chalk.blue.bold('Starting Quick Setup'));
  console.log(chalk.gray('Configuring WinRM with secure defaults...\n'));

  const steps = [
    { text: 'Checking prerequisites', action: checkPrerequisites },
    { text: 'Creating self-signed certificate', action: createCertificate },
    { text: 'Configuring HTTPS listener', action: configureHTTPS },
    { text: 'Setting authentication methods', action: setAuthentication },
    { text: 'Configuring firewall rules', action: configureFirewall },
    { text: 'Testing configuration', action: testConfiguration },
  ];

  for (const step of steps) {
    const spinner = ora(step.text).start();
    try {
      await step.action();
      spinner.succeed(chalk.green(step.text));
    } catch (error) {
      spinner.fail(chalk.red(step.text));
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  }

  console.log(chalk.green.bold('\n[SUCCESS] WinRM configured successfully'));
  displayAnsibleConfig();
}

async function checkPrerequisites() {
  const ps = new PowerShellRunner();
  await ps.checkAdminPrivileges();
  await ps.checkWinRMService();
}

async function createCertificate() {
  const certManager = new CertificateManager();
  await certManager.createSelfSignedCert();
}

async function configureHTTPS() {
  const ps = new PowerShellRunner();
  await ps.configureHTTPSListener(5986);
}

async function setAuthentication() {
  const ps = new PowerShellRunner();
  await ps.setAuthMethods(['NTLM', 'Kerberos']);
}

async function configureFirewall() {
  const ps = new PowerShellRunner();
  await ps.configureFirewallRules(5986);
}

async function testConfiguration() {
  const ps = new PowerShellRunner();
  await ps.testWinRMConnection('localhost', 5986);
}

function displayAnsibleConfig() {
  console.log(chalk.cyan('\nReady for Ansible! Add to inventory:'));
  console.log(chalk.gray('━'.repeat(40)));
  console.log(`[windows]
server1 ansible_host=${getHostIP()}

[windows:vars]
ansible_user=Administrator
ansible_connection=winrm
ansible_winrm_transport=ntlm
ansible_winrm_server_cert_validation=ignore`);
  console.log(chalk.gray('━'.repeat(40)));
}

function getHostIP(): string {
  try {
    const output = execSync('hostname -I 2>/dev/null || ipconfig getifaddr en0 2>/dev/null || echo "YOUR_IP_HERE"', { encoding: 'utf-8' });
    return output.trim().split(' ')[0] || 'YOUR_IP_HERE';
  } catch {
    return 'YOUR_IP_HERE';
  }
}