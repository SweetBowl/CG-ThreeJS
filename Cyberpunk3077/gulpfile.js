const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const combiner = require('stream-combiner2').obj;
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const dirExists = require('directory-exists');
const rigger = require('gulp-rigger');


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// convert sass to css and compress to prod
gulp.task('styles', () => gulp.src('scss/style.scss')
  .pipe(plumber({
    errorHandler: notify.onError(err => ({
      title: 'STYLES',
      message: err.message,
    })),
  }))
  .pipe(gulpIf(isDevelopment, sourcemaps.init()))
  .pipe(autoprefixer())
  .pipe(sass())
  .pipe(gulpIf(isDevelopment, sourcemaps.write('.')))
  .pipe(gulpIf(!isDevelopment, combiner(
    cleanCSS(),
    concat('style.min.css'),
  )))
  .pipe(gulp.dest('css')));

// compress js
gulp.task('js', () => gulp.src(['js/*.js', '!js/*.min.js'])
  .pipe(uglify())
// .pipe(concat('all.min.js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('js')));

// create folder for backup images
gulp.task('copy-source-images', (callback) => {
  const imgSource = 'images';
  if (!dirExists.sync(`./${imgSource}`)) {
    return gulp.src('img/**/*.*')
      .pipe(gulp.dest(imgSource));
  }
  callback();
});

// compress img to prod
gulp.task('compress-img', () => gulp.src('img/**/*.{png,jpg,jpeg}')
  .pipe(imagemin())
  .pipe(gulp.dest('img')));

// sass compile
gulp.task('watch', () => {
  gulp.watch('scss/**/*.*', gulp.series('styles'));
});

// auto reload
gulp.task('serve', () => {
  browserSync.init({
    server: '.',
  });

  // browserSync.watch('./**/*.{css,html}').on('change', browserSync.reload);

  browserSync.watch('css/*.css').on('change', browserSync.reload);
  browserSync.watch('js/*.js').on('change', browserSync.reload);
  browserSync.watch('./*.html').on('change', browserSync.reload);
});

// development
gulp.task('dev', gulp.series(
  'styles',
  gulp.parallel('watch', 'serve'),
));

// production
gulp.task('prod', gulp.series(
  'styles',
  'js',
  'copy-source-images',
  'compress-img',
));

// html builder
gulp.task('html:build', function () {
  gulp.src(path.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(connect.reload());
});
