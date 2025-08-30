export interface WinRMConfig {
  port: number;
  auth: string[];
  cert: 'auto' | 'required' | string;
  unencrypted: boolean;
  firewall: boolean;
  maxEnvelopeSize?: number;
  profile?: string;
}

export interface WinRMStatus {
  service: {
    running: boolean;
    startupType: string;
    psRemoting: boolean;
  };
  listeners: {
    http?: {
      active: boolean;
      port: number;
    };
    https?: {
      active: boolean;
      port: number;
    };
  };
  auth: {
    basic: boolean;
    ntlm: boolean;
    kerberos: boolean;
    credssp: boolean;
  };
  security: {
    certificate?: {
      type: string;
      thumbprint: string;
    };
    allowUnencrypted: boolean;
  };
}