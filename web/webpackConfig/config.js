var path = require('path');
var util = require('util');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var pkg = require('../../package.json');
var plugins = require('./plugins');

var jsBundle =  path.join('js','jsBundle.js');


var config = {
    context : './',
    target:'web',
    devtool:'inline-source-map',
    //devtool:false,
    entry:[
        //'webpack-dev-server/client?http://localhost:3000/',
        //'webpack/hot/only-dev-server',
        path.resolve(__dirname,'../src/index.jsx')
    ],
    externals : {
        'react' : 'React',
        'react-dom' : 'ReactDOM',
        'react-router' : 'ReactRouter',
        'react-router-redux' : 'ReactRouterRedux',
        'redux' : 'Redux',
        'react-redux' : 'ReactRedux',
        'redux-thunk' : 'ReduxThunk',
        'antd' : 'antd'
    },
    output:{
        path : path.resolve(pkg.config.buildDir),
        publicPath:'/',
        filename:jsBundle,
        pathinfo : false
    },
    module:{
        loaders:[
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react','stage-0'],
                    plugins: ['transform-decorators-legacy']
                },
                ignore:[
                    "jquery.js",
                    "jquery.min.js",
                ]
            },
            {
                test:/\.html$/,
                loaders:['html']
            },
            {
                test: /\.json$/,
                exclude: /node_modules/,
                loaders: ["json-loader"]
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg$|\.woff$|\.ttf$/,
                loader:['file-loader?name=[path][name].[ext]']
            },
            {
                test:/\.scss$/,
                loader:ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader!sass-loader')
            },
            {
                test:/\.css$/,
                loader:ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader')
            }
        ]
    },
    postcss:[autoprefixer],
    plugins:plugins
    ,
    resolve:{
        alias:{
            // "superagernt" : path.join(__dirname,'../node_modules/superagent')
        },
        extensions : ['', '.js','.jsx','.json']
    }
    ,
    devServer : {
        noInfo : false,
        stats : {
            colors : true
        },
        contentBase:"web/src/",
        historyApiFallback:true,
        hot:true,
        inline:true,
        progress:true
        ,
        proxy : {//ajax请求的服务器地址配置
            '/api/*' : {
                target : pkg.config.devProxy,
                secure : false
            }
        }
    }
}

module.exports = config;