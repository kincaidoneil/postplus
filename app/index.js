import Vue from 'vue'
import Dash from 'Dash.vue'

// Import styles
require('fonts.styl')
require('global.styl')

// Create root instance, necessary for using custom components
new Vue({
	el: 'body',
	components: { Dash }
})
