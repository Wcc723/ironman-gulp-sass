var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('autoprefixer'),
  plumber = require('gulp-plumber'),
  postcss = require('gulp-postcss');

var async = require('async'),
  iconfont = require('gulp-iconfont'),
  consolidate = require('gulp-consolidate');

var webserver = require('gulp-webserver');

var path = {
  source: './source/',
  public: './public/',
  bower: './bower_components/'
}

gulp.task('sass', function () {
  var processors = [
      autoprefixer({browsers: ['last 5 version']})
  ];
  return gulp.src(path.source + 'scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass(
      {outputStyle: 'expanded',
      includePaths: [path.bower + 'bootstrap-sass/assets/stylesheets']}
    ).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(path.public + 'stylesheets'));
});

// icon fonts
gulp.task('iconfonts', function(done){
  var iconStream = gulp.src([path.source + 'icons/*.svg'])
    .pipe(iconfont({ fontName: 'icon' }));

  async.parallel([
    function handleGlyphs (cb) {
      iconStream.on('glyphs', function(glyphs, options) {
        gulp.src(path.source + 'css_template/iconfonts.css')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'icon',
            fontPath: '../fonts/',
            className: 'all-my-class'
          }))
          .pipe(gulp.dest(path.public + 'stylesheets'))
          .on('finish', cb);
      });
    },
    function handleFonts (cb) {
      iconStream
        .pipe(gulp.dest(path.public + 'fonts/'))
        .on('finish', cb);
    }
  ], done);
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

gulp.task('watch', function () {
  gulp.watch(path.source + 'scss/**/*.scss', ['sass']);
  gulp.watch(path.source + 'icons/*.svg', ['iconfonts']);
  gulp.watch(objs, ['others']);
});

// webserver
gulp.task('webserver', function() {
  setTimeout(function(){
    gulp.src(path.public)
      .pipe(webserver({
        livereload: true,
        open: false,
        host: '0.0.0.0',
        port: 10000,
      }));
  }, 1000);
});

gulp.task('default', ['others', 'sass', 'iconfonts', 'watch', 'webserver']);
