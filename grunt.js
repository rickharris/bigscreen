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
    compass: {
      dev: {
        src: 'lib/assets/stylesheets',
        specify: 'lib/assets/stylesheets/<%= pkg.name %>.css.sass',
        dest: 'dist',
        linecomments: false,
        forcecompile: false,
        debugsass: false,
        relativeassets: true
      }
    },
    mincss: {
      compress: {
        files: {
          'dist/<%= pkg.name %>.min.css': 'dist/<%= pkg.name %>.css'
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
      js: {
        files: 'lib/assets/javascripts/bigscreen/*.coffee',
        tasks: 'coffee lint min'
      },
      css: {
        files: 'lib/assets/stylesheets/bigscreen.css.sass',
        tasks: 'compass:dev mincss'
      }
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
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-contrib-mincss');

};
