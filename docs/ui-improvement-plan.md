# UI Improvement Plan for winrmctl

## Overview

This document outlines the transformation of winrmctl's user interface from a traditional, heavily-styled CLI to a modern, clean interface inspired by tools like Claude Code, Vercel CLI, and GitHub CLI.

## Design Principles

### 1. **Minimalism First**
- Remove unnecessary visual elements
- Use whitespace effectively
- Focus on content, not decoration

### 2. **Subtle Visual Hierarchy**
- Use indentation and spacing instead of borders
- Employ color sparingly for emphasis
- Clear distinction between primary and secondary information

### 3. **Consistency**
- Uniform styling across all commands
- Predictable interaction patterns
- Reusable UI components

### 4. **Professional Aesthetics**
- Clean, modern appearance
- Avoid excessive colors and symbols
- Typography-focused design

## Current State Analysis

### Current Issues:
- Heavy box-drawing characters (╔══════╗)
- Excessive use of colors
- Multiple styling approaches across commands
- Inconsistent spacing and alignment
- Overly decorated headers

### Current Menu Display:
```
╔══════════════════════════════════════╗
║         winrmctl Setup Wizard        ║
╚══════════════════════════════════════╝

? What would you like to do?
❯ [QUICK] Quick Setup (Recommended)
     → Secure defaults, one click
  [CUSTOM] Custom Setup
     → Full control over config
```

## Proposed Design

### New Menu Display:
```
winrmctl

Quick Setup       →  Auto-configure with best practices
Custom Setup      →  Choose settings step-by-step
Test Connection   →  Check if WinRM is working
Show Status       →  View current WinRM settings
Remove Config     →  Disable and reset WinRM

Exit (q)
```

### Alternative Compact Design:
```
winrmctl setup

  ◆  Quick Setup         Auto-configure with best practices
  ○  Custom Setup        Choose settings step-by-step
  ○  Test Connection     Check if WinRM is working
  ○  Show Status         View current WinRM settings
  ○  Remove Config       Disable and reset WinRM
  
  Press q to exit
```

## Implementation Strategy

### Phase 1: Create UI Library

Create `src/lib/ui.ts` with reusable components:

```typescript
import chalk from 'chalk';
import figures from 'figures';
import ora from 'ora';

// Color palette
export const colors = {
  primary: chalk.hex('#3B82F6'),    // Soft blue
  success: chalk.hex('#10B981'),    // Soft green
  warning: chalk.hex('#F59E0B'),    // Amber
  error: chalk.hex('#EF4444'),      // Red
  muted: chalk.hex('#6B7280'),      // Gray
  dim: chalk.dim,
};

// UI symbols using figures package
// figures automatically handles fallbacks for Windows terminals
export const symbols = {
  pointer: figures.pointer,           // ›
  bullet: figures.bullet,             // •
  arrow: figures.arrowRight,          // →
  check: figures.tick,                // ✓
  cross: figures.cross,               // ✗
  info: figures.info,                 // ℹ
  warning: figures.warning,           // ⚠
  dot: figures.middleDot,            // ·
  circle: figures.circle,             // ○
  circleFilled: figures.circleFilled, // ●
  radioOn: figures.radioOn,          // ◉
  radioOff: figures.radioOff,        // ○
  star: figures.star,                // ★
  square: figures.square,            // ◻
  squareFilled: figures.squareSmallFilled, // ◼
  play: figures.play,                // ►
  line: figures.line,                // ─
  ellipsis: figures.ellipsis,        // …
  pointerSmall: figures.pointerSmall, // ›
};

// Header component
export function header(title: string, subtitle?: string) {
  console.clear();
  console.log();
  console.log(chalk.bold(title));
  if (subtitle) {
    console.log(colors.muted(subtitle));
  }
  console.log();
}

// Menu item component
export function menuItem(label: string, description: string, selected = false) {
  const prefix = selected ? colors.primary(symbols.radioOn) : symbols.radioOff;
  const labelText = selected ? chalk.bold(label) : label;
  const descText = colors.muted(description);
  
  return `  ${prefix}  ${labelText.padEnd(20)} ${descText}`;
}

// Status line component
export function statusLine(label: string, value: string, status?: 'success' | 'warning' | 'error') {
  const statusColors = {
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };
  
  const color = status ? statusColors[status] : chalk.white;
  return `  ${colors.muted(label.padEnd(16))} ${color(value)}`;
}

// Progress indicator with ora
export function progress(message: string, type: 'default' | 'dots' | 'line' = 'default') {
  const spinners = {
    default: {
      frames: ['◐', '◓', '◑', '◒'],
      interval: 80,
    },
    dots: 'dots',      // ora built-in spinner
    line: 'line',      // ora built-in spinner
  };
  
  const spinner = ora({
    text: message,
    spinner: spinners[type],
    color: 'blue',
  });
  return spinner;
}

// Loading states examples
export async function withSpinner(message: string, task: () => Promise<any>) {
  const spinner = ora({
    text: message,
    spinner: 'dots',
    color: 'cyan',
  }).start();
  
  try {
    const result = await task();
    spinner.succeed(chalk.green(`${symbols.check} ${message}`));
    return result;
  } catch (error) {
    spinner.fail(chalk.red(`${symbols.cross} ${message}`));
    throw error;
  }
}

// Multi-step progress
export class StepProgress {
  private spinner: any;
  private steps: string[];
  private current: number = 0;
  
  constructor(steps: string[]) {
    this.steps = steps;
    this.spinner = ora({
      spinner: 'dots',
      color: 'cyan',
    });
  }
  
  start() {
    this.spinner.start(this.steps[0]);
  }
  
  next() {
    this.spinner.succeed();
    this.current++;
    if (this.current < this.steps.length) {
      this.spinner.start(this.steps[this.current]);
    }
  }
  
  finish(message?: string) {
    this.spinner.succeed(message || 'Complete!');
  }
  
  fail(message?: string) {
    this.spinner.fail(message || 'Failed');
  }
}

// Alert component
export function alert(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  const prefixes = {
    info: colors.primary(symbols.info),
    success: colors.success(symbols.check),
    warning: colors.warning(symbols.warning),
    error: colors.error(symbols.cross),
  };
  
  console.log(`\n  ${prefixes[type]} ${message}\n`);
}

// Divider
export function divider(width = 40) {
  console.log(colors.muted('  ' + symbols.line.repeat(width)));
}
```

