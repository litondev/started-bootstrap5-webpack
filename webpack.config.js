// const webpack = require("webpack");
const path = require("path");
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const mode = process.argv[process.argv.findIndex(arg => arg == "--mode") + 1];

const pagesFolder = __dirname+'/src/pages/';
var hbsPages = [];
var files = fs.readdirSync(pagesFolder);

files.forEach(file => {
    if(!fs.lstatSync(pagesFolder + file).isFile()) return;
    
    if(!path.extname(pagesFolder + file) == ".hbs") return;      

    hbsPages.push(new HtmlWebpackPlugin({
      title: path.parse(pagesFolder + file).name,
      template: "src/pages/"+file,
      filename:  path.parse(pagesFolder + file).name + ".html",
      minify: false
    }));
});

module.exports = {    
   
    entry: {
        main: './src/js/main.js',
    },

    stats: {
        warnings: false,
    },

    performance: {
        hints: false
    },

    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "./dist")
    },

    devtool: "source-map",

    module: {
        rules: [

            {
                test: /\.hbs$/,
                loader: "handlebars-loader",
                options: {
                    inlineRequires: "/assets/",                    
                },
            },

            { 
                test: /\.(jpe?g|png|gif|svg)$/i, 
                use: [{
                    loader: 'file-loader',
                    options: {
                    name: '[path][name].[ext]',
                    esModule: false,
                    }
                  }],
            },

            {
                test: /\/assets\/vendors\//i, 
                use: [{
                    loader: 'file-loader',
                    options: {
                    name: '[path][name].[ext]',
                    esModule: false,
                    }
                  }],
            },

            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",                
                }
            },                    

            {
                test: /\.(scss|.css)$/,
                use: [
                    MiniCssExtractPlugin.loader,                  
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                            sourceMap: true,
                            url: true,
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

        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "[id].css"
        }),    
        ...hbsPages
    ],

    optimization: {
        runtimeChunk: false,
        splitChunks: {
          chunks: 'all',         
          cacheGroups: {            
            styles: {
                name(module){
                    try{
                        let packageName = module._identifier.split("!");                    
                        return path.parse(packageName[packageName.length-1]).name;
                    }catch(e){
                        return module;
                    }
                },
                test: /\.s?css$/,           
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
      
                return `${packageName.replace('@', '')}`;
              },
            },
          },
        },
      }
};
