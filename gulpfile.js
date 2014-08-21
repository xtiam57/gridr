var config = {
  // Base Paths
  SRC_PATH     : './src',
  DIST_PATH    : './dist',

  // General Settings
  ENV          : 'development',                             // Options: development | production

  // SASS Settings
  get SASS_PATH() {
    return [
      this.SRC_PATH + '/styles/sass/gridr.scss',            // Custom styles
      this.SRC_PATH + '/styles/sass/vendors.scss',          // Vendor's styles (e.g. bootstrap, font-awesome, foundation, etc.)
    ];
  },
  get SASS_WATCH() {
    return this.SRC_PATH + '/styles/sass/**/*.scss';        // We are going to watch all *.scss files to compile
  },

  // CSS Settings
  get CSS_PATH() {
    return this.DIST_PATH + '/css';                         // The folder for all compiled CSS
  },

  // HTML Settings
  get HTML_WATCH() {
    return [
      this.SRC_PATH + '/index.html',                        // Watch the main index.html
    ];
  },
  get HTML_DIST() {
    return this.DIST_PATH;                                  // When build task is excecuted we put all minifyed HTML here
  },

  // Fonts Settings
  get FONTS_SRC() {
    return this.SRC_PATH + '/assets/fonts/*';
  },
  get FONTS_DIST() {
    return this.DIST_PATH + '/fonts/';                      // All fonts in distribution folder
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
    .pipe(sass({ compass: true, lineNumbers: true }))
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

gulp.task('fonts', function() {
  return gulp.src(config.FONTS_SRC)
    .pipe(gulp.dest(config.FONTS_DIST))
    .pipe(browserSync.reload({ stream: true, once: true }));
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
  runSequence(['sass', 'fonts'], 'browser-sync', 'watch');
});

gulp.task('build', ['sass', 'fonts', 'html']);
