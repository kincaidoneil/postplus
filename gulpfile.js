// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// INCLUDE GULP & PLUGINS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var vulcanize = require('gulp-vulcanize');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var clean = require('gulp-rimraf');
var runSeq = require('run-sequence');
var htmlMin = require('gulp-cleanhtml');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// BUILD TASKS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('clean', function() {
	return gulp.src('build/', {read: false})
		.pipe(clean()); // Delete build/ to allow for nice, clean files!
});

gulp.task('styles', function() {
	return gulp.src('src/components/**/*.scss', {base: 'src/components'}) // Set base to 'src/components' so each file goes into the same directory it started.
		.pipe(sass()) // Compile SASS into CSS.
		.pipe(minifyCSS({ // Minify it, remove comments, etc.
			keepSpecialComments: 0,
			keepBreaks: false,
			removeEmpty: true
		}))
		.pipe(gulp.dest('src/components'));
});

gulp.task('vulcanize', function() {
	return gulp.src('src/index.html')
		// Concatenate Polymer web components into a single file.
		.pipe(vulcanize({
			dest: 'build/',
			csp: true, // No inline scripts allowed to be in accordance with CSP.
			strip: true // Remove comments...if it works. It's been very hit or miss.
		}))
		.pipe(gulp.dest('build/'));
});

gulp.task('html', function() {
	return gulp.src('build/index.html')
		.pipe(htmlMin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('build/'))
});

gulp.task('scripts', function() {
	return gulp.src('build/index.js')
		.pipe(uglify({ // Minify it, remove comments, etc.
			compress: {
				drop_console: true
			}
		}))
		.pipe(gulp.dest('build/'));
});

gulp.task('fonts', function() {
	// Copy fonts to the /build directory.
	return gulp.src('src/fonts/**/')
		.pipe(gulp.dest('build/fonts'));
});

gulp.task('images', function() {
	// Copy images to the /build directory.
	return gulp.src(['src/images/**/*.png','src/images/**/*.jpg'])
		.pipe(gulp.dest('build/images'));
});

gulp.task('lib', function() {
	// Copy all dependencies to the /build directory.
	// To update them, view instructions in UPDATE.md.
	return gulp.src('src/lib/**/')
		.pipe(gulp.dest('build/lib'));
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// WATCH TASKS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('connect', connect.server({
	root: ['src'],
	host: 'localhost',
	port: 8000,
	livereload: true,
	open: {
		browser: 'chrome'
	}
}));

gulp.task('update', function() {
	// Watch SASS for changes to compile them.
	gulp.watch('src/components/**/*.scss', function(event) {
		return gulp.src(event.path, {base: 'src/components'}) // Set base to 'src/components' so each file goes into the same directory it started.
			.pipe(sass()) // Compile SASS into CSS.
			.pipe(gulp.dest('src/components/'));
	});
	// Watch all files for changes to reload index.html.
	gulp.watch('src/**', function(event) {
		return gulp.src('src/index.html')
			.pipe(connect.reload());
	});
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SET DEFAULT FOR 'gulp' COMMAND
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('build', function() {
	runSeq(
		// Delete build/ to allow for nice, clean files!
		'clean',
		// Compile SASS; minify resulting CSS files.
		'styles',
		// Concat Polymer components into one file. Export scripts to index.js.
		'vulcanize',
		// Minify HTML and remove comments returned from vulcanize.
		'html',
		// Minify JavaScript file returned from vulcanize.
		'scripts',
		// Copy other miscellaneous assets.
		'fonts',
		'images',
		'lib'
	);
});

gulp.task('watch', function() {
	runSeq(
		// Initiate a livereload server; compile files and reload when updated.
		'connect',
		'update'
	);
});

gulp.task('default', function() {
	runSeq(
		'build', 
		'watch'
	);
});