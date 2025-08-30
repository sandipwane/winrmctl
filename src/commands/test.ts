import chalk from 'chalk';
import ora from 'ora';
import { PowerShellRunner } from '../lib/powershell.js';

export async function testCommand(options: any) {
  const ps = new PowerShellRunner();
  
  console.log(chalk.blue.bold('\nTesting WinRM Connection'));
  console.log(chalk.gray('━'.repeat(40)));

  const host = options.host || 'localhost';
  const user = options.user || process.env.USERNAME || 'Administrator';
  const port = options.port || 5986;

  console.log(chalk.cyan('Connection Details:'));
  console.log(`  Host: ${host}`);
  console.log(`  Port: ${port}`);
  console.log(`  User: ${user}`);
  console.log(`  Certificate Validation: ${options.certValidation === 'skip' ? 'Skipped' : 'Strict'}`);
  console.log();

  const spinner = ora('Testing connection...').start();

  try {
    const result = await ps.testWinRMConnection(host, port, {
      user,
      password: options.password,
      skipCertValidation: options.certValidation === 'skip' || options.skipCertValidation,
    });

    if (result.success) {
      spinner.succeed(chalk.green('✅ Connection successful!'));
      
      if (result.details) {
        console.log(chalk.cyan('\nConnection Details:'));
        console.log(`  Protocol: ${result.details.protocol}`);
        console.log(`  Auth Method: ${result.details.authMethod}`);
        console.log(`  Response Time: ${result.details.responseTime}ms`);
      }
    } else {
      spinner.fail(chalk.red('❌ Connection failed'));
      
      if (result.error) {
        console.log(chalk.red(`\nError: ${result.error}`));
        
        if (result.troubleshooting) {
          console.log(chalk.yellow('\nTroubleshooting:'));
          result.troubleshooting.forEach(tip => {
            console.log(`  • ${tip}`);
          });
        }
      }
    }
  } catch (error) {
    spinner.fail(chalk.red(`Test failed: ${error.message}`));
    process.exit(1);
  }
}