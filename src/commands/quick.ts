import chalk from 'chalk';
import { execSync } from 'child_process';
import { WinRMConfig } from '../types/config.js';
import { PowerShellRunner } from '../lib/powershell.js';
import { CertificateManager } from '../lib/certificate.js';
import { StepProgress, colors, symbols, messages } from '../lib/ui.js';

export async function quickCommand(options: any) {
  console.log();
  console.log(colors.muted('  Quick Setup'));
  console.log(colors.muted('  Configuring WinRM with secure defaults...\n'));

  const setupSteps = [
    'Verifying system requirements',      
    'Generating security certificate',     
    'Setting up secure connection',        
    'Configuring authentication',          
    'Updating firewall settings',          
    'Verifying setup works',              
  ];

  const actions = [
    checkPrerequisites,
    createCertificate,
    configureHTTPS,
    setAuthentication,
    configureFirewall,
    testConfiguration,
  ];

  const progress = new StepProgress(setupSteps);
  progress.start();

  for (let i = 0; i < actions.length; i++) {
    try {
      await actions[i]();
      if (i < actions.length - 1) {
        progress.next();
      }
    } catch (error: any) {
      progress.fail(colors.error(`${symbols.cross} ${error.message || 'Setup failed'}`))
      process.exit(1);
    }
  }

  progress.finish(colors.success(`${symbols.check} ${messages.success.configured}`));
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
  console.log();
  console.log(colors.muted(`  ${messages.prompts.ansibleConfig}`));
  console.log(colors.dim('  ' + symbols.line.repeat(40)));
  console.log(colors.muted(`  [windows]
  server1 ansible_host=${getHostIP()}
  
  [windows:vars]
  ansible_user=Administrator
  ansible_connection=winrm
  ansible_winrm_transport=ntlm
  ansible_winrm_server_cert_validation=ignore`));
  console.log(colors.dim('  ' + symbols.line.repeat(40)));
  console.log();
}

function getHostIP(): string {
  try {
    const output = execSync('hostname -I 2>/dev/null || ipconfig getifaddr en0 2>/dev/null || echo "YOUR_IP_HERE"', { encoding: 'utf-8' });
    return output.trim().split(' ')[0] || 'YOUR_IP_HERE';
  } catch {
    return 'YOUR_IP_HERE';
  }
}