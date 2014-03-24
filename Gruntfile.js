var path = require("path");

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      src: {
        files: {
          'compiled/bigscreen.js': 'lib/assets/javascripts/bigscreen/**/*.coffee'
        },
        options: {
          bare: true
        }
      }
    },
    eco: {
      compile: {
        options: {
          basePath: 'lib/assets/javascripts'
        },
        files: {
          'compiled/bigscreen_templates.js':
            'lib/assets/javascripts/bigscreen/templates/**/*.eco'
        }
      }
    },
    concat: {
      dist: {
        src: ['compiled/bigscreen.js', 'compiled/bigscreen_templates.js'],
        dest: 'dist/bigscreen.js'
      }
    },
    clean: {
      compiled: 'compiled'
    },
    uglify: {
      dist: {
        files: {
          'dist/bigscreen.min.js': 'dist/bigscreen.js'
        }
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: 'lib/assets/stylesheets',
          specify: 'lib/assets/stylesheets/bigscreen.css.sass',
          cssDir: 'dist',
          noLineComments: true,
          force: false,
          debugInfo: false,
          relativeAssets: true
        }
      }
    },
    cssmin: {
      compress: {
        files: {
          'dist/bigscreen.min.css': 'dist/bigscreen.css'
        }
      }
    },
    watch: {
      js: {
        files: [
          'lib/assets/javascripts/bigscreen/**/*.coffee',
          'lib/assets/javascripts/bigscreen/templates/*.eco'
        ],
        tasks: ['coffee:src', 'eco', 'concat', 'uglify', 'karma:unit:run']
      },
      spec: {
        files: ['spec/bigscreen/**/*_spec.coffee'],
        tasks: ['karma:unit:run']
      },
      css: {
        files: 'lib/assets/stylesheets/bigscreen.css.sass',
        tasks: ['compass:dev', 'cssmin']
      }
    },
    connect: {
      server: {
        options: {
          port: 9001
        }
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        autoWatch: false,
      },
      unit: {
        background: true
      },
      continuous: {
        autoWatch: false,
        singleRun: true,
        browsers: [
          'sl_chrome',
          'sl_firefox',
          'sl_opera',
          'sl_safari',
          'sl_ie_10',
          'sl_ie_11'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-eco');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('compile', ['clean', 'coffee', 'eco', 'concat', 'uglify',
                     'compass', 'cssmin']);
  grunt.registerTask('default', ['compile', 'karma:unit', 'connect', 'watch']);
};
