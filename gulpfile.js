/********************************************
** Required
********************************************/
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');


/********************************************
** Paths
********************************************/
const dest = 'public';
const source = 'src';

const scripts = {
  foundation : [
    'components/foundation/js/vendor/jquery.js',
    'components/foundation/js/foundation/foundation.js',
    'components/foundation/js/foundation/foundation.topbar.js',
    'components/foundation/js/foundation/foundation.orbit.js'
  ],
  in : source + '/js/**/*.js',
  out : dest + '/js',
};

const styles = {
  main : [source + '/scss/**/*.scss', '!' + source + '/scss/**/_*.scss'],
  in : source + '/scss/**/*.scss',
  out : dest + '/css'
};

const htmlPages = {
  in : dest + '/**/*.html'
};

/********************************************
** Script tasks
********************************************/
gulp.task('foundation-js', function(){
  gulp.src(scripts.foundation)
  .pipe(plumber())
  .pipe(concat('foundation.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(scripts.out))
  .pipe(browserSync.reload({ stream:true }));
});

gulp.task('scripts', function(){
  gulp.src(scripts.in)
  .pipe(plumber())
  // optional --- initializing sourcemaps
  .pipe(sourcemaps.init())
  // minify
  .pipe(concat('main.js'))
  .pipe(uglify())
  // optional --- writing sourcemaps
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(scripts.out))
  .pipe(browserSync.reload({ stream:true }));
});

/********************************************
** Compass / Sass tasks
********************************************/
gulp.task('sass', function(){
  gulp.src(styles.main)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'expanded' }))
  .pipe(autoprefixer({browsers: ['last 5 version', 'safari 5', 'ie 6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(styles.out))
  .pipe(browserSync.reload({ stream:true }));
});

/********************************************
** HTML tasks
********************************************/
gulp.task('html', function(){
  gulp.src(htmlPages.in)
  .pipe(browserSync.reload({ stream:true }));
});

/********************************************
** Browser-Sync tasks
********************************************/
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: dest
    }
  });
});

/********************************************
** Watch tasks
********************************************/
gulp.task('watch', function(){
  // watch for changes on js files
  gulp.watch(scripts.in, ['scripts']);

  // watch for changes on scss files
  gulp.watch(styles.in, ['sass']);

  // watch for changes on html files
  gulp.watch(htmlPages.in, ['html']);
});

/********************************************
** Default task
********************************************/
// *** use browser-sync for serving html pages
// or php for php pages
//*** use webpack or scripts for javascript files
gulp.task('default', [
  'foundation-js',
  'scripts',
  'sass',
  'html',
  'browser-sync',
  'watch'
]);
