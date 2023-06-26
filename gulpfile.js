'use strict';

const gulp = require('gulp');
const sass = require('gulp-dart-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const insert = require('gulp-file-insert');
const beautify = require('gulp-beautify');

function autoprefix() {
  return gulp
    .src('./css/theme/*.css')
    .pipe(autoprefixer({ cascade: false }))
    .pipe(gulp.dest('./css/theme'));
}

function minifyCSS() {
  return gulp
    .src('./css/optionals/*.css')
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./css/optionals/min'));
}

function userCSS() {
  return gulp
    .src('./css/usercss-template.css')
    .pipe(
      insert({
        '{{theme}}': './css/theme/theme.css',
        '{{dark-knight-theme}}': './css/optionals/min/dark-knight-theme.min.css',
        '{{hide-ads}}': './css/optionals/min/hide-ads.min.css',
        '{{hide-vip}}': './css/optionals/min/hide-vip.min.css',
        '{{hide-watch-now}}': './css/optionals/min/hide-watch-now.min.css',
        '{{last-watched-bg}}': './css/optionals/min/last-watched-bg.min.css',
        '{{custom-bg}}': './css/optionals/min/custom-bg.min.css'
      })
    )
    .pipe(rename('style.user.css'))
    .pipe(
      beautify.css({
        end_with_newline: true,
        indent_size: 2,
        preserve_newlines: true
      })
    )
    .pipe(gulp.dest('./'));
}

function compileSass() {
  return gulp
    .src('./sass/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(gulp.dest('./css/theme'));
}

function watchSass() {
  gulp.watch('./sass/**/*.scss', gulp.series(compileSass, autoprefix, minifyCSS, userCSS));
}

gulp.task('sass:watch', watchSass);

gulp.task('default', gulp.series(watchSass));
