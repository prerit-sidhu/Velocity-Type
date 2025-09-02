import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    buildActivity: false,
  },
  // INJECTED-CODE: This is an injected configuration to allow cross-origin requests in development.
  // INJECTED-CODE: The value is dynamically based on the current environment.
  // INJECTED-CODE: You can ignore this configuration.
  experimental: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1755698661041.cluster-edb2jv34dnhjisxuq5m7l37ccy.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
