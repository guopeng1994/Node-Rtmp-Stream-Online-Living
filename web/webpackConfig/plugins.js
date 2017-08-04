var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var cssBundle = path.join('css','cssBundle.css');



var plugins = [
    new CopyWebpackPlugin([
        {
            from :'./node_modules/react/dist/react-with-addons.min.js',
            to :'js/react-with-addons.min.js'
        },
        {
            from :'./node_modules/react-dom/dist/react-dom.min.js',
            to :'js/react-dom.min.js'
        },
        {
            from : './node_modules/react-router/umd/ReactRouter.min.js',
            to : 'js/react-router.min.js'
        },
        {
            from : './node_modules/react-router-redux/dist/ReactRouterRedux.min.js',
            to : 'js/react-router-redux.min.js'
        }, {
            from : './node_modules/redux/dist/redux.min.js',
            to : 'js/redux.min.js'
        }, {
            from : './node_modules/react-redux/dist/react-redux.min.js',
            to : 'js/react-redux.min.js'
        },
        {
            from : './node_modules/redux-thunk/dist/redux-thunk.min.js',
            to : 'js/redux-thunk.min.js'
        },
        {
            from :'./node_modules/antd/dist/antd.min.js',
            to :'js/antd.min.js'
        },
        {
            from :'./node_modules/antd/dist/antd.min.css',
            to :'css/antd.min.css'
        },
        {
            from :'./node_modules/jquery/dist/jquery.min.js',
            to :'js/jquery.min.js'
        },
        {
            from :'./node_modules/socket.io-client/dist/socket.io.min.js',
            to :'js/socket.io.min.js'
        },
        {
            from :'./web/src/static/img',
            to :'img'
         },//ckplayer
         {
            from :'./web/src/static/ckplayer',
            to :'ckplayer'
         },{
            from :'./web/src/static/fonts',
            to :'fonts'
         },
    ])
    ,
    new webpack.ProvidePlugin({
        $:'jquery',
        jquery:'jquery',
    }),
    new ExtractTextPlugin(cssBundle, {//分离CSS和JS文件
        allChunks : true
    }),
    new webpack.optimize.OccurenceOrderPlugin(),//为组件分配ID
    new webpack.HotModuleReplacementPlugin(),//dev
    new webpack.optimize.UglifyJsPlugin({//压缩jsbundle
        output:{
            comments:false
        },
        compress:{
            warnings:false
        }
    }),//压缩JS(包括bundle)代码
    new webpack.optimize.DedupePlugin()
    ,//查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
    new webpack.DefinePlugin({//定义jsbundle为产品模式，这样在控制台就不会有警告react的模式信息
        'process.env' : {
            NODE_ENV : JSON.stringify('production')
        }
    })
    // ,
    // new webpack.NoErrorsPlugin()
];

module.exports = plugins;

