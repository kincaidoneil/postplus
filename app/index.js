// Import ES6 modules
import Vue from 'vue'
import dash from 'dash.vue'

// Import styles
require('./styles/fonts.styl')
require('./styles/global.styl')

// Import Animate.css
require('animate.css/animate.css')

// Create root instance, necessary for using custom components
let vm = new Vue({
	el: 'body',
	components: {
		dash
	}
})
