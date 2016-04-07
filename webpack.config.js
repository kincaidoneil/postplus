var webpack = require('webpack');
var html_webpack_plugin = require('html-webpack-plugin');

var options = {
	entry: ['./app/index.js'],
	output: {
		path: './dist',
		publicPath: 'http://localhost:8080/dist',
		filename: 'build.js'
	},
	module: {
		loaders: [{
			test: /\.vue$/,
			loader: 'vue'
		}, {
			test: /\.js$/,
			loader: 'babel',
			exclude: /node_modules/
		}, {
			test: /\.(jpe?g|png|gif|svg|ttf)/,
			loader: 'url',
			query: {
				// Limit the size of inline files to 10KB
				limit: 10000,
				// Fallback to file-loader with this naming scheme
				name: '[name].[ext]?[hash]'
			}
		}, {
			test: /\.styl$/,
			loader: 'style-loader!css-loader!stylus-loader'
		}, {
			test: /\.css$/,
			loader: 'style-loader!css-loader'
		}]
	},
	resolve: {
		modulesDirectories: ['node_modules', 'app/modules']
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.NoErrorsPlugin(),
		new html_webpack_plugin({
			filename: 'index.html',
			template: 'app/index.html',
			inject: true
		})
	]
};

if (process.env.NODE_ENV === 'production') {
	// Minify the output
	options.plugins.push(new webpack.optimize.UglifyJsPlugin());
	// Omit localhost during production (used for hot reloading)
	options.output.publicPath = './';
}

module.exports = options;
