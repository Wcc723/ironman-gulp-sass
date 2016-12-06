var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');

gulp.task('sass', function () {
  var processors = [
      autoprefixer({browsers: ['last 5 version']})
  ];
  return gulp.src('./source/scss/**/*.scss')
    .pipe(sass(
      {outputStyle: 'expanded'}
    ).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});