### Phase 2: Custom Inquirer Theme

Create custom theme configuration:

```typescript
import inquirer from 'inquirer';
import { colors, symbols } from './ui.js';

// Custom inquirer theme
export const customTheme = {
  prefix: colors.muted(symbols.pointer),
  spinner: {
    interval: 80,
    frames: ['◐', '◓', '◑', '◒']
  },
  style: {
    answer: colors.primary,
    highlight: chalk.bold,
    selected: colors.primary,
    unselected: colors.muted,
  }
};

// Custom list prompt
export async function selectPrompt(message: string, choices: Array<{name: string, value: string, description?: string}>) {
  const formattedChoices = choices.map(choice => ({
    name: choice.description 
      ? `${choice.name.padEnd(20)} ${colors.muted(choice.description)}`
      : choice.name,
    value: choice.value,
    short: choice.name,
  }));

  return inquirer.prompt([{
    type: 'list',
    name: 'selection',
    message: colors.muted(message),
    choices: formattedChoices,
    pageSize: 15,
    loop: false,
    prefix: colors.muted(symbols.pointer),
  }]);
}
```

### Phase 3: Update Main Menu

Transform `src/commands/init.ts`:

```typescript
import { header, selectPrompt, colors } from '../lib/ui.js';

export async function initCommand(options: any) {
  header('winrmctl', 'Windows Remote Management Configuration');

  const choices = [
    {
      name: 'Quick Setup',
      value: 'quick',
      description: 'Auto-configure with best practices'
    },
    {
      name: 'Custom Setup',
      value: 'custom',
      description: 'Choose settings step-by-step'
    },
    {
      name: 'Test Connection',
      value: 'test',
      description: 'Check if WinRM is working'
    },
    {
      name: 'Show Status',
      value: 'status',
      description: 'View current WinRM settings'
    },
    {
      name: 'Remove Config',
      value: 'remove',
      description: 'Disable and reset WinRM'
    },
    {
      name: colors.dim('Exit'),
      value: 'exit',
      description: ''
    }
  ];

  const { selection } = await selectPrompt('Select an option:', choices);
  
  // Handle selection...
}
```

### Phase 4: Update Status Display

Transform status output to be cleaner:

```typescript
import { header, statusLine, divider, colors, symbols } from '../lib/ui.js';

export function displayStatus(status: any) {
  header('WinRM Status');
  
  console.log(colors.muted('  Service'));
  console.log(statusLine('Status', status.running ? 'Running' : 'Stopped', 
    status.running ? 'success' : 'error'));
  console.log(statusLine('Startup', status.startupType));
  
  divider(30);
  
  console.log(colors.muted('  Authentication'));
  console.log(statusLine('NTLM', status.auth.ntlm ? 'Enabled' : 'Disabled',
    status.auth.ntlm ? 'success' : undefined));
  console.log(statusLine('Kerberos', status.auth.kerberos ? 'Enabled' : 'Disabled',
    status.auth.kerberos ? 'success' : undefined));
  console.log(statusLine('Basic', status.auth.basic ? 'Enabled' : 'Disabled',
    status.auth.basic ? 'warning' : undefined));
}
```

