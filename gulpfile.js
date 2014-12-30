// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// INCLUDE GULP & PLUGINS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var vulcanize = require('gulp-vulcanize');
var clean = require('gulp-rimraf');
var runSeq = require('run-sequence');
var htmlMin = require('gulp-cleanhtml');
var flatten = require('gulp-flatten');
var browserSync = require('browser-sync');
var tinylr = require('tiny-lr');
var replace = require('gulp-replace');
var stylus = require('gulp-stylus');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DEFAULT FOR 'gulp' COMMAND
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

gulp.task('default', function() {
	runSeq(
		'clean',
		'styles',
		'copy',
		// For some reason, vulcanize doesn't work properly when it runs in parallel, so run them synchronously.
		'build-vulcanize',
		'dist-vulcanize',
		['dist-html', 'dist-clean']
	);
});

gulp.task('clean', function() {
	return gulp.src(['dist', 'build'], {read: false})
		.pipe(clean()); // Delete dist and build to allow for nice, clean files!
});

gulp.task('copy', function() {
	return gulp.src('app/**')
		.pipe(gulp.dest('build'))
		.pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
	return gulp.src('app/components/**/*.styl', {base: 'app/components'}) // Set base to 'app/components' so each file goes into the same directory it started.
		.pipe(stylus()) // Compile Stylus into CSS.
		.pipe(minifyCSS({ // Minify it, remove comments, etc.
			keepSpecialComments: 0,
			keepBreaks: false,
			removeEmpty: true
		}))
		.pipe(gulp.dest('app/components'));
});

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// BUILD TASKS
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	gulp.task('build-vulcanize', function() {
		return gulp.src('build/index.html')
			// Concatenate Polymer web components into a single file (build).
			.pipe(vulcanize({
				dest: 'build',
				// Make sure inline (and external) scripts get exported to index.js to be in accordance with CSP; styles are inlined.
				inline: true,
				csp: true
			}))
			// Embed the LiveReload middleware (after scripts have been exported to index.js).
			.pipe(replace(
				'<!-- inject:middleware -->',
				'<script src="bower_components/chrome-app-livereload/livereload.js?host=localhost&port=35729"><\/script>'
			))
			.pipe(gulp.dest('build'));
	});

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// DIST TASKS
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	gulp.task('dist-vulcanize', function() {
		return gulp.src('dist/index.html')
			// Concatenate Polymer web components into a single file (dist).
			.pipe(vulcanize({
				dest: 'dist',
				// Make sure inline (and external) scripts get exported to index.js to be in accordance with CSP; styles are inlined.
				inline: true,
				csp: true,
				// Minify; remove comments.
				strip: true
			}))
			.pipe(gulp.dest('dist'));
	});
	
	gulp.task('dist-html', function() {
		// Minify and remove comments from HTML (purely for dist; sometimes 'strip' doesn't work right).
		return gulp.src('dist/index.html')	
			.pipe(htmlMin({
				collapseWhitespace: true,
				removeComments: true
			}))
	});
	
	gulp.task('dist-clean', function() {
		return gulp.src([
			// Remove bower components (already vulcanized into index.html and index.js).
			'dist/bower_components',
			// Delete unnecessary component files so only assets (images and fonts) remain.
			'dist/components/**/*.{html,css,styl,js}',
		], {read: false})
			.pipe(clean());
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
	gulp.watch('app/components/**/*.styl', function(event) {
		return gulp.src(event.path, {base: 'app/components'}) // Set base to 'app/components' so each file goes into the same directory it started.
			.pipe(stylus()) // Compile Stylus into CSS.
			.pipe(gulp.dest('app/components/'));
	});
	
	// When any source files are modified, copy them to build/.
	gulp.watch('app/components/**/*.{html,css,js}', function(event) {
		return gulp.src(event.path, {base: 'app'})
			.pipe(gulp.dest('build'));
	});
	
	// When any build files are updated, re-vulcanize index.html.
	gulp.watch('build/components/**/*.{html,css,js}', function(event) {
		gulp.task('chrome-copy', function() {
			return gulp.src('app/index.html')
				.pipe(gulp.dest('build'));
		});
		runSeq(
			// 1) Copy index.html from app/ so the pre-vulcanized index.html is not being vulcanized again.
			'chrome-copy',
			// 2) Vulcanize; add LiveReload script.
			'build-vulcanize'
		);
	});
	
	// Reload the Chrome app when index.html is updated (following vulcanization).
	gulp.watch('build/index.html', function(event) {
		return lr.changed({
			body: {files: [event.path]}
		});
	});
	
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
	gulp.watch('app/components/**/*.styl', function(event) {
		return gulp.src(event.path, {base: 'app/components'}) // Set base to 'app/components' so each file goes into the same directory it started.
			.pipe(stylus()) // Compile Stylus into CSS.
			.pipe(gulp.dest('app/components/'));
	});
	
	// Watch all files for changes to reload them.
	gulp.watch(['app/components/**/*.{html,js,css}', 'app/index.html'], function(event) {
		return gulp.src(event.path)
			.pipe(browserSync.reload({stream: true, once: true})); // Reload the entire page; injecting (even just CSS) doesn't seem work. F*cking web components.
	});
	
});