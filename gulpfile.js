const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');

gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "dist" //запускаем сервер из папки с чистыми файлами
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {                                          //компилируем все файлы на scss/sass
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist/css"))         //скомпилированный код складываем в dist
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {                  //следим за изменениями в определенных файлах: если что-то будет изменено, перезапустится задача "styles"
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    gulp.watch("src/*.html").on('change', gulp.parallel('html'));
});

gulp.task('html', function () {
    return gulp.src("src/*.html")  //получаем любой html-файл, который есть в папке src
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function () {
    return gulp.src("src/js/**/*.js")  //**-берем данные абсолютно из любой папки 
        .pipe(gulp.dest('dist/js'));
});

gulp.task('fonts', function () {
    return gulp.src("src/fonts/**/*")  //**-берем данные абсолютно из любой папки 
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('icons', function () {
    return gulp.src("src/icons/**/*")  //**-берем данные абсолютно из любой папки 
        .pipe(gulp.dest('dist/icons'));
});

gulp.task('images', function () {
    return gulp.src("src/img/**/*")  
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});


gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'scripts', 'fonts', 'icons', 'html', 'images'));