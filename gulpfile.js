// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// INCLUDE GULP & PLUGINS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var vulcanize = require('gulp-vulcanize');
var clean = require('gulp-rimraf');
var runSeq = require('run-sequence');
var htmlMin = require('gulp-cleanhtml');
var flatten = require('gulp-flatten');
var browserSync = require('browser-sync');
var tinylr = require('tiny-lr');
var replace = require('gulp-replace');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// BUILD TASKS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Prepare the build directory for production; ready test to run LiveReload.
gulp.task('build', function() {
	runSeq(
		// Delete build to allow for nice, clean files!
		'clean',
		// Compile SASS; minify resulting CSS files.
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
	return gulp.src(['build', 'test'], {read: false})
		.pipe(clean()); // Delete build and test to allow for nice, clean files!
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
			dest: 'build', // Required. Somehow it exports index.js to both build and test, though.
			inline: true, // Make sure styles are inline; make sure external scripts get exported to index.js.
			csp: true // Make sure inline scripts get exported to index.js to be in accordance with CSP.
		}))
		.pipe(gulp.dest('build'))
		// Embed the LiveReload middleware (after scripts have been exported to index.js and before comments are deleted).
		.pipe(replace(
			'<!-- Insert middleware here. -->',
			'<script src="livereload.js?host=localhost&port=35729"><\/script>'
		))
		.pipe(gulp.dest('test'));
});

gulp.task('html', function() {
	return gulp.src('build/index.html')
		// Minify and remove comments from HTML (purely for build).
		.pipe(htmlMin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('livereload', function() {
	// Copy LiveReload middleware script to test.
	return gulp.src('src/lib/chrome-app-livereload/livereload.js')
		.pipe(gulp.dest('test'));
});

gulp.task('manifest', function() {
	// Copy Chrome App manifest and background.js to build and test directories.
	return gulp.src(['src/manifest.json', 'src/background.js'])
		.pipe(gulp.dest('test'))
		.pipe(gulp.dest('build'));
});

gulp.task('fonts', function() {
	// Copy fonts to the build/fonts directory.
	return gulp.src('src/components/**/fonts/*.ttf')
		.pipe(flatten())
		.pipe(gulp.dest('test/fonts'))
		.pipe(gulp.dest('build/fonts'));
});

gulp.task('images', function() {
	// Copy images to the build/images directory.
	return gulp.src('src/components/**/images/*.png')
		.pipe(flatten())
		.pipe(gulp.dest('test/images'))
		.pipe(gulp.dest('build/images'));
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// CHROME TASKS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Automatically reload the Chrome App when files are updated via (modified) LiveReload.
gulp.task('chrome', function() {
	
	// Start LiveReload server.
	var lr = tinylr();
	lr.listen(35729);
	
	// Watch SASS for changes to compile them.
	gulp.watch('src/components/**/*.scss', function(event) {
		return gulp.src(event.path, {base: 'src/components'}) // Set base to 'src/components' so each file goes into the same directory it started.
			.pipe(sass()) // Compile SASS into CSS.
			.pipe(gulp.dest('src/components'));
	});
	
	// When any files are updated, re-vulcanize index.html.
	gulp.watch('src/**/*.{html,css,js}', function(event) {
		return gulp.src('src/index.html')
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
			baseDir: 'src'
		},
		port: 8000,
		browser: 'google chrome', // Automatically open up chrome...yay!
		notify: false, // Disable the on-page notice BrowserSync is running.
		logConnections: true // Log all devices that are connected.
	});
	
	// Watch SASS for changes to compile them.
	gulp.watch('src/components/**/*.scss', function(event) {
		return gulp.src(event.path, {base: 'src/components'}) // Set base to 'src/components' so each file goes into the same directory it started.
			.pipe(sass()) // Compile SASS into CSS.
			.pipe(gulp.dest('src/components/'));
	});
	
	// Watch all files for changes to reload them.
	gulp.watch('src/**', function(event) {
		return gulp.src('src/**/*.{html,css,js,png}')
			.pipe(browserSync.reload({stream: true}));
	});
	
});