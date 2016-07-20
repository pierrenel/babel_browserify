var gulp = require('gulp'),
		fs = require("fs"),
		browserify = require("browserify"),
    browserSync = require('browser-sync').create(),
		babelify = require("babelify"),
		source = require('vinyl-source-stream'),
		gutil = require('gulp-util'),
		sass = require('gulp-sass'),
  	concat = require('gulp-concat'),
  	prefix = require('gulp-autoprefixer'),
  	minify = require('gulp-minify-css');

/* Browsersync */
gulp.task('serve', ['styles'], function() {
    browserSync.init({
        server: "./public/"
    });
    gulp.watch(['./*.html'],['templates']);
    gulp.watch(['./app/**/*.js'],['es6']);
    gulp.watch(['./app/scss/*.scss','!./scss/ie8.scss','!./scss/ie9.scss'], ['styles']).on('change', browserSync.reload);
});

/* HTML */
gulp.task('templates', function() {
  return gulp.src('./*.html')
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.stream());
});

/* ES6 */
gulp.task('es6', function() {
	browserify({ debug: true })
		.transform(babelify)
		.require("./app/js/app.js", { entry: true })
		.bundle()
		.on('error',gutil.log)
		.pipe(source('app.js'))
    .pipe(gulp.dest('./public/js/'));
});

/* SCSS */
gulp.task('styles', function() {
  return gulp.src(['./app/scss/master.scss'])
    .pipe(sass({
      sourceComments: 'map'
    }))
    .on('error', function(err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(prefix({
      browsers: ['> 1%', 'last 3 versions', 'ie 8']
    }))
    .pipe(concat('styles.css'))
    .pipe(minify())
    .pipe(gulp.dest('./public/css/'))
    .pipe(browserSync.stream());
});

/* Watch */
gulp.task('watch',function() {
  gulp.watch(['./*.html'],['templates']);
	gulp.watch(['./app/**/*.js'],['es6']);
	gulp.watch(['./app/scss/*.scss','!./scss/ie8.scss','!./scss/ie9.scss'], ['styles']);
});

gulp.task('default', ['templates','styles','es6','watch']);