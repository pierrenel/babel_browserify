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
        server: "./"
    });
    gulp.watch(['./app/**/*.js'],['es6']);
    gulp.watch(['./app/scss/*.scss','!./scss/ie8.scss','!./scss/ie9.scss'], ['styles']).on('change', browserSync.reload);
});

/* ES6 */
gulp.task('es6', function() {
	browserify({ debug: true })
		.transform(babelify)
		.require("./app/app.js", { entry: true })
		.bundle()
		.on('error',gutil.log)
		.pipe(source('bundle.js'))
    	.pipe(gulp.dest('./'));
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
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
});

/* Watch */
gulp.task('watch',function() {
	gulp.watch(['./app/**/*.js'],['es6']);
	gulp.watch(['./app/scss/*.scss','!./scss/ie8.scss','!./scss/ie9.scss'], ['styles']);
});

gulp.task('default', ['styles','es6','watch']);