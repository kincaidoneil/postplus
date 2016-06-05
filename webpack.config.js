const path = require('path')
const webpack = require('webpack')
const htmlPlugin = require('html-webpack-plugin')

let options = {
	entry: {
		electron: path.join(__dirname, 'app/electron.js'),
		index: path.join(__dirname, 'app/index.js')
	},
	output: {
		path: path.join(__dirname, 'dist/'),
		filename: '[name].js'
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
				// Limit the size of inline files to 128KB
				limit: 128000,
				// Fallback to file-loader with this naming scheme
				name: '[hash:12].[ext]'
			}
		}, {
			test: /\.styl$/,
			loader: 'style-loader!css-loader!stylus-loader'
		}, {
			test: /\.css$/,
			loader: 'style-loader!css-loader'
		}]
	},
	// Bundle all Node.js modules (I think this works...?)
	target: 'electron-renderer',
	resolve: {
		modulesDirectories: ['node_modules', 'app/modules']
	},
	babel: {
		"presets": ["es2015"],
		"plugins": ["transform-runtime"]
	},
	plugins: [
		// Generate an HTML file using the template and inject scripts
		new htmlPlugin({
			filename: 'index.html',
			template: 'app/index.html',
			inject: true,
			// Only include the render process (index.js) in the HTML file
			// Exclude the Electron main process
			chunks: ['index']
		}),
		// Webpack fucks up __dirname in electron.js, so save it to dirname instead
		// Basically, __dirname would get set to '/' instead of the full path from 'C:/'
		// More info here: https://github.com/webpack/webpack/issues/1599
		new webpack.DefinePlugin({
			dirname: '__dirname',
		})
	]
}

if (process.env.NODE_ENV === 'production') {
	// Minify the output
	options.plugins.push(new webpack.optimize.UglifyJsPlugin())
	// Omit localhost during production (used for hot reloading)
	options.output.publicPath = './'
} else {
	options.devtool = '#inline-source-map'
	options.publicPath = 'http://localhost:8080/dist'
}

module.exports = options
