var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('autoprefixer'),
  plumber = require('gulp-plumber'),
  postcss = require('gulp-postcss');

var path = {
  source: './source/',
  public: './public/'
}

gulp.task('sass', function () {
  var processors = [
      autoprefixer({browsers: ['last 5 version']})
  ];
  return gulp.src(path.source + 'scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass(
      {outputStyle: 'expanded'}
    ).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(path.public + 'stylesheets'));
});

// 其它不編譯的物件
var objs = ['./source/**/**.*'];
var others = [
    '**/*.scss',
    '**/*.sass',];
for (var i = 0; i < others.length; i++) {
  objs.push('!' + path.source + others[i]);
}
gulp.task('others', function(){
  return gulp.src(objs)
    .pipe(plumber())
    .pipe(gulp.dest(path.public));
});
// watch(objs, function() {
//   gulp.start('others');
// });

gulp.task('watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch(objs, ['others']);
});

gulp.task('default', ['others', 'sass', 'watch']);
