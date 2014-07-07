// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// INCLUDE GULP & PLUGINS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gulp = require('gulp');
var htmlReplace = require('gulp-html-replace');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concatCSS = require('gulp-concat-css');
var vulcanize = require('gulp-vulcanize');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var clean = require('gulp-rimraf');
var runSeq = require('run-sequence');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// BUILD TASKS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('clean', function() {
	return gulp.src('build/', {read: false})
		.pipe(clean()); // Delete build/ to allow for nice, clean files!
});

gulp.task('styles', function() {
	return gulp.src('src/styles/sass/**/*.scss')
		.pipe(sass()) // Compile SASS into CSS.
		.pipe(gulp.dest('src/styles/css'))
		.pipe(concatCSS('styles.css')) // Concat CSS files into one.
		.pipe(minifyCSS({ // Minify it, remove comments, etc.
			keepSpecialComments: 0,
			keepBreaks: false,
			removeEmpty: true
		}))
		.pipe(gulp.dest('build/styles'));
});

gulp.task('scripts', function() {
	return gulp.src('src/scripts/**/*.js')
		.pipe(concat('scripts.js')) // Concat the JS files into one.
		.pipe(uglify({ // Minify it, remove comments, etc.
			compress: {
				drop_console: true
			}
		}))
		.pipe(gulp.dest('build/scripts'));
});

gulp.task('html', function() {
	return gulp.src('src/index.html')
		// Replace CSS/JS with references to the single, concatenated files.
		.pipe(htmlReplace({
			'js': 'scripts/scripts.js',
			'css': 'styles/styles.css'
		}))
		// Concatenate Polymer web components into a single file. 
		.pipe(vulcanize({
			dest: 'build/',
			csp: true, // No inline scripts allowed to be in accordance with CSP.
			strip: true // Remove comments...if it works. It's been very hit or miss.
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
	// Watch SASS for changes (including SASS for web components).
	gulp.watch('src/styles/sass/**/*.scss', function(event) {
		return gulp.src(event.path)
			.pipe(sass())
			.pipe(gulp.dest('src/styles/css'))
			.pipe(connect.reload());
	});
	// Watch JavaScript for changes.
	gulp.watch('src/scripts/**/*.js', function(event) {
		return gulp.src(event.path)
			.pipe(connect.reload());
	});
	// Watch HTML for changes (index.html or web components).
	gulp.watch('src/**/*.html', function(event) {
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
		// Compile, concat, minify and copy SASS files.
		'styles',
		// Concat, minify and copy JavaScript files.
		'scripts',
		// Replace HTML; concat Polymer components; copy.
		'html',
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