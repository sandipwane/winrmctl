# winrmctl - Developer Experience Plan

## Overview
A Bun CLI tool that simplifies WinRM configuration for Ansible and remote management, with focus on exceptional developer experience.

## Command Structure

### Core Commands
```bash
winrmctl init          # Interactive setup wizard
winrmctl quick         # One-command setup with secure defaults
winrmctl configure     # Apply configuration (non-interactive)
winrmctl test          # Test WinRM connectivity
winrmctl status        # Show current config & health
winrmctl remove        # Remove WinRM configuration
winrmctl profiles      # Manage configuration profiles
```

### Command Options & Flags
```bash
# Global Flags
--json            # Output as JSON
--verbose, -v     # Verbose output
--check           # Dry run mode
--profile <name>  # Use configuration profile

# Configure Options
--port 5986                           # HTTPS port (default: 5986)
--auth basic|ntlm|credssp|kerberos  # Authentication methods
--cert auto|<path>                   # Certificate handling
--allow-unencrypted                  # Allow unencrypted (NOT recommended)
--skip-firewall                      # Skip firewall configuration
--force                              # Override safety checks

# Test Options
--host <ip/hostname>      # Target host
--user <username>         # Username
--password <password>     # Password (or prompt)
--cert-validation skip|strict
```

## User Flow Diagram

```
Start
  │
  ├─> Quick Setup ──> Auto Configure ──> Test ──> Complete
  │
  ├─> Custom Setup
  │     ├─> Select Profile
  │     ├─> Configure Certificate
  │     ├─> Set Authentication
  │     ├─> Configure Firewall
  │     ├─> Review Settings
  │     └─> Apply ──> Test ──> Complete
  │
  ├─> Test Connection
  │     ├─> Enter Target
  │     ├─> Enter Credentials
  │     └─> Show Results
  │
  └─> Remove Configuration
        ├─> Confirm
        └─> Clean Up ──> Complete
```

## Interactive TUI Mockups

### Main Menu
```
╔══════════════════════════════════════╗
║         winrmctl Setup Wizard        ║
╠══════════════════════════════════════╣
║                                       ║
║  🚀 Quick Setup (Recommended)         ║
║     → Secure defaults, one click      ║
║                                       ║
║  ⚙️  Custom Setup                     ║
║     → Full control over config        ║
║                                       ║
║  🔍 Test Connection                   ║
║     → Verify existing setup           ║
║                                       ║
║  📊 Show Status                       ║
║     → Current configuration           ║
║                                       ║
║  🗑️  Remove Configuration             ║
║     → Clean up WinRM settings         ║
║                                       ║
║  [↑↓] Navigate  [Enter] Select  [Q] Quit ║
╚══════════════════════════════════════╝
```

### Quick Setup Progress
```
╔══════════════════════════════════════╗
║      Quick Setup - In Progress       ║
╠══════════════════════════════════════╣
║                                       ║
║  ✅ Checking prerequisites            ║
║  ✅ Creating self-signed certificate  ║
║  ⏳ Configuring HTTPS listener        ║
║  ⏳ Setting authentication methods    ║
║  ⏳ Configuring firewall rules        ║
║  ⏳ Testing configuration             ║
║                                       ║
║  Progress: ████████░░░░░░░░░  40%     ║
║                                       ║
║  Current: Creating HTTPS listener...  ║
║                                       ║
╚══════════════════════════════════════╝
```

### Custom Setup - Profile Selection
```
╔══════════════════════════════════════╗
║     Select Configuration Profile     ║
╠══════════════════════════════════════╣
║                                       ║
║  ▶ Production (Recommended)          ║
║    • Kerberos/NTLM auth              ║
║    • Required certificates           ║
║    • Strict firewall                 ║
║                                       ║
║  ○ Development                       ║
║    • Basic/NTLM auth                 ║
║    • Self-signed certs OK            ║
║    • Relaxed firewall                ║
║                                       ║
║  ○ Testing                           ║
║    • Basic auth enabled              ║
║    • Self-signed certs               ║
║    • Open firewall                   ║
║                                       ║
║  ○ Custom                            ║
║    • Configure everything manually   ║
║                                       ║
║  [↑↓] Select  [Enter] Continue  [←] Back ║
╚══════════════════════════════════════╝
```

### Status Display
```
╔══════════════════════════════════════╗
║        WinRM Configuration Status    ║
╠══════════════════════════════════════╣
║                                       ║
║  Service Status                      ║
║  ├─ WinRM Service:     ✅ Running    ║
║  ├─ Startup Type:      Automatic     ║
║  └─ PS Remoting:       ✅ Enabled    ║
║                                       ║
║  Listeners                           ║
║  ├─ HTTP (5985):       ✅ Active     ║
║  └─ HTTPS (5986):      ✅ Active     ║
║                                       ║
║  Authentication                      ║
║  ├─ Basic:             ❌ Disabled   ║
║  ├─ NTLM:              ✅ Enabled    ║
║  ├─ Kerberos:          ✅ Enabled    ║
║  └─ CredSSP:           ❌ Disabled   ║
║                                       ║
║  Security                            ║
║  ├─ Certificate:       Self-signed   ║
║  ├─ Thumbprint:        748633378F... ║
║  └─ Unencrypted:       ❌ Disabled   ║
║                                       ║
║  [R] Refresh  [T] Test  [Q] Quit     ║
╚══════════════════════════════════════╝
```

