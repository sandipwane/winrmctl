import chalk from 'chalk';

export class CertificateManager {
  async createSelfSignedCert(): Promise<void> {
    console.log(chalk.gray('  [Mock] Generating self-signed certificate...'));
    await this.delay(1000);
    console.log(chalk.gray('  [Mock] Certificate thumbprint: 748633378F...'));
  }

  async importCertificate(path: string): Promise<void> {
    console.log(chalk.gray(`  [Mock] Importing certificate from ${path}...`));
    await this.delay(800);
  }

  async exportCertificate(thumbprint: string, path: string): Promise<void> {
    console.log(chalk.gray(`  [Mock] Exporting certificate to ${path}...`));
    await this.delay(600);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}