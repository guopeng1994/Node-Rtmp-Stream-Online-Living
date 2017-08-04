// Generated by CoffeeScript 1.12.4
(function() {
  var Bits, StreamServer, config, logger, streamServer, url;

  url = require('url');

  config = require('./config');

  StreamServer = require('./stream_server');

  Bits = require('./bits');

  logger = require('./logger');

  Bits.set_warning_fatal(true);

  logger.setLevel(logger.LEVEL_INFO);

  streamServer = new StreamServer;

  if (config.recordedDir != null) {
    streamServer.attachRecordedDir(config.recordedDir);
  }

  process.on('SIGINT', (function(_this) {
    return function() {
      //console.log('获取信号源成功!');
      return streamServer.stop(function() {
        return process.kill(process.pid, 'SIGTERM');
      });
    };
  })(this));

  process.on('uncaughtException', function(err) {
    streamServer.stop();
    throw err;
  });

  streamServer.start();

}).call(this);