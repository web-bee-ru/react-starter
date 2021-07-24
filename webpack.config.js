/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const urljoin = require('url-join');

const webpack = require('webpack');

require('dotenv').config();

module.exports = (env, argv) => {
  const PUBLIC_PATH = env.PUBLIC_PATH || '/';
  const STATIC_PATH = PUBLIC_PATH;

  return {
    mode: argv.mode || env.NODE_ENV || 'none',
    target: ['web', 'es5'],
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
    optimization: {
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
            'style-loader',
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
        },
        // Fonts
        {
          test: /\.(woff|woff2)$/i,
          type: 'asset/resource',
        },
        // Support @d11t/ui/lib/styles .cur imports
        {
          test: /\.(cur)$/i,
          type: 'asset/resource',
        },
        // ES6 dependencies transpile -> ES5 (ie11 support)
        {
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
      ],
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
      new webpack.EnvironmentPlugin({
        NODE_ENV: env.NODE_ENV || 'development',
        BUILT_AT: env.BUILT_AT || '',
        GIT_COMMIT: env.GIT_COMMIT || '',
        GIT_BRANCH: env.GIT_BRANCH || '',
        DEVELOPMENT_IN_PRODUCTION: env.DEVELOPMENT_IN_PRODUCTION || '',
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      host: env.HOST || 'localhost',
      port: env.PORT || 9000,
      historyApiFallback: true,
      allowedHosts: ['.ngrok.io'], // allow host ngrok
    },
  };
};
