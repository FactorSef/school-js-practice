const gulp = require('gulp');
const sass = require('sass');
const gulpSass = require('gulp-sass');
const babel = require('gulp-babel');
const gulpConcat = require('gulp-concat');

const scssCompiler = gulpSass(sass);

gulp.task('js', () => {
    return gulp.src('./src/**/*.js')
        .pipe(babel({
            presets: ['@babel/env'],
        }))
        .pipe(gulpConcat('index.js'))
        .pipe(gulp.dest('./dest/js'));
})

gulp.task('styles', () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(scssCompiler().on('error', scssCompiler.logError))
        .pipe(gulp.dest('./dest/css'))
})

gulp.task('watch', () => {
    return gulp.watch('./src/**/*', gulp.series('styles', 'js'))
});