/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    coffee: {
      compile: {
        files: {
          'dist/<%= pkg.name %>.js': 'lib/assets/javascripts/bigscreen/*.coffee'
        }
      }
    },
    lint: {
      files: ['grunt.js', 'dist/<%= pkg.name %>.js']
    },
    min: {
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: 'lib/assets/javascripts/bigscreen/*.coffee',
      tasks: 'coffee lint min'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {}
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');

};
