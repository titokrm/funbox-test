    
var gulp          = require('gulp');

var vfs = require('vinyl-fs');
var converter = require('sass-convert');

var del          = require('del');
var fileinclude   = require('gulp-file-include');
var rename        = require('gulp-rename');
var sass          = require('gulp-sass')(require('sass'));
//const sass        = require('gulp-sass')(require('sass'));
var uglify        = require('gulp-uglify-es').default;
var autoprefixer  = require('gulp-autoprefixer');
var sourcemaps    = require('gulp-sourcemaps');
var convertEncoding = require('gulp-convert-encoding');
var group_media = require('gulp-group-css-media-queries');
const gulpPlumber = require('gulp-plumber');
var browserSync   = require('browser-sync').create();
var gulpNotify    = require('gulp-notify');

var sourcesDir = '#sources'; // имя каталога с сырцами проекта
var resultDir  = 'result';   // имя каталога с результатами
var needCompil = true;
//var sourcesDirRepo = pathBegin + domains[numDomain] + path;
    


//var sass.compiler = require('node-sass');

function conv(done) {
  console.log('Start!!!')
  vfs.src('./'+sourcesDir+'/scss/*.scss')
    .pipe(converter({
      from: 'scss',
      to: 'sass',
    }))
    .pipe(vfs.dest('./output'));
  done();
}

function clearDist(done) {
  del.sync(resultDir);
  done();
}

function clearImg(done) {
  del.sync('./dist/images');
  done();
}

function clearFonts(done) {
  del.sync('./dist/fonts');
  done();
}

function clearVendor(done) {
  del.sync('./dist/vendor');
  done();
}

function cssCompil(done) {
  if (needCompil) {
    gulp.src('./'+sourcesDir+'/scss/*.scss')
      //gulp.src('./'+sourcesDir+'/style/style.css')
      .pipe(sourcemaps.init())
      .pipe(gulpPlumber(
        gulpNotify.onError({
          title: 'SCSS',
          message: 'Error: <%= error.message %>'
        }))
      )
      .pipe(sass({
        errorLogToConsole: false,
        //outputStyle: 'compressed'
        outputStyle: 'expanded'
      })
      /*.pipe(                                //если нужно медиазапросы в конце то раскоментировать 
        group_media()
      )*/
      .on('error', sass.logError))
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 4 versions'],
        cascade: false
      }))
      //.pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(resultDir+'/css/'));
      //.pipe(gulp.dest('./'+resultDir+'/style/'));
  }
  done();
}

function syncCss(done) {
  gulp.src(resultDir+'/css/')
    .pipe(browserSync.stream());
  done();
}

function copyImg(done) {
  if (needCompil) {
    gulp.src('./'+sourcesDir+'/images/**/*')
      .pipe(gulp.dest(resultDir+'/images/'));

  }
  done();
}

function copyVideo(done) {
  if (needCompil) {
    gulp.src('./'+sourcesDir+'/video/**/*')
      .pipe(gulp.dest(resultDir+'/video/'));
  }
  done();
}

function copyJs(done) {
  if (needCompil) {
    gulp.src('./'+sourcesDir+'/js/**/*')
  /*    .pipe(sourcemaps.init())
      .pipe(uglify())
      .on('error', console.log)
      //.pipe(rename({suffix: '.min'}))
      .pipe(sourcemaps.write('./'))*/
      .pipe(gulp.dest(resultDir+'/js/'));
  }
  done();
}

function copyCss(done) {
  if (needCompil) {
    gulp.src('./'+sourcesDir+'/css/**/*')
      .pipe(gulp.dest(resultDir+'/css/'));
  }
  done();
}

function copyFonts(done) {
  gulp.src('./'+sourcesDir+'/fonts/**/*')
/*    .pipe(rename(function (path) {
        // делаем имена файлов шрифтов маленькими буквами
        path.basename = path.basename.toLowerCase();
      }))*/
    .pipe(gulp.dest(resultDir+'/fonts/'));
  done();
}

function copyFavicon(done) {
  if (needCompil) {
    gulp.src('./'+sourcesDir+'/*.ico')
      .on('error', console.log)
      .pipe(gulp.dest(resultDir+'/'));
  }
  done();
}

function copyHtml(done) {
  if (needCompil) {
    gulp.src('./'+sourcesDir+'/*.html')
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .on('error', console.log)
      //.pipe(convertEncoding({to: 'windows-1251'}))  // сохранить входящие файлы в utf-8, а потом при необходимости убрать этот комент - и будет выходной в 1251
      .pipe(gulp.dest(resultDir+'/'));
  }
  done();
}

function copyPhp(done) {
  if (needCompil) {
    gulp.src('./'+sourcesDir+'/*.php')
      .pipe(gulpPlumber(
        gulpNotify.onError({
          title: 'HTML',
          message: 'Error: <%= error.message %>'
        }))
      )
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      //.on('error', console.log)
      //.pipe(convertEncoding({to: 'windows-1251'}))  // сохранить входящие файлы в utf-8, а потом при необходимости убрать этот комент - и будет выходной в 1251
      .pipe(gulp.dest(resultDir+'/'));
  }
  done();
}

function sync(done) {
  setTimeout(() => {
    console.log('Запускаем браузер!');
    
	  browserSync.init({
	    notify         : true,
        reloadOnRestart: true,
        server: {
          baseDir: resultDir+'/',
          directory: true, // показывать список файлов
        },
//		proxy: domains[numDomain],
//		port: 3000
	  });
  }, 500);
  done();
}

function browerReload(done) {
  browserSync.reload();
  done();
}

function watchFiles(done) {
  if (needCompil) {
    //gulp.watch('./'+sourcesDir+'/scss/*', gulp.series(cssCompil, syncCss));
    gulp.watch('./'+sourcesDir+'/scss/**/*', gulp.series(cssCompil, syncCss));
    gulp.watch('./'+sourcesDir+'/js/*', gulp.series(copyJs, browerReload));
    gulp.watch('./'+sourcesDir+'/images/**/*', gulp.series(copyImg, browerReload));
    //gulp.watch('./'+sourcesDir+'/fonts/**/*', gulp.series(copyFonts, browerReload));
    gulp.watch('./'+sourcesDir+'/css/**/*', gulp.series(copyCss, browerReload));
    gulp.watch('./'+sourcesDir+'/*+(.htm|.html|.php)', gulp.series(copyHtml, browerReload));
    gulp.watch('./'+sourcesDir+'/includes/*.htm', gulp.series(copyPhp, browerReload));
  }
  else {
    gulp.watch(sourcesDirRepo+'js/*', gulp.series(browerReload));
    gulp.watch(sourcesDirRepo+'images/**/*', gulp.series(browerReload));
    gulp.watch(sourcesDirRepo+'css/**/*', gulp.series(browerReload));
    gulp.watch(sourcesDirRepo+'styles/**/*', gulp.series(browerReload));
    gulp.watch(sourcesDirRepo+'style/**/*', gulp.series(browerReload));
    gulp.watch(sourcesDirRepo+'*+(.htm|.html|.php)', gulp.series(browerReload));
  }
  done();
}

gulp.task('copyFiles', gulp.series(copyHtml, copyCss, copyFonts, copyJs, copyImg, copyVideo, copyFavicon));

gulp.task('run', gulp.parallel(watchFiles, sync));

gulp.task('konv', conv);

gulp.task('clear', clearDist);

gulp.task('default', gulp.series('clear', 'copyFiles', cssCompil, 'run'));
