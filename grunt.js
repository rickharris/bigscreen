var path = require("path");

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: '<json:package.json>',
    coffee: {
      src: {
        files: {
          'compiled/<%= pkg.name %>.js': 'lib/assets/javascripts/bigscreen/**/*.coffee'
        },
        options: {
          bare: true
        }
      },
      spec: {
        files: {
          'compiled/<%= pkg.name %>_spec.js': 'spec/**/*.coffee'
        }
      }
    },
    jst: {
      compile: {
        options: {
          processName: function(filename) {
            var dir = path.dirname(filename).replace("lib/assets/javascripts/", "");
            var basename = path.basename(filename, ".jst.ejs");
            return path.join(dir, basename);
          }
        },
        files: {
          'compiled/<%= pkg.name %>_templates.js': 'lib/assets/javascripts/bigscreen/templates/*.jst.ejs'
        }
      }
    },
    lint: {
      files: ['grunt.js', 'compiled/<%= pkg.name %>.js']
    },
    concat: {
      dist: {
        src: ['compiled/<%= pkg.name %>.js', 'compiled/<%= pkg.name %>_templates.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
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
    watch: {
      coffee: {
        files: 'lib/assets/javascripts/bigscreen/**/*.coffee',
        tasks: 'coffee:src lint'
      },
      jst: {
        files: 'lib/assets/javascripts/bigscreen/templates/*.jst.ejs',
        tasks: 'jst'
      },
      concat: {
        files: 'compiled/{bigscreen,bigscreen_templates}.js',
        tasks: 'concat'
      },
      min: {
        files: 'dist/<%= pkg.name %>.js',
        tasks: 'min'
      },
      mincss: {
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
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadTasks("./tasks");

};