## Progress Messages and User Feedback

### Quick Setup Progress Messages

Use clear, action-oriented language that non-technical users can understand:

```typescript
// Progress messages for Quick Setup
const setupSteps = [
  'Verifying system requirements',      // was: "Checking prerequisites"
  'Generating security certificate',     // was: "Creating self-signed certificate"
  'Setting up secure connection',        // was: "Configuring HTTPS listener"
  'Configuring authentication',          // was: "Setting authentication methods"
  'Updating firewall settings',          // was: "Configuring firewall rules"
  'Verifying setup works',              // was: "Testing configuration"
];

// Usage with StepProgress
const progress = new StepProgress(setupSteps);
progress.start();
// ... perform each step
progress.next();
// ... continue
progress.finish('✓ WinRM is ready to use');
```

### Custom Setup Profile Descriptions

Make profiles clearer with outcome-focused descriptions:

```typescript
const profiles = [
  {
    name: 'Production',
    value: 'production',
    description: 'Enterprise-ready • Domain auth • Maximum security',
    // was: "Kerberos/NTLM auth • Required certificates • Strict firewall"
  },
  {
    name: 'Development',
    value: 'development',
    description: 'Local testing • Mixed auth • Flexible security',
    // was: "Basic/NTLM auth • Self-signed certs OK • Relaxed firewall"
  },
  {
    name: 'Testing',
    value: 'testing',
    description: 'CI/CD ready • Simple auth • Minimal restrictions',
    // was: "Basic auth enabled • Self-signed certs • Open firewall"
  },
];
```

### Success and Error Messages

Use encouraging, clear feedback:

```typescript
// Success messages
export const messages = {
  success: {
    configured: '✓ WinRM is ready to use',           // was: "[SUCCESS] WinRM configured successfully"
    tested: '✓ Connection test passed',              // was: "[SUCCESS] Connection established"
    removed: '✓ WinRM settings have been reset',     // was: "[SUCCESS] Configuration removed"
  },
  
  prompts: {
    ansibleConfig: 'Ansible Configuration (copy this):', // was: "Ready for Ansible! Add to inventory:"
    testAnother: 'Test another connection?',            // was: "Do you want to test another host?"
    confirmRemove: 'This will disable WinRM. Continue?', // was: "Are you sure you want to remove WinRM configuration?"
  },
  
  errors: {
    notAdmin: '⚠ Please run as Administrator',          // was: "[ERROR] Administrator privileges required"
    connectionFailed: '✗ Could not connect to WinRM',   // was: "[ERROR] Connection failed"
    certError: '✗ Could not create certificate',        // was: "[ERROR] Certificate generation failed"
  }
};
```

### Status Display

Clean, scannable status output:

```typescript
// Before:
// WinRM Service:     ● Running
// Startup Type:      Automatic
// PS Remoting:       ✓ Enabled

// After:
export function displayStatus(status: any) {
  console.log('Service');
  console.log('  Status:    ' + (status.running ? chalk.green('Running') : chalk.red('Stopped')));
  console.log('  Startup:   ' + status.startupType);
  console.log('  Remoting:  ' + (status.psRemoting ? chalk.green('Enabled') : chalk.gray('Disabled')));
  
  console.log('\nSecurity');
  console.log('  HTTPS:     ' + (status.https ? chalk.green('Configured') : chalk.yellow('Not configured')));
  console.log('  Auth:      ' + getAuthMethods(status.auth).join(', '));
}
```

## Available Symbols from Figures Package

The `figures` package provides cross-platform Unicode symbols with automatic fallbacks for Windows:

| Symbol | Name | Unicode | Windows Fallback |
|--------|------|---------|------------------|
| `figures.tick` | Success/Check | ✓ | √ |
| `figures.cross` | Error/Failed | ✗ | × |
| `figures.star` | Favorite/Special | ★ | * |
| `figures.square` | Checkbox empty | ◻ | [ ] |
| `figures.squareSmallFilled` | Checkbox filled | ◼ | [×] |
| `figures.circle` | Radio empty | ○ | ( ) |
| `figures.circleFilled` | Selected | ● | (*) |
| `figures.radioOn` | Radio selected | ◉ | (*) |
| `figures.radioOff` | Radio empty | ○ | ( ) |
| `figures.bullet` | List item | • | * |
| `figures.pointer` | Arrow pointer | › | > |
| `figures.pointerSmall` | Small pointer | › | » |
| `figures.arrowUp` | Up arrow | ↑ | ↑ |
| `figures.arrowDown` | Down arrow | ↓ | ↓ |
| `figures.arrowLeft` | Left arrow | ← | ← |
| `figures.arrowRight` | Right arrow | → | → |
| `figures.info` | Information | ℹ | i |
| `figures.warning` | Warning | ⚠ | ‼ |
| `figures.hamburger` | Menu | ☰ | ≡ |
| `figures.ellipsis` | More/Loading | … | ... |
| `figures.heart` | Like/Favorite | ♥ | ♥ |
| `figures.play` | Play/Start | ► | ► |
| `figures.line` | Horizontal line | ─ | ─ |

