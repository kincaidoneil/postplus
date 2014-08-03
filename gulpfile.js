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
// BUILD TASKS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Prepare the dist directory for production; ready test to run LiveReload.
gulp.task('build', function() {
	runSeq(
		// Delete dist to allow for nice, clean files!
		'clean',
		// Compile Stylus; minify resulting CSS files.
		'styles',
		// Concat Polymer components into one file. Export scripts to index.js.
		'vulcanize',
		// Minify HTML and remove comments returned from vulcanize.
		'html',
		// Copy other miscellaneous assets.
		'livereload',
		'manifest',
		'fonts',
		'images'
	);
});

gulp.task('clean', function() {
	return gulp.src(['dist', 'test'], {read: false})
		.pipe(clean()); // Delete dist and test to allow for nice, clean files!
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

gulp.task('vulcanize', function() {
	return gulp.src('app/index.html')
		// Concatenate Polymer web components into a single file.
		.pipe(vulcanize({
			dest: 'dist', // Required. Somehow it exports index.js to both dist and test, though.
			inline: true, // Make sure styles are inline; make sure external scripts get exported to index.js.
			csp: true // Make sure inline scripts get exported to index.js to be in accordance with CSP.
		}))
		.pipe(gulp.dest('dist'))
		// Embed the LiveReload middleware (after scripts have been exported to index.js and before comments are deleted).
		.pipe(replace(
			'<!-- Insert middleware here. -->',
			'<script src="livereload.js?host=localhost&port=35729"><\/script>'
		))
		.pipe(gulp.dest('test'));
});

gulp.task('html', function() {
	return gulp.src('dist/index.html')
		// Minify and remove comments from HTML (purely for dist).
		.pipe(htmlMin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('livereload', function() {
	// Copy LiveReload middleware script to test.
	return gulp.src('app/bower_components/chrome-app-livereload/livereload.js')
		.pipe(gulp.dest('test'));
});

gulp.task('manifest', function() {
	// Copy Chrome App manifest and background.js to dist and test directories.
	return gulp.src(['app/manifest.json', 'app/background.js'])
		.pipe(gulp.dest('test'))
		.pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
	// Copy fonts to the dist/fonts directory.
	return gulp.src('app/components/people-app/fonts/**/*.ttf', {
			base: 'app/components/people-app/fonts' // Set base so each file goes into the same directory it started (e.g., /Roboto, /Montserrat).
		}).pipe(gulp.dest('test/fonts'))
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function() {
	// Copy images to the dist/images directory.
	return gulp.src('app/components/**/images/*.png')
		.pipe(flatten())
		.pipe(gulp.dest('test/images'))
		.pipe(gulp.dest('dist/images'));
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
			.pipe(gulp.dest('app/components'));
	});
	
	// When any files are updated, re-vulcanize index.html.
	gulp.watch('app/**/*.{html,css,js}', function(event) {
		return gulp.src('app/index.html')
			// Concatenate Polymer web components into a single file.
			.pipe(vulcanize({
				dest: 'test',
				inline: true, // Make sure styles are inline; make sure external scripts get exported to index.js.
				csp: true // Make sure inline scripts get exported to index.js to be in accordance with CSP.
			}))
			// Embed the LiveReload middleware (after scripts have been exported to index.js).
			.pipe(replace(
				'<!-- Insert middleware here. -->',
				'<script src="livereload.js?host=localhost&port=35729"><\/script>'
			))
			.pipe(gulp.dest('test'));
	});
	
	// Watch index.html to reload the Chrome app.
	gulp.watch('test/index.html', function(event) {
		return lr.changed({
			body: {
				files: [event.path]
			}
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
	gulp.watch('app/**', function(event) {
		return gulp.src('app/**/*.{html,css,js,png}')
			.pipe(browserSync.reload({stream: true}));
	});
	
});