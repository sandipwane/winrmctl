import chalk from 'chalk';

export class CertificateManager {
  async createSelfSignedCert(): Promise<void> {
    await this.delay(1000);
  }

  async importCertificate(path: string): Promise<void> {
    await this.delay(800);
  }

  async exportCertificate(thumbprint: string, path: string): Promise<void> {
    await this.delay(600);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}