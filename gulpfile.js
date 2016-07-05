var gulp = require('gulp'),
		fs = require("fs"),
		browserify = require("browserify"),
		babelify = require("babelify"),
		source = require('vinyl-source-stream'),
		gutil = require('gulp-util'),
		sass = require('gulp-sass'),
  	concat = require('gulp-concat'),
  	prefix = require('gulp-autoprefixer'),
  	minify = require('gulp-minify-css');

// Lets bring es6 to es5 with this.
// Babel - converts ES6 code to ES5 - however it doesn't handle imports.
// Browserify - crawls your code for dependencies and packages them up
// into one file. can have plugins.
// Babelify - a babel plugin for browserify, to make browserify
// handle es6 including imports.
gulp.task('es6', function() {
	browserify({ debug: true })
		.transform(babelify)
		.require("./app/app.js", { entry: true })
		.bundle()
		.on('error',gutil.log)
		.pipe(source('bundle.js'))
    	.pipe(gulp.dest('./'));
});

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
    .pipe(gulp.dest('./'));
});

gulp.task('watch',function() {
	gulp.watch(['./app/**/*.js'],['es6']);
	gulp.watch(['./app/scss/*.scss','!./scss/ie8.scss','!./scss/ie9.scss'], ['styles']);
});

gulp.task('default', ['styles','es6','watch']);