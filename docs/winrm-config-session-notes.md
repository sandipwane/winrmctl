# WinRM HTTPS Configuration Report

Overview
This document details the complete process of configuring WinRM HTTPS on Windows instance EC2AMAZ-V17QG6T, including all commands executed, problems encountered, and solutions implemented.
Configuration Steps Performed
Step 1: Create Self-Signed Certificate
Objective: Create a certificate for HTTPS encryption
Commands Executed:
# Initial attempt with environment variable expansion issues
powershell -Command "$cert = New-SelfSignedCertificate -DnsName $env:COMPUTERNAME,'52.54.108.64','iis-buildbox-dev' -CertStoreLocation Cert:\LocalMachine\My -KeyExportPolicy Exportable; Write-Host 'Certificate Thumbprint:' $cert.Thumbprint -ForegroundColor Green"

# Get computer name for certificate creation
Get-ComputerInfo | Select-Object CsName

# Final successful command
powershell -Command "New-SelfSignedCertificate -DnsName 'EC2AMAZ-V17QG6T','52.54.108.64','iis-buildbox-dev' -CertStoreLocation Cert:\LocalMachine\My -KeyExportPolicy Exportable | Select-Object Thumbprint"


Problems Encountered:

Environment variable expansion issues: The $env:COMPUTERNAME variable was not expanding correctly in the command line context
Variable assignment syntax errors: PowerShell variable assignment was causing parsing errors when executed from command line
Solutions Implemented:

Retrieved the computer name separately using Get-ComputerInfo
Used hardcoded computer name 'EC2AMAZ-V17QG6T' in the certificate creation
Simplified the command to directly output the thumbprint using Select-Object Thumbprint
Result: Successfully created certificate with thumbprint 748633378F38E40376077FF2187AB33AF727631B
Step 2: Enable PowerShell Remoting and WinRM Service
Objective: Enable PowerShell remoting and configure WinRM service
Commands Executed:
Enable-PSRemoting -Force -SkipNetworkProfileCheck
Set-Service WinRM -StartupType Automatic
Start-Service WinRM


Problems Encountered: None - all commands executed successfully
Result: PowerShell remoting enabled and WinRM service configured for automatic startup
Step 3: Configure WinRM HTTPS Listener
Objective: Create HTTPS listener on port 5986
Commands Executed:
# Check existing listeners
Get-WSManInstance -ResourceURI winrm/config/listener -Enumerate

# Attempted to remove existing HTTPS listeners (none found)
Get-WSManInstance -ResourceURI winrm/config/listener -Enumerate | Where-Object {$_.Transport -eq 'HTTPS'} | Remove-WSManInstance

# Create new HTTPS listener
New-Item -Path WSMan:\localhost\Listener -Transport HTTPS -Address * -CertificateThumbPrint '748633378F38E40376077FF2187AB33AF727631B' -Force


Problems Encountered:

Remove-WSManInstance parameter binding error: The piped command failed due to missing ResourceURI parameter
Solutions Implemented:

Verified that no existing HTTPS listeners existed, so removal wasn't necessary
Proceeded directly to creating the new HTTPS listener
Result: Successfully created HTTPS listener Listener_1305953032 on port 5986
Step 4: Configure WinRM Authentication and Settings
Objective: Enable authentication methods and configure service settings
Commands Executed:
Set-Item WSMan:\localhost\Service\Auth\Basic -Value 'true'
Set-Item WSMan:\localhost\Service\AllowUnencrypted -Value 'false'
Set-Item WSMan:\localhost\MaxEnvelopeSizekb -Value 2048
Set-Item WSMan:\localhost\Service\Auth\CredSSP -Value 'true'


Problems Encountered:

Parameter binding issue: Initial attempt without quotes around boolean values caused parameter binding errors
Solutions Implemented:

