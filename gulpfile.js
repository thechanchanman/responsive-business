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
  // *** probably this section will be removed later ***
  // all scripts except vendor scripts (usually *.min.js files)
  in : source + '/js/**/*.js',
  out : dest + '/js',
};

const styles = {
  main : source + '/scss/styles.scss',
  in : source + '/scss/**/*.scss',
  out : dest + '/css'
};

const htmlPages = {
  in : dest + '/**/*.html'
};

/********************************************
** Script tasks
********************************************/
gulp.task('scripts', function(){
  gulp.src(scripts.in)
  .pipe(plumber())
  // optional --- initializing sourcemaps
  .pipe(sourcemaps.init())
  // adding .min suffix to file name
  // .pipe(rename({suffix:'.min'}))
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
  gulp.src(styles.in)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({ outputStyle: 'expanded' }))
  .pipe(autoprefixer({browsers: ['last 5 versions']}))
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
  'scripts',
  'sass',
  'html',
  'browser-sync',
  'watch'
]);
