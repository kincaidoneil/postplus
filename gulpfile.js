// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// INCLUDE GULP & PLUGINS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var browserSync = require('browser-sync');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');
var stylus = require('gulp-stylus');
var tinylr = require('tiny-lr');
var vulcanize = require('gulp-vulcanize');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DEFAULT TASKS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Delete dist and build to allow for nice, clean files!
gulp.task('clean', function(callback) {
	return del(['build', 'dist'], callback);
});

// Compile Stylus into CSS; minify it.
gulp.task('styles', function() {
	// Set base to 'app/components' so each file goes into the same directory it started.
	return gulp.src('app/components/**/*.styl', {base: 'app/components'})
		.pipe(stylus())
		.pipe(csso())
		.pipe(gulp.dest('app/components'));
});

// Copy all files; cache them.
gulp.task('copy', function() {
	return gulp.src('app/**')
		.pipe(gulp.dest('build'))
		.pipe(gulp.dest('dist'));
});

gulp.task('build:vulcanize', function() {
	return gulp.src('build/index.html')
		// Concatenate Polymer web components into a single file (build).
		.pipe(vulcanize({
			dest: 'build',
			// Make sure inline (and external) scripts get exported to index.js to be in accordance with CSP; styles are inlined.
			inline: true,
			csp: true,
			// Don't vulcanize LiveReload script, but keep it in the output.
			strip_excludes: false,
			excludes: {
				scripts: ['livereload.js']
			}
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('dist:vulcanize', function() {
	return gulp.src('dist/index.html')
		// Concatenate Polymer web components into a single file (dist).
		.pipe(vulcanize({
			dest: 'dist',
			// Make sure inline (and external) scripts get exported to index.js to be in accordance with CSP; styles are inlined.
			inline: true,
			csp: true,
			// Minify; remove comments.
			strip: true,
			// Strip LiveReload script from the output.
			strip_excludes: true,
			excludes: {
				scripts: ['livereload.js']
			}
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('dist:html', function() {
	// Minify and remove comments from HTML (purely for dist; sometimes 'strip' doesn't work right).
	return gulp.src('dist/index.html')	
		.pipe(minifyHTML({
			comments: true
		}))
});

gulp.task('dist:clean', function(callback) {
	return del([
		// Remove bower components (already vulcanized into index.html and index.js).
		'dist/bower_components',
		// Delete unnecessary component files so only assets (images and fonts) remain.
		'dist/components/**/*.{html,css,styl,js}'
	], callback);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// CHROME TASKS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Automatically reload the Chrome App when files are updated via (modified) LiveReload.
gulp.task('chrome', function() {
	
	// Start LiveReload server.
	var lr = tinylr();
	lr.listen(35729);
	
	// Watch Stylus for changes to compile them.
	gulp.watch('app/components/**/*.styl').on('change', function(event) {
		// Set base to 'app/components' so each file goes into the same directory it started.
		return gulp.src(event.path, {base: 'app/components'})
			.pipe(stylus())
			.pipe(gulp.dest('app/components/'));
	});
	
	// When any source files are modified, copy them to build/.
	gulp.watch('app/components/**/*.{html,css,js}').on('change', function(event) {
		return gulp.src(event.path, {base: 'app'})
			.pipe(gulp.dest('build'));
	});
	
	// When any build files are updated, re-vulcanize index.html.
	// Copy index.html from app/ first so index.html in build/ won't be vulcanized twice.
	gulp.watch('build/components/**/*.{html,css,js}').on('change', gulp.series(
		'chrome:copy',
		'build:vulcanize'
	));
	
	// Reload the Chrome app when index.html is updated (following vulcanization).
	gulp.watch('build/index.html').on('change', function(event) {
		console.log('Reloading LiveReload...');
		return lr.changed({
			body: {files: [event.path]}
		});
	});
	
});

gulp.task('chrome:copy', function() {
	return gulp.src('app/index.html')
		.pipe(gulp.dest('build'))
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SERVER TASKS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Run and automatically reload pages via a BrowserSync server on localhost.
gulp.task('server', function() {
	
	// Initiate BrowserSync server.
	browserSync({
		server: {
			baseDir: 'app'
		},
		port: 8000,
		browser: 'google chrome', // Automatically open up chrome...yay!
		notify: false, // Disable the on-page notice BrowserSync is running.
		logConnections: true // Log all devices that are connected.
	});
	
	// Watch Stylus for changes to compile them.
	gulp.watch('app/components/**/*.styl').on('change', function(event) {
		// Set base to 'app/components' so each file goes into the same directory it started.
		return gulp.src(event.path, {base: 'app/components'})
			.pipe(stylus())
			.pipe(gulp.dest('app/components/'));
	});
	
	// Watch all files for changes to reload them.
	gulp.watch(['app/components/**/*.{html,js,css}', 'app/index.html']).on('change', function(event) {
		// Reload the entire page; injecting (even just CSS) doesn't seem work. F*cking web components.
		return gulp.src(event.path)
			.pipe(browserSync.reload({stream: true, once: true}));
	});
	
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DEFAULT FOR 'gulp' COMMAND
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('default', gulp.series(
	'clean',
	'styles',
	'copy',
	gulp.parallel('build:vulcanize', 'dist:vulcanize'),
	gulp.parallel('dist:html', 'dist:clean')
));