Used quoted string values ('true', 'false') instead of PowerShell boolean literals
This ensured proper parameter binding in the command-line context
Result: Successfully configured Basic and CredSSP authentication, disabled unencrypted connections, and set envelope size
Step 5: Configure Windows Firewall
Objective: Allow inbound connections on port 5986
Commands Executed:
New-NetFirewallRule -DisplayName 'WinRM HTTPS Inbound' -Direction Inbound -LocalPort 5986 -Protocol TCP -Action Allow -Profile Any
Restart-Service WinRM


Problems Encountered: None - firewall rule created successfully
Result: Created firewall rule allowing TCP traffic on port 5986 and restarted WinRM service
Step 6: Verification and Testing
Objective: Verify complete configuration
Commands Executed:
# Verify listeners
winrm enumerate winrm/config/listener

# Test HTTPS connection locally
Test-WSMan -ComputerName localhost -UseSSL

# Check firewall rules
Get-NetFirewallRule -DisplayName 'WinRM HTTPS*' | Format-Table DisplayName, Enabled, Direction, Action

# Check service status
Get-Service WinRM | Format-Table Name, Status, StartType

# Verify port listening
netstat -an | findstr 5986


Problems Encountered:

SSL Certificate warnings: The Test-WSMan command showed certificate authority and hostname mismatch warnings
Analysis and Decision:

Certificate Authority Warning: Expected behavior with self-signed certificates - not a configuration error
Hostname Mismatch Warning: Expected when testing with localhost against a certificate issued for the actual computer name
Decision: These warnings are acceptable for internal/development use and don't indicate configuration failure
Verification Results:

âœ… Both HTTP (5985) and HTTPS (5986) listeners active
âœ… Certificate thumbprint matches: 748633378F38E40376077FF2187AB33AF727631B
âœ… Firewall rule enabled and allowing connections
âœ… WinRM service running with automatic startup
âœ… Port 5986 listening on all interfaces
Technical Decisions and Rationale
1. Certificate Configuration
Decision: Created certificate with multiple DNS names including computer name, IP address, and custom hostname Rationale: Provides flexibility for connections using different addressing methods
2. Authentication Methods
Decision: Enabled both Basic and CredSSP authentication Rationale:

Basic authentication for simple username/password scenarios
CredSSP for scenarios requiring credential delegation
3. Security Settings
Decision: Disabled unencrypted connections (AllowUnencrypted = false) Rationale: Forces all communication over HTTPS for security
4. Firewall Configuration
Decision: Created rule for "Any" profile instead of specific profiles Rationale: Ensures connectivity regardless of current Windows firewall profile
Final Configuration Summary
Connection Information:

Hostname: EC2AMAZ-V17QG6T
IP Address: 52.54.108.64
Port: 5986
Protocol: HTTPS
Authentication: Basic (username/password)
Certificate Thumbprint: 748633378F38E40376077FF2187AB33AF727631B
Services Status:

WinRM Service: Running (Automatic startup)
PowerShell Remoting: Enabled
HTTPS Listener: Active on port 5986
Firewall: Port 5986 allowed for inbound connections
Lessons Learned

Command-line PowerShell execution: Complex variable assignments and expansions work better with simplified, direct commands rather than complex one-liners
Certificate warnings: Self-signed certificate warnings during testing are expected behavior and don't indicate configuration problems
Parameter quoting: String values for PowerShell cmdlets should be properly quoted when executed from command line
Verification importance: Multiple verification steps help ensure complete and correct configuration
Troubleshooting Commands Used
For future reference, these diagnostic commands were used during configuration:
# List all listeners
Get-WSManInstance -ResourceURI winrm/config/listener -Enumerate

# Test WinRM connectivity
Test-WSMan -ComputerName localhost -UseSSL

# Check service configuration
Get-WSManInstance -ResourceURI winrm/config/service
Get-WSManInstance -ResourceURI winrm/config/service/auth

# Network verification
netstat -an | findstr 5986

# Service status
Get-Service WinRM

# Firewall rules
Get-NetFirewallRule -DisplayName "WinRM HTTPS*"


The configuration completed successfully and is ready for remote WinRM HTTPS connections.
