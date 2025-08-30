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
  dot: '·',                          // middleDot not available in figures v6
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
  const spinnerOptions: any = type === 'default' 
    ? {
        frames: ['◐', '◓', '◑', '◒'],
        interval: 80,
      }
    : type; // 'dots' or 'line' are built-in spinner names
  
  const spinner = ora({
    text: message,
    spinner: spinnerOptions,
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
      indent: 2,
    });
  }
  
  start() {
    this.spinner.start(colors.muted(this.steps[0]));
  }
  
  next() {
    this.spinner.succeed(colors.success(this.steps[this.current]));
    this.current++;
    if (this.current < this.steps.length) {
      this.spinner.start(colors.muted(this.steps[this.current]));
    }
  }
  
  finish(message?: string) {
    if (this.current < this.steps.length) {
      this.spinner.succeed(colors.success(this.steps[this.current]));
    }
    if (message) {
      console.log(`\n  ${message}`);
    }
  }
  
  fail(message?: string) {
    this.spinner.fail(message || colors.error(`${symbols.cross} Failed`));
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
  const inquirer = (await import('inquirer')).default;
  
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
    suffix: colors.muted(` (${figures.arrowUp}${figures.arrowDown} to navigate)`),
  }]);
}

// Success and error messages
export const messages = {
  success: {
    configured: '✓ WinRM is ready to use',
    tested: '✓ Connection test passed',
    removed: '✓ WinRM settings have been reset',
    certCreated: '✓ Security certificate generated',
    authConfigured: '✓ Authentication configured',
    firewallUpdated: '✓ Firewall rules updated',
    serviceStarted: '✓ WinRM service started',
  },
  
  prompts: {
    ansibleConfig: 'Ansible Configuration (copy this):',
    testAnother: 'Test another connection?',
    confirmRemove: 'This will disable WinRM. Continue?',
    selectProfile: 'Choose a configuration profile:',
    enterPassword: 'Enter password:',
    skipCert: 'Skip certificate validation?',
  },
  
  errors: {
    notAdmin: '⚠ Please run as Administrator',
    connectionFailed: '✗ Could not connect to WinRM',
    certError: '✗ Could not create certificate',
    serviceError: '✗ WinRM service is not running',
    authError: '✗ Authentication failed',
    firewallError: '✗ Could not configure firewall',
    invalidConfig: '✗ Invalid configuration',
  },
  
  info: {
    checkingPrereqs: 'Verifying system requirements',
    creatingCert: 'Generating security certificate',
    configuringHTTPS: 'Setting up secure connection',
    settingAuth: 'Configuring authentication',
    updatingFirewall: 'Updating firewall settings',
    testingConfig: 'Verifying setup works',
    applyingConfig: 'Applying configuration',
    dryRun: 'Dry run mode - no changes will be made',
  }
};

// Display configuration summary
export function configSummary(config: any) {
  console.log();
  console.log(colors.muted('  Configuration Summary'));
  divider(30);
  
  if (config.port) {
    console.log(statusLine('Port', config.port.toString()));
  }
  if (config.auth) {
    const authMethods = Array.isArray(config.auth) ? config.auth : config.auth.split(',');
    console.log(statusLine('Auth Methods', authMethods.join(', ')));
  }
  if (config.cert) {
    console.log(statusLine('Certificate', config.cert === 'auto' ? 'Auto-generate' : config.cert));
  }
  if (config.firewall !== undefined) {
    console.log(statusLine('Firewall', config.firewall ? 'Configure' : 'Skip'));
  }
  
  console.log();
}

// Display troubleshooting tips
export function troubleshootingTips(tips: string[]) {
  console.log();
  console.log(colors.warning(`  ${symbols.info} Troubleshooting Tips:`));
  tips.forEach(tip => {
    console.log(colors.muted(`    ${symbols.bullet} ${tip}`));
  });
  console.log();
}

// Format time duration
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

// Display step result
export function stepResult(label: string, success: boolean, detail?: string) {
  const icon = success ? colors.success(symbols.check) : colors.error(symbols.cross);
  const status = success ? colors.success('Success') : colors.error('Failed');
  console.log(`  ${icon} ${label.padEnd(30)} ${status}`);
  if (detail) {
    console.log(colors.muted(`    ${detail}`));
  }
}