path = require 'path'
module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    coffee:
      src:
        options:
          join: true
        files:
          'compiled/<%= pkg.name %>.js': 'lib/assets/javascripts/bigscreen/**/*.coffee'
      spec:
        options:
          join: true
        files:
          'compiled/<%= pkg.name %>_spec.js': 'spec/**/*.coffee'
    jst:
      compile:
        options:
          processName: (filename) ->
            dir = path.dirname(filename).replace "lib/assets/javascripts/", ""
            basename = path.basename filename, ".jst.ejs"
            path.join dir, basename
        files:
          'compiled/<%= pkg.name %>_templates.js': 'lib/assets/javascripts/bigscreen/templates/*.jst.ejs'
    concat:
      dist:
        src: [
          'node_modules/lodash/lodash.js',
          'compiled/<%= pkg.name %>.js',
          'compiled/<%= pkg.name %>_templates.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
    uglify:
      dist:
        files:
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
    compass:
      compile:
        options:
          sassDir: 'lib/assets/stylesheets'
          cssDir: 'dist'
          noLineComments: true
    cssmin:
      compress:
        files:
          'dist/<%= pkg.name %>.min.css': 'dist/<%= pkg.name %>.css'
    watch:
      js:
        files: 'lib/assets/javascripts/bigscreen/**/*.coffee'
        tasks: 'coffee:src'
      jst:
        files: "lib/assets/javascripts/bigscreen/templates/*.jst.ejs"
        tasks: 'jst'
      concat:
        files: 'compiled/{bigscreen,bigscreen_templates}.js'
        tasks: 'concat'
      uglify:
        files: 'dist/<%= pkg.name %>.js'
        tasks: 'uglify'
      cssmin:
        files: 'lib/assets/stylesheets/bigscreen.css.sass'
        tasks: ['compass:compile', 'cssmin']
      spec:
        files: 'spec/**/*.coffee'
        tasks: 'coffee:spec'
    connect:
      server:
        options:
          port: 9000

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jst'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-compass'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'

  grunt.registerTask 'default', ['connect', 'watch']
