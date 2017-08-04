//前端代码开发服务器webpack-dev-server

var util = require('util');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var pkg = require('../package.json');

var config = require('./webpackConfig/config');

var port = pkg.config.devPort;
var host = pkg.config.devHost;

var server = new WebpackDevServer(
    webpack(config),
    config.devServer
);

server.listen(port,host,function (err) {
    if(err)
        console.log(err);
    var url = util.format('http://%s:%d',host,port);
    console.log('client Listening at %s',url);
});