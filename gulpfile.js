var fs = require("fs");
var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var minify = require('gulp-minify');
var gulpSync = require('gulp-sync')(gulp);
var babelify = require('babelify');
var browserify = require('browserify');
var watch = require('gulp-watch');

gulp.task('default', gulpSync.sync(['prepare-dirs', 'cleanup', 'babelify', 'transpile', 'minify', 'copy', 'move-resources']));

gulp.task('prepare-dirs', function(done) {
    if (!fs.existsSync('./lib')) {
        fs.mkdir('./lib');
    }
    
    if (!fs.existsSync('./dist')) {
        fs.mkdir('./dist');
    }
    
    return done();
});

gulp.task('cleanup', function() {
	return del([
        './lib/*',
        './dist/*'
    ]);
});

gulp.task('transpile', function() {
    return gulp.src('./app/**/*.js')
        .pipe(babel())
        .on('error', function() {
            this.emit('end');
        })
        .pipe(gulp.dest('./lib/'));
});

gulp.task('minify', function() {
	return gulp.src('./dist/app.js')
		.pipe(minify({
			ext: {
			},
			exclude: [],
			ignoreFiles: []
		}))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('copy', function() {
    return gulp.src(['./app/index.html'])
        .pipe(gulp.dest('./dist/'));
});

gulp.task('move-resources', function() {
    return gulp.src(['./app/resources/**/*'])
        .pipe(gulp.dest('./dist/resources'));
});

gulp.task('babelify', function() {
    return browserify('./app/index.js')
        .transform(babelify)
        .bundle()
        .pipe(fs.createWriteStream('./dist/app.js'));
});

gulp.task('live-reload', function() {
    return gulp.watch('./app/**/*', ['default']);
});
