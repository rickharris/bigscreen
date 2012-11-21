// Ganked and modified from Yeoman

var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  http = require('http'),
  events = require('events'),
  connect = require('connect')

module.exports = function(grunt) {

  // Tasks & Helpers
  // ===============

  // Retain grunt's built-in server task.
  grunt.renameTask('server', 'grunt-server');

  // Server
  // ------

  // Note: yeoman-server alone will exit prematurly unless `this.async()` is
  // called. The task is designed to work alongside the `watch` task.
  grunt.registerTask('server', 'Launch a preview, LiveReload compatible server', function(target) {
    var opts;
    // Get values from config, or use defaults.
    var port = grunt.config('server.port') || 0xDAD;

    // async task, call it (or not if you wish to use this task standalone)
    var cb = this.async();

    opts = {
      port: port,
      hostname: grunt.config('server.hostname') || 'localhost'
    };

    grunt.task.run('coffee jst lint concat min compass mincss')
    grunt.helper('server', opts, cb);
    grunt.task.run('watch');
  });

  grunt.registerHelper('server', function(opts, cb) {
    cb = cb || function() {};

    var middleware = [];

    // Serve static files.
    middleware.push(connect.static(path.resolve(".")));
   // Make empty directories browsable.
    middleware.push(connect.directory(path.resolve(".")));

    return connect.apply(null, middleware)
      .on('error', function( err ) {
        if ( err.code === 'EADDRINUSE' ) {
          return this.listen(0); // 0 means random port
        }

        // not an EADDRINUSE error, buble up the error
        cb(err);
      })
      .listen(opts.port, function() {
        var port = this.address().port;

        // Start server.
        grunt.log
          .subhead( 'Starting static web server on port '.yellow + String( port ).red )
          .writeln( '  - ' + path.resolve(opts.base) )
          .writeln('I\'ll also watch your files for changes and recompile if neccessary.')
          .writeln('Hit Ctrl+C to quit.');

        cb(null, port);
      });
  });
};
