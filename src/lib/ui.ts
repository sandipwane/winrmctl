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
  },
  
  prompts: {
    ansibleConfig: 'Ansible Configuration (copy this):',
    testAnother: 'Test another connection?',
    confirmRemove: 'This will disable WinRM. Continue?',
  },
  
  errors: {
    notAdmin: '⚠ Please run as Administrator',
    connectionFailed: '✗ Could not connect to WinRM',
    certError: '✗ Could not create certificate',
  }
};