var config = {

  SRC_PATH     : './src',
  DIST_PATH    : './dist',


  ENV          : 'development',


  get SASS_PATH() {
    return [
      this.SRC_PATH + '/styles/gridr.scss',
      this.SRC_PATH + '/styles/normalize.scss',
      this.SRC_PATH + '/styles/style.scss',
    ];
  },
  get SASS_WATCH() {
    return this.SRC_PATH + '/styles/**/*.scss';
  },


  get CSS_PATH() {
    return this.DIST_PATH + '/css';
  },


  get HTML_WATCH() {
    return [
      this.SRC_PATH + '/index.html',
    ];
  },
  get HTML_DIST() {
    return this.DIST_PATH;
  },
};

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    runSequence = require('gulp-run-sequence');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: [
        config.SRC_PATH,
        config.DIST_PATH
      ],
    }
  });
});

gulp.task('sass', function() {
  gulp.src(config.SASS_PATH)
    .pipe(plumber())
    .pipe(sass({
      compass: true,
      lineNumbers: false,
      precision: 6,
      style: (config.ENV === 'development' ? 'nested' : 'compressed')
    }))
    .pipe(autoprefixer(
      'last 2 version',
      '> 1%',
      'ie 8',
      'ie 9',
      'ios 6',
      'android 4'
    ))
    .pipe(gulp.dest(config.CSS_PATH))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', function() {
  return gulp.src(config.HTML_WATCH, { base: config.SRC_PATH })
    .pipe(htmlmin({ removeComments: true, collapseWhitespace: true }))
    .pipe(gulp.dest(config.HTML_DIST));
});

gulp.task('reload', function() {
  browserSync.reload({ once: true });
});

gulp.task('watch', function() {
  gulp.watch(config.HTML_WATCH, ['reload']);
  gulp.watch(config.FONTS_SRC, ['fonts']);
  gulp.watch(config.SASS_WATCH, ['sass']);
});

gulp.task('default', function() {
  runSequence(['sass'], 'browser-sync', 'watch');
});

gulp.task('build', ['sass', 'html']);