### Test Connection
```
╔══════════════════════════════════════╗
║         Test WinRM Connection        ║
╠══════════════════════════════════════╣
║                                       ║
║  Target Host:                        ║
║  ┌─────────────────────────────────┐ ║
║  │ 192.168.1.100                   │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  Username:                           ║
║  ┌─────────────────────────────────┐ ║
║  │ Administrator                   │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  Password:                           ║
║  ┌─────────────────────────────────┐ ║
║  │ ••••••••••••                    │ ║
║  └─────────────────────────────────┘ ║
║                                       ║
║  □ Skip certificate validation       ║
║                                       ║
║  [Tab] Next Field  [Enter] Test  [Esc] Cancel ║
╚══════════════════════════════════════╝
```

## Configuration Profiles

### Built-in Profiles

```yaml
# production.yaml
production:
  port: 5986
  auth: 
    - kerberos
    - ntlm
  cert: required
  unencrypted: false
  firewall: 
    profile: domain
    ports: [5986]
  max_envelope_size: 2048
  
# development.yaml
development:
  port: 5986
  auth: 
    - basic
    - ntlm
  cert: self-signed
  unencrypted: false
  firewall: 
    profile: any
    ports: [5985, 5986]
  max_envelope_size: 4096
  
# testing.yaml
testing:
  port: 5986
  auth: 
    - basic
  cert: self-signed
  unencrypted: false
  firewall: 
    profile: any
    ports: [5985, 5986]
  allow_basic: true
  max_envelope_size: 8192
```

## Features by Priority

### MVP (Phase 1)
1. **Quick Setup** - One-command secure configuration
2. **Status Check** - Show current WinRM configuration
3. **Test Connection** - Verify WinRM connectivity
4. **Certificate Management** - Auto-generate self-signed certs
5. **Idempotent Operations** - Safe to re-run
6. **JSON Output** - For automation integration

### Phase 2
1. **Configuration Profiles** - Pre-defined and custom profiles
2. **Interactive TUI** - Full terminal UI with opentui
3. **Ansible Inventory Generation** - Auto-generate inventory snippets
4. **Remote Configuration** - Configure remote hosts
5. **Backup/Restore** - Save and restore configurations

### Phase 3
1. **Domain Integration** - Kerberos/AD configuration
2. **Certificate Management** - Import/export certificates
3. **Monitoring** - Health checks and diagnostics
4. **Policy Compliance** - Security hardening presets
5. **Multi-host Management** - Configure multiple hosts

## Success Metrics

### User Experience
- **Time to Configure**: < 30 seconds for quick setup
- **Error Recovery**: Clear error messages with remediation steps
- **Documentation**: Copy-paste ready examples
- **Compatibility**: Windows Server 2016+ and Windows 10/11

### Technical Metrics
- **Idempotency**: 100% safe re-runs
- **Security**: HTTPS by default, no plain text
- **Reliability**: Rollback on failure
- **Performance**: < 5 second status checks

## Implementation Notes

### Technology Stack
- **CLI Framework**: Commander.js or Yargs
- **TUI Framework**: Opentui + Solid.js
- **PowerShell Execution**: Node child_process
- **Configuration**: YAML/JSON with schema validation
- **Testing**: Jest + PowerShell Pester

### Security Considerations
- Never store passwords in plain text
- Default to HTTPS only
- Validate certificates by default
- Audit log all configuration changes
- Require explicit --force for dangerous operations

### Distribution
- NPM package: `npm install -g winrmctl`
- Standalone binaries via pkg/nexe
- Chocolatey package for Windows
- Homebrew formula for macOS/Linux admins

## Example Usage Scenarios

### Scenario 1: Quick Setup
```bash
# One command to configure everything
winrmctl quick

# Output:
✅ Prerequisites checked
✅ Self-signed certificate created
✅ HTTPS listener configured on port 5986
✅ Authentication methods set (NTLM, Kerberos)
✅ Firewall rules created
✅ WinRM service configured

Ready for Ansible! Add to inventory:
[windows]
server1 ansible_host=192.168.1.100

[windows:vars]
ansible_user=Administrator
ansible_connection=winrm
ansible_winrm_transport=ntlm
ansible_winrm_server_cert_validation=ignore
```

### Scenario 2: Custom Configuration
```bash
# Use development profile with custom port
winrmctl configure --profile development --port 5987

# Check status
winrmctl status --json

# Test connection
winrmctl test --host localhost --user Administrator
```

### Scenario 3: Ansible Integration
```bash
# Generate Ansible inventory
winrmctl inventory --host 192.168.1.100 > hosts.ini

# Test with ansible
ansible -i hosts.ini windows -m win_ping
```

## Next Steps

1. **Prototype TUI** - Build mock interface with Opentui
2. **Core PowerShell Scripts** - Extract from session notes
3. **MVP Implementation** - Quick setup and status commands
4. **User Testing** - Get feedback from Windows admins
5. **Documentation** - Write comprehensive guides