// const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LayoutWebpackPlugin = require('layout-webpack-html-plugin');

module.exports = {
    mode : 'development',
    
    // Define the entry points of our application (can be multiple for different sections of a website)
    entry: {
        main: './src/js/main.js',
    },
    stats: {warnings:false},
    performance: {
        hints: false
      },
    // Define the destination directory and filenames of compiled resources
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "./dist")
    },

    // Define development options
    devtool: "source-map",

    // Define loaders
    module: {
        rules: [
            // Use babel for JS files
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",                
                }
            },
            
            // CSS, PostCSS, and Sass
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                            sourceMap: true,
                            url: false,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'autoprefixer',
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ],
            },

            {
                test: /\.hbs$/,
                loader: "handlebars-loader",
                options: {
                  inlineRequires: "/images/"
                }
              },
              {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource"
              }
        ],
    },

    // Define used plugins
    plugins: [      
        // Extracts CSS into separate files
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "[id].css"
        }),          

        new HtmlWebpackPlugin({
            title: "Home",
            template: "src/pages/home.hbs",
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            title: "About",
            template: "src/pages/about.hbs",
            filename: "about.html"
        })
    ],

    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
      
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace('@', '')}`;
              },
            },
          },
        },
      }
};