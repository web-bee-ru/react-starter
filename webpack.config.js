/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const urljoin = require('url-join');
const webpack = require('webpack');
const package = require('./package.json');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin;
const EnvironmentPlugin = webpack.EnvironmentPlugin;

require('dotenv').config();

module.exports = (env, argv) => {
  const mode = argv.mode || env.NODE_ENV || 'none';
  const isProduction = mode === 'production';

  const PUBLIC_PATH = env.PUBLIC_PATH || '/';
  const STATIC_PATH = PUBLIC_PATH;
  const APP_REMOTE_NAME = env.APP_REMOTE_NAME || 'reactStarter';

  return {
    mode,
    target: isProduction ? ['web', 'es5'] : 'web',
    entry: {
      app: path.join(__dirname, 'src', 'index.tsx'),
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'auto',
      clean: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~': path.resolve(__dirname, './src'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    devtool: isProduction ? false : 'inline-source-map',
    optimization: {
      minimize: isProduction,
      // @NOTE: выключаю удаление debugger'ов, see - https://github.com/webpack/webpack/blob/main/lib/config/defaults.js#L995
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            compress: {
              passes: 2,
              drop_console: false,
              drop_debugger: false,
            },
          },
        }),
      ],
      // @NOTE: fix HMR, see - https://stackoverflow.com/a/66197410
      runtimeChunk: isProduction ? undefined : 'single',
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    module: {
      rules: [
        // TypeScript (+tsx)
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
        },
        // CSS, PostCSS, Sass
        {
          test: /\.(scss|css|sass)$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
            'resolve-url-loader', // @IMPORTANT: order is required (https://github.com/bholloway/resolve-url-loader/blob/v5/packages/resolve-url-loader/README.md#configure-webpack)
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true, // required
              },
            },
          ],
        },
        // Images
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: '[name][hash][ext][query]',
          },
        },
        // Fonts
        {
          test: /\.(woff|woff2)$/i,
          type: 'asset/resource',
          generator: {
            filename: '[name][hash][ext][query]',
          },
        },
        // ES6 dependencies transpile -> ES5 (ie11 support)
        isProduction && {
          test: /\.js$/,
          include: (name) => {
            const moduleNames = [
              // modules to transpile with swc
              // '@react-hook\\merged-ref',
            ];

            if (moduleNames.some((moduleName) => name.includes(moduleName))) {
              return true;
            }
            return false;
          },
          use: {
            loader: 'swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'ecmascript',
                },
                target: 'es5',
              },
            },
          },
        },
      ].filter(Boolean),
    },
    plugins: [
      /**
       * Copy static files
       */
      new CopyWebpackPlugin({
        patterns: [{ from: 'public/static', to: './' }],
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        publicPath: PUBLIC_PATH,
        filename: 'index.html',
        templateParameters: {
          urljoin,
          STATIC_PATH,
        },
      }),
      new EnvironmentPlugin({
        NODE_ENV: env.NODE_ENV || 'development',
        BUILT_AT: env.BUILT_AT || '',
        GIT_COMMIT: env.GIT_COMMIT || '',
        GIT_BRANCH: env.GIT_BRANCH || '',
        DEVELOPMENT_IN_PRODUCTION: env.DEVELOPMENT_IN_PRODUCTION || '',
        APP_BASE_URL: env.APP_BASE_URL || '/',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new ModuleFederationPlugin({
        name: APP_REMOTE_NAME,
        filename: 'remoteEntry.js',
        remotes: {
          // add your remotes
        },
        exposes: {
          './App': './src/components/app/App',
        },
        shared: {
          // eslint-disable-next-line quote-props
          react: {
            eager: true,
            singleton: true,
            requiredVersion: package.dependencies.react,
          },
          'react-dom': {
            eager: true,
            singleton: true,
            requiredVersion: package.dependencies['react-dom'],
          },
        },
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      host: env.HOST || 'localhost',
      port: env.PORT || 9000,
      historyApiFallback: true,
      allowedHosts: ['.ngrok.io'], // allow host ngrok
      inline: true,
      hot: true,
    },
  };
};
