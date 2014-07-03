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

var handlebars = require('gulp-ember-handlebars');

var connect = require('gulp-connect');

// Both below are not used...YET.
var filter = require('gulp-filter');
var minifyHTML = require('gulp-htmlmin');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// BUILD TASKS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

gulp.task('templates', function() {
	return gulp.src('src/templates/**/*.hbs')
		.pipe(handlebars({ // Compile Handlebars templates into JS.
			outputType: 'browser'
		}))
		.pipe(concat('templates.js')) // Concat the JS files into one.
		.pipe(gulp.dest('src/templates'))
		.pipe(uglify({ // Minify it, remove comments, etc.
			compress: {
				drop_console: true
			}
		}))
		.pipe(gulp.dest('build/templates'));
});

gulp.task('html', function() {
	var htmlFilter = filter('**/*.html');
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
	// Watch SASS for changes.
	gulp.watch('src/styles/sass/**/*.scss', function(event) {
		gulp.src(event.path)
			.pipe(sass())
			.pipe(gulp.dest('src/styles/css'))
			.pipe(connect.reload());
	});
	// Watch Handlebars for changes.
	gulp.watch('src/templates/**/*.hbs', function(event) {
		gulp.src(event.path)
			.pipe(handlebars({
				outputType: 'browser'
			}))
			.pipe(concat('templates.js'))
			.pipe(gulp.dest('src/templates'))
			.pipe(connect.reload());
	});
	// Watch JavaScript for changes.
	gulp.watch('src/scripts/**/*.js', function(event) {
		gulp.src(event.path)
			.pipe(connect.reload());
	});
	// Watch HTML for changes (index.html or web components).
	gulp.watch('src/**/*.html', function(event) {
		gulp.src(event.path)
			.pipe(connect.reload());
	});
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SET DEFAULT FOR 'gulp' COMMAND
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('default', ['build', 'watch']);

gulp.task('build', [
	// Compile, concat, minify and copy SASS files.
	'styles',
	// Concat, minify and copy JavaScript files.
	'scripts',
	// Compile and copy handlebars templates.
	'templates',
	// Replace HTML; concat Polymer components; copy.
	'html',
	// Copy other miscellaneous assets.
	'fonts',
	'images',
	'lib',
]);

gulp.task('watch', [
	// Initiate a livereload server; compile files and reload when updated.
	'connect',
	'update'
]);