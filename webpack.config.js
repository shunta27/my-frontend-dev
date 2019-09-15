const path = require('path')
const globule = require('globule')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const pugDocuments = globule.find(
  './src/pug/**/*.pug', {
    ignore: [
      './src/pug/**/_*/*.pug'
    ]
  }
)

const htmlPluginConfig = pugDocuments.map(pugFileName => {
  const fileName = pugFileName.replace('./src/pug/', '').replace('.pug', '.html')
  return new HtmlWebpackPlugin({
    filename: `${fileName}`,
    template: pugFileName,
  })
})

module.exports = ( env, argv ) => ({

  entry: {
    main: [path.resolve(__dirname, './src/javascripts/entry.js')]
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].js'
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: argv.mode !== 'production' ? {
            pretty: true
            } : {}
          }
        ]
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'sass-loader'
        ]
      }
    ]
  },

  optimization: {
    minimizer: [
      new TerserPlugin({}),
      new OptimizeCssAssetsPlugin({})
    ]
  },

  devtool: 'inline-source-map',

  plugins: [
    new CleanWebpackPlugin(
      {
        exclude: ['img']
      }
    ),
    new MiniCssExtractPlugin({
      filename: 'css/style.css'
    }),
    ...htmlPluginConfig
  ],

  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    watchContentBase: true,
    port: 3000
  }
})
