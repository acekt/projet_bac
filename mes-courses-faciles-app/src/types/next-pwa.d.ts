declare module 'next-pwa' {
  import { NextConfig } from 'next';
  function withPWAInit(config: unknown): (nextConfig: NextConfig) => NextConfig;
  export default withPWAInit;
}