## Ora Spinner Types

Available built-in spinner types from ora:

- `dots` - Classic dots animation
- `dots2` through `dots12` - Variations of dots
- `line` - Simple line animation
- `line2` - Alternative line
- `pipe` - Pipe animation
- `simpleDots` - Minimal dots
- `simpleDotsScrolling` - Scrolling dots
- `star` - Star animation
- `star2` - Alternative star
- `flip` - Flipping animation
- `hamburger` - Hamburger menu animation
- `growVertical` - Growing vertical bar
- `growHorizontal` - Growing horizontal bar
- `balloon` - Balloon animation
- `balloon2` - Alternative balloon
- `noise` - Random noise effect
- `bounce` - Bouncing animation
- `boxBounce` - Box bounce
- `boxBounce2` - Alternative box bounce
- `christmas` - Holiday themed

## Color Palette

| Use Case | Color | Hex Code | When to Use |
|----------|-------|----------|-------------|
| Primary | Soft Blue | #3B82F6 | Selected items, primary actions |
| Success | Soft Green | #10B981 | Successful operations, enabled features |
| Warning | Amber | #F59E0B | Warnings, potentially unsafe options |
| Error | Red | #EF4444 | Errors, failed operations |
| Muted | Gray | #6B7280 | Secondary text, descriptions |
| Dim | Gray 400 | #9CA3AF | Disabled options, separators |

## Typography Guidelines

1. **Headers**: Bold, single occurrence per screen
2. **Options**: Regular weight, capitalize first letter only
3. **Descriptions**: Muted color, lowercase except proper nouns
4. **Status Values**: Colored based on state
5. **Separators**: Dim, subtle

## Spacing Rules

- Console clear + 1 blank line before header
- 1 blank line after header
- No blank lines between menu items
- 1 blank line before footer/exit option
- 2 spaces indentation for all content

## Implementation Checklist

- [ ] Create `src/lib/ui.ts` with all UI components
- [ ] Update `src/commands/init.ts` with new menu style
- [ ] Update `src/commands/status.ts` with clean status display
- [ ] Update `src/commands/quick.ts` with progress indicators
- [ ] Update `src/commands/configure.ts` with new prompts
- [ ] Update `src/commands/test.ts` with clean output
- [ ] Update `src/commands/remove.ts` with confirmation style
- [ ] Test all commands for consistency
- [ ] Update README with new screenshots

## Before & After Comparison

### Before (Current Implementation):
```
╔══════════════════════════════════════╗
║         winrmctl Setup Wizard        ║
╚══════════════════════════════════════╝

? What would you like to do?
❯ [QUICK] Quick Setup (Recommended)
     → Secure defaults, one click
  [CUSTOM] Custom Setup
     → Full control over config
  [TEST] Test Connection
     → Verify existing setup
  [STATUS] Show Status
     → Current configuration
```

### After (Proposed Design):
```
winrmctl
Windows Remote Management Configuration

  ◆  Quick Setup         Auto-configure with best practices
  ○  Custom Setup        Choose settings step-by-step
  ○  Test Connection     Check if WinRM is working
  ○  Show Status         View current WinRM settings
  ○  Remove Config       Disable and reset WinRM
  
  Exit (q)
```

### Progress Display Comparison:

**Before:**
```
[INFO] Checking prerequisites...
[INFO] Creating self-signed certificate...
[INFO] Configuring HTTPS listener...
[ERROR] Certificate generation failed
```

**After:**
```
⠋ Verifying system requirements
⠙ Generating security certificate
⠹ Setting up secure connection
✗ Could not create certificate
```

## Testing Guidelines

1. Test in different terminal emulators
2. Verify color output in light/dark themes
3. Check Unicode symbol compatibility
4. Test navigation with keyboard
5. Verify screen reader compatibility
6. Test on Windows Terminal, iTerm2, and standard terminals

## References

- [Claude Code UI patterns](https://docs.anthropic.com/claude-code)
- [Vercel CLI design](https://vercel.com/docs/cli)
- [GitHub CLI conventions](https://cli.github.com/)
- [Charm.sh libraries](https://charm.sh/) (for inspiration)

## Next Steps

1. Implement Phase 1 (UI Library)
2. Create a feature branch for testing
3. Gradually migrate each command
4. Gather feedback
5. Refine based on usage

---

*This document is a living guide and will be updated as the implementation progresses.*