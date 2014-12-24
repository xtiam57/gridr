var ENV = 'DEVELOPMENT',
    PREPROCESSOR = 'less';

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    gulpif = require('gulp-if'),
    less = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    newer = require('gulp-newer'),
    plumber = require('gulp-plumber'),
    reload = browserSync.reload,
    runSequence = require('gulp-run-sequence'),
    sass = require('gulp-ruby-sass');

// Connects with a local server (development)
gulp.task('connect', function() {
  browserSync({
    port: 7070,
    server: {
      baseDir: ['src', 'dist'],
    },
  });
});

// Compiles, auto-prefixes and minifies all .less files
gulp.task('less', function() {
  // NOTE: if I return the stream, when there is an error, everything breaks
  gulp.src('src/styles/less/{normalize,gridr,style}.less')
    .pipe(plumber())
    .pipe(newer('dist/css'))
    .pipe(less())
    .pipe(autoprefixer(
      'last 2 version',
      '> 1%',
      'ie 8',
      'ie 9',
      'ios 6',
      'android 4'
    ))
    .pipe(gulpif(ENV !== 'DEVELOPMENT', minifyCSS({ keepBreaks: true, keepSpecialComments: 0 })))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({ stream: true }));
});

gulp.task('sass', function() {
  return gulp.src('src/styles/sass/{normalize,gridr,style}.scss')
    .pipe(plumber())
    .pipe(newer('dist/css'))
    .pipe(sass({
      compass: true,
      lineNumbers: true,
      precision: 6,
      style: ENV === 'DEVELOPMENT' ? 'nested' : 'compressed'
    }))
    .pipe(autoprefixer(
      'last 2 version',
      '> 1%',
      'ie 8',
      'ie 9',
      'ios 6',
      'android 4'
    ))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({ stream: true }));
});

// Build task (for production only)
gulp.task('build', function () {
  ENV = 'PRODUCTION';
  runSequence(PREPROCESSOR);
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], reload);
  gulp.watch(['src/**/*.css'], reload);
  gulp.watch(['src/**/*.html'], reload);
  gulp.watch(['src/**/*.{png,jpg}'], reload);

  if (PREPROCESSOR === 'less')
    gulp.watch(['src/styles/less/**/*.less'], ['less']);
  else
    gulp.watch(['src/styles/sass/**/*.scss'], ['sass']);
});

// Build and serves
gulp.task('default', function () {
  runSequence(PREPROCESSOR, 'connect', 'watch');
});


