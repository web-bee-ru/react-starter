/* eslint-disable @typescript-eslint/no-var-requires */
const process = require('process');
const { version } = require('./package.json');

const ASSETS_PREFIX = process.env.ASSETS_PREFIX || '/';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // @NOTE: Build-time environment variables, can be read as `process.env.<NAME>`
  env: {
    BUILT_AT: process.env.BUILT_AT,
    GIT_COMMIT: process.env.GIT_COMMIT,
    GIT_BRANCH: process.env.GIT_BRANCH,
    DEVELOPMENT_IN_PRODUCTION: parseBoolean(process.env.DEVELOPMENT_IN_PRODUCTION, 'false'),
  },

  // @NOTE: Start-time environment variables, can be read from `import '~/lifecycle/config'`
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL,
    API_NOTIFICATIONS_URL: process.env.API_NOTIFICATIONS_URL,
    POSTHOG_TOKEN: process.env.POSTHOG_TOKEN,
    COMPANY_NAME: process.env.COMPANY_NAME,
    VERSION: version,
  },

  assetPrefix: ASSETS_PREFIX,

  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.API_BASE_URL || '/'}/:path*`, // Proxy to Backend
        },
      ],
    };
  },

  webpack: (config) => {
    // https://react-svgr.com/docs/webpack/#use-svgr-and-asset-svg-in-the-same-project
    config.module.rules.push(
      // @NOTE: Импорт .svg как string
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      // @NOTE: Импорт .svg как ReactComponent
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: ['@svgr/webpack'],
      },
    );
    return config;
  },

  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;

// @DOC: Use to parse env variables with options
function parseOption(value, whitelist, fallback = undefined) {
  const processedFallback = fallback !== undefined ? fallback.toLowerCase() : undefined;
  const processedValue = value !== undefined ? value.toLowerCase() : processedFallback;
  if (whitelist.includes(processedValue)) {
    return processedValue;
  }
  return undefined;
}

// @DOC: Use to parse boolean env variables
function parseBoolean(value, fallback = undefined) {
  const processedFallback = fallback !== undefined ? fallback.toLowerCase() : undefined;
  const processedValue = value !== undefined ? value.toLowerCase() : processedFallback;
  if (['true', 't', '1', 'y', 'on'].includes(processedValue)) return 'true';
  if (['false', 'f', '0', 'n', 'off'].includes(processedValue)) return 'false';
  return undefined;
}
