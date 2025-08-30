import { header, statusLine, divider, colors, symbols } from '../lib/ui.js';
import { PowerShellRunner } from '../lib/powershell.js';

export async function statusCommand(options: any) {
  const ps = new PowerShellRunner();
  
  header('WinRM Status');

  try {
    const status = await ps.getWinRMStatus();
    
    if (options.json) {
      console.log(JSON.stringify(status, null, 2));
      return;
    }

    displayStatus(status);
    
  } catch (error: any) {
    console.error(colors.error(`${symbols.cross} Error getting status: ${error.message}`));
    process.exit(1);
  }
}

function displayStatus(status: any) {
  // Service section
  console.log('\n  Service');
  console.log(statusLine('Status', status.service.running ? 'Running' : 'Stopped', 
    status.service.running ? 'success' : 'error'));
  console.log(statusLine('Startup', status.service.startupType));
  console.log(statusLine('PS Remoting', status.service.psRemoting ? 'Enabled' : 'Disabled',
    status.service.psRemoting ? 'success' : undefined));
  
  divider(30);
  
  // Listeners section
  console.log('\n  Listeners');
  if (status.listeners.http) {
    console.log(statusLine('HTTP (5985)', status.listeners.http.active ? 'Active' : 'Inactive',
      status.listeners.http.active ? 'success' : undefined));
  }
  if (status.listeners.https) {
    console.log(statusLine('HTTPS (5986)', status.listeners.https.active ? 'Active' : 'Inactive',
      status.listeners.https.active ? 'success' : undefined));
  }
  
  divider(30);
  
  // Authentication section
  console.log('\n  Authentication');
  console.log(statusLine('NTLM', status.auth.ntlm ? 'Enabled' : 'Disabled',
    status.auth.ntlm ? 'success' : undefined));
  console.log(statusLine('Kerberos', status.auth.kerberos ? 'Enabled' : 'Disabled',
    status.auth.kerberos ? 'success' : undefined));
  console.log(statusLine('Basic', status.auth.basic ? 'Enabled' : 'Disabled',
    status.auth.basic ? 'warning' : undefined));
  console.log(statusLine('CredSSP', status.auth.credssp ? 'Enabled' : 'Disabled',
    status.auth.credssp ? 'warning' : undefined));
  
  divider(30);
  
  // Security section
  console.log('\n  Security');
  if (status.security.certificate) {
    console.log(statusLine('Certificate', status.security.certificate.type));
    if (status.security.certificate.thumbprint) {
      console.log(statusLine('Thumbprint', `${status.security.certificate.thumbprint.substring(0, 12)}...`));
    }
  }
  console.log(statusLine('Unencrypted', status.security.allowUnencrypted ? 'Allowed' : 'Blocked',
    status.security.allowUnencrypted ? 'error' : 'success'));
  
  console.log();
}