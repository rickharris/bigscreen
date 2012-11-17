/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    coffee: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': 'lib/assets/javascripts/bigscreen/*.coffee'
        }
      },
      spec: {
        files: {
          'spec/<%= pkg.name %>_spec.js': 'spec/**/*.coffee'
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
        tasks: 'coffee:dist lint min'
      },
      css: {
        files: 'lib/assets/stylesheets/bigscreen.css.sass',
        tasks: 'compass:dev mincss'
      },
      spec: {
        files: 'spec/**/*.coffee',
        tasks: 'coffee:spec'
      }
    },
    jshint: {
      options: {
        camelcase: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: false,
        boss: true,
        eqnull: true,
        expr: true,
        browser: true
      },
      globals: {}
    },
    uglify: {},
    mocha: {
      all: {
        src: ['spec/runner.html'],
        run: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('spec', 'coffee mocha');
};
