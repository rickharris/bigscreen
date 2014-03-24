var gulp     = require('gulp');
var coffee   = require('gulp-coffee');
var eco      = require('gulp-eco');
var concat   = require('gulp-concat');
var gulpif   = require('gulp-if');
var uglify   = require('gulp-uglify');
var compass  = require('gulp-compass');
var rename   = require('gulp-rename');
var csso     = require('gulp-csso');
var http     = require('http');
var ecstatic = require('ecstatic');

var paths = {
  scripts: [
    "lib/assets/javascripts/bigscreen/**/*.coffee",
    "lib/assets/javascripts/**/*.eco"
  ],
  stylesheets: 'lib/assets/stylesheets/bigscreen.sass'
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(gulpif(/[.]coffee$/, coffee({bare: true})))
    .pipe(gulpif(/[.]eco/, eco({basePath: 'lib/assets/javascripts'})))
    .pipe(concat("bigscreen.js"))
    .pipe(gulp.dest("dist"))
    .pipe(uglify())
    .pipe(rename('bigscreen.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('stylesheets', function() {
  return gulp.src(paths.stylesheets)
    .pipe(compass({
      css: 'dist',
      sass: 'lib/assets/stylesheets'
    }))
    .pipe(rename('bigscreen.css'))
    .pipe(gulp.dest('dist'))
    .pipe(csso())
    .pipe(rename('bigscreen.min.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.stylesheets, ['stylesheets']);
});

gulp.task('server', function() {
  http.createServer(
    ecstatic({ root: __dirname })
  ).listen(8080);

  console.log('Listening on :8080');
});

gulp.task('default', ['scripts', 'stylesheets', 'server', 'watch']);
