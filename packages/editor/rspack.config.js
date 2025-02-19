const path = require('path')
const fs = require('fs')

const rspack = require('@rspack/core')
const ReactRefreshWebpackPlugin = require('@rspack/plugin-react-refresh')

if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true })
}
process.env.TARO_ENV = 'h5'
process.env.TARO_PLATFORM = 'web'
process.env.EDITOR = true
const isProd = process.env.NODE_ENV === 'production'
console.log('isProd', isProd)
/*
 * @type {import('@rspack/cli').Configuration}
 */
const config = {
  // cache: false,
  mode: isProd ? "production" : "development",
  entry: {
    main: './src/index.tsx', // 配置项目入口文件
  },
  devServer: {
    allowedHosts: 'all',
    client: {
      overlay: false,
    },
  },
  output: {
    assetModuleFilename: './assets/[hash][ext][query]',
    filename: '[contenthash].js',
    cssFilename: '[contenthash].css',
  },
  resolve: {
    extensions: ['.js', '.json', '.wasm', '.tsx', '.ts', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tarojs/components$': '@tarojs/components/lib/react',
      // '@tarojs/components$': '@tarojs/components-react',
      '@tarojs/taro': '@tarojs/taro-h5',
    },
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
      templateParameters: {
        process: JSON.stringify({
          env: process.env,
        }),
      },
      publicPath: './',
    }),
    new rspack.DefinePlugin({
      process: {
        env: process.env,
      },
    }),
  ],
  devtool: process.env.GENERATE_SOURCEMAP === 'true' ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            // nutui以375px来设计 但PC页面编辑器是750px 对nutui做px转rem来兼容
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-plugin-px2rem',
                    {
                      rootValue: 37.5,
                      exclude: /^(?!.*nutui)/,
                    },
                  ],
                ],
              },
            },
          },
        ],
        type: 'css/auto', // 如果你需要将 '*.module.css' 视为 CSS Module 那么将 'type' 设置为 'css/auto' 否则设置为 'css'
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: 'sass-loader',
          },
        ],
        type: 'css/auto',
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'less-loader',
          },
        ],
        type: 'css/auto', // 如果你需要将 '*.module.less' 视为 CSS Module 那么将 'type' 设置为 'css/auto' 否则设置为 'css'
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /taro-h5[\\/]dist[\\/]index/,
        loader: require.resolve(
          '@tarojs/plugin-framework-react/dist/api-loader.js'
        ),
      },
      {
        test: /\.(j|t)sx?$/,
        loader: 'builtin:swc-loader',
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: 'typescript',
            },
            transform: {
              react: {
                runtime: 'automatic',
                development: !isProd,
                refresh: !isProd,
              },
            },
          },
          env: {
            mode: 'entry',
            coreJs: '3',
            skip: ['core-js/modules/_ie8-dom-define'],
          },
        }
      },
      {
        test: /\.(ttf|otf|eot|svg)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
        type: 'asset',
      },
    ],
  },
  optimization: {
    minimize: false // Disabling minification because it takes too long on CI
  },
}

if (!isProd) {
  config.plugins.push(new ReactRefreshWebpackPlugin({
    forceEnable: true
  }))
}

module.exports = config
