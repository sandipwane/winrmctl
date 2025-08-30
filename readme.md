# winrmctl

The winrmctl CLI simplifies Windows Remote Management (WinRM) configuration for Ansible and remote management.

## Overview

winrmctl automates the complex process of configuring WinRM on Windows hosts for remote management. Instead of manually running PowerShell scripts, adjusting authentication settings, managing certificates, and configuring firewall rules, winrmctl provides a single command to enable secure WinRM access.

The CLI ensures security best practices by default: HTTPS-only connections, proper certificate handling, and appropriate authentication methods. It generates ready-to-use Ansible inventory snippets and provides clear feedback on configuration status.

## Installation

Install winrmctl globally with npm or Bun:

```bash
npm i -g winrmctl
```

```bash
bun i -g winrmctl
```

## Getting Started

Configure WinRM with secure defaults:

```bash
winrmctl quick
```

Check the current configuration:

```bash
winrmctl status
```

## Commands

### winrmctl quick

Configure WinRM with secure defaults in a single command.

```bash
winrmctl quick
```

### winrmctl init

Launch an interactive setup wizard for step-by-step configuration.

```bash
winrmctl init
```

### winrmctl configure

Apply WinRM configuration with specific options.

```bash
winrmctl configure [options]
```

Options:
- `--port <port>` - Set HTTPS port (default: 5986)
- `--auth <methods>` - Authentication methods (comma-separated)
- `--cert <type>` - Certificate handling (`auto` or `path`)
- `--allow-unencrypted` - Allow unencrypted connections
- `--skip-firewall` - Skip firewall configuration
- `--force` - Override safety checks

Example:

```bash
winrmctl configure --port 5986 --auth kerberos,negotiate
```

### winrmctl test

Test WinRM connectivity to a remote host.

```bash
winrmctl test [options]
```

Options:
- `--host <host>` - Target hostname or IP
- `--user <username>` - Username for authentication
- `--password <password>` - Password for authentication
- `--cert-validation <mode>` - Certificate validation (`skip` or `strict`)

Example:

```bash
winrmctl test --host 192.168.1.100 --user administrator
```

### winrmctl status

Display current WinRM configuration and service status.

```bash
winrmctl status
```

### winrmctl remove

Remove WinRM configuration.

```bash
winrmctl remove [options]
```

Options:
- `--force` - Skip confirmation prompt

### winrmctl profiles

Manage configuration profiles for different environments.

```bash
winrmctl profiles [options]
```

Options:
- `--list` - List all profiles
- `--show <name>` - Display profile details
- `--create <name>` - Create new profile
- `--delete <name>` - Delete profile

Examples:

```bash
# List all profiles
winrmctl profiles --list

# Create production profile
winrmctl profiles --create production

# Apply profile
winrmctl configure --profile production
```

## Global Options

The following options are available for all commands:

- `--json` - Output results as JSON
- `-v, --verbose` - Enable verbose output
- `--check` - Run in dry-run mode
- `--profile <name>` - Use specified configuration profile

## Configuration

### Default Settings

winrmctl uses the following defaults:

- **Port**: 5986 (HTTPS)
- **Authentication**: Negotiate, Kerberos
- **Certificate**: Auto-generated self-signed
- **Encryption**: Required

### Profile Management

Create profiles for different environments:

```bash
# Development environment
winrmctl profiles --create dev
winrmctl configure --profile dev

# Production environment
winrmctl profiles --create prod
winrmctl configure --profile prod --port 5986 --auth kerberos
```

## Troubleshooting

### Connection Issues

Verify WinRM service status:

```bash
winrmctl status
```

Test connectivity:

```bash
winrmctl test --host localhost --user admin
```

### Permission Errors

winrmctl requires Administrator privileges. Run your terminal as Administrator on Windows.

### Certificate Validation

For self-signed certificates in development:

```bash
winrmctl test --cert-validation skip
```

## Requirements

- Windows with PowerShell 5.1 or later
- Administrator privileges
- Node.js 18+ or Bun 1.0+
