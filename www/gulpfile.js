/* =========================================== */
/*    GULP                                     */
/* =========================================== */

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload');


/* =========================================== */
/*    PATHS                                    */
/* =========================================== */

var paths = {
    js          : 'assets/js/app.js',
    scss        : 'assets/css/app.scss',

    destJS      : 'assets/js/min',
    destCSS     : 'assets/css',

    watchJS     : 'assets/js/*.js',
    watchSCSS   : 'assets/css/*.scss',
    watchHTML   : '*.html',

    watchGreen        : 'assets/themes/green/*.scss',
    themeGreen        : 'assets/themes/green/style.scss',
    destThemeGreen    : 'assets/themes/green',

    watchDarkRed        : 'assets/themes/dark_red/*.scss',
    themeDarkRed        : 'assets/themes/dark_red/style.scss',
    destThemeDarkRed    : 'assets/themes/dark_red'
};


/* =========================================== */
/*    TASKS                                    */
/* =========================================== */

gulp.task('scripts', function () {
    return gulp.src(paths.js)
        .pipe(uglify({
            mangle      : false,
            output      : {
                beautify    : true,
                comments    : true
            }
        }))
        .pipe(gulp.dest(paths.destJS));
});

gulp.task('styles', function () {
    return sass(paths.scss, { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(paths.destCSS));
});

gulp.task('theme-green', function () {
    return sass(paths.themeGreen, { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(paths.destThemeGreen));
});

gulp.task('theme-dark-red', function () {
    return sass(paths.themeDarkRed, { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(paths.destThemeDarkRed));
});


/* =========================================== */
/*    WATCH                                    */
/* =========================================== */

gulp.task('default', function () {
    gulp.watch(paths.watchJS, ['scripts']);
    gulp.watch(paths.watchSCSS, ['styles']);
    gulp.watch(paths.watchGreen, ['theme-green']);
    gulp.watch(paths.watchDarkRed, ['theme-dark-red']);
});