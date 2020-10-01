const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const src = path.join(__dirname, './src');

module.exports = (env, { mode }) => {
  return {
    entry: [
      'regenerator-runtime/runtime',
      './src/index.js'
    ],
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(src, 'index.html'),
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/assets/favicons/*', flatten: true },
        ]
      }),
    ],
    module: {    
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' },
            { loader: 'eslint-loader' },
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            { loader: 'file-loader' },
          ],
        },
        {
          test: /\.(css)$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
          ],
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        
      }
    },
    devServer: {
      port: 8080,
      historyApiFallback: true,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      }
    },
    devtool: mode === 'production' ? false : 'source-map',
  };
};
