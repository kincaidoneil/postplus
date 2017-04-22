<style lang="stylus" scoped>
	
	@import '../styles/global'
	
	// Add account button
	
	#add_account_button
		height: 40px
		line-height: 40px
		padding: 0 10px
		border-radius: 4px
		margin: 0 auto
		align-self: flex-end
		text-transform: uppercase
		font-family: "Montserrat"
		font-size: 11pt
		font-weight: normal
		cursor: pointer
		transition: all 0.3s ease
		color: white
		background: transparent
		
	#add_account_button:hover
		background: $accent
		
	// Authorization dialog
	
	#webview
		width: 100%
		height: 100%
		position: absolute
		transition: all 0.3s ease
		
	.hide_webview
		opacity: 0
		
	#progress_spinner
		position: absolute
		left: calc((100% - 60px) / 2)
		top: calc((100% - 60px) / 2)
		z-index: 25
		transition: all 0.3s ease
		
	// Fade transition
	
	.fade-transition
		transition: all 0.3s ease
	
	.fade-enter, .fade-leave
		opacity: 0
		
</style>
<template>
	<div id="add_account_button" class="button" @click="launch_authz">Add Account</div>
	<dialog :show.sync="authz_in_progress">
		<spinner id="progress_spinner"
			v-show="webview_loading"
			transition="fade"
			size="60px"></spinner>
		<webview id="webview"
			:class="{ 'hide_webview': webview_loading }"
			:src="authz_url"
			@load-commit="check_authz"
			@did-finish-load="webview_loaded"
			autosize="on"></webview>
	</dialog>
	<toast :show.sync="show_success">Twitter account successfully added</toast>
	<toast :show.sync="show_duplicate">You already added that account</toast>
	<toast :show.sync="show_error">
		An error occurred while connecting to Twitter
		<div class="toast_button" @click="launch_authz">Retry</div>
	</toast>
</template>
<script>
	
	// Import ES6 modules
	import _ from 'lodash'
	import Vue from 'vue'
	import VueResource from 'vue-resource'
	import spinner from 'vue-spinner/src/ClipLoader.vue'
	
	import hmac_sha1 from 'crypto-js/hmac-sha1'
	import encode_base64 from 'crypto-js/enc-base64'
	
	import store from 'store'
	import toast from 'toast.vue'
	import dialog from 'dialog.vue'
	
	Vue.use(VueResource)
	
	export default {
		components: { toast, dialog, spinner },
		data() {
			return {
				authz_in_progress: false,
				webview_loading: false,
				authz_url: 'about:blank',
				accounts: store.accounts,
				// Visibility of dialogs
				show_success: false,
				show_duplicate: false,
				show_error: false
			}
		},
		ready() {
			// Set height of <webview> since CSS notoriously won't work
		},
		methods: {
			get_url_hash(str) {
				let vars = str.split(/[\#\?\&]/gim)
				let obj = {}
				for (let param of vars) {
					let pair = param.split('=')
					obj[pair[0]] = pair[1]
				}
				return obj
			},
			webview_loaded() {
				this.webview_loading = false
			},
			// Launch and call web authorization
			launch_authz() {
				// Only go forward if there's no authorization already in progress
				if (this.authz_in_progress) return
				this.webview_loading = true
				this.authz_in_progress = true
				// Make XHR request: get request token
				this.oauth_req({
					endpoint: 'oauth/request_token',
					method: 'POST'
				}).then(response => {
					// Success! We have a request token
					let oauth_token = this.get_url_hash(response.data).oauth_token
					// Set authorization URL so <webview> redirects
					this.authz_url = 'https://api.twitter.com/oauth/authenticate?force_login=true&oauth_token=' + oauth_token
				}, error => {
					this.end_authz('show_error')
				})
			},
			check_authz(event) {
				// Check if the URL to be loaded is the designated callback, and make sure the event is top level (not an inner frame)
				if (event.url.indexOf(store.callback_url) !== -1 && event.isMainFrame === true) {
					// Success! The user successfully authenticated
					// Get details and add the account
					this.add_account(this.get_url_hash(event.url))
				}
			},
			end_authz(toast) {
				// Redirect <webview> to anything other than Twitter
				this.authz_url = 'about:blank'
				// End authorization
				this.webview_loading = false
				this.authz_in_progress = false
				// If a toast was sent as a param, display it
				if (!_.isUndefined(toast)) this.$set(toast, true)
			},
			add_account(data) {
				// Make request to convert request token into an access token
				this.oauth_req({
					endpoint: 'oauth/access_token',
					method: 'POST',
					oauth_verifier: data.oauth_verifier,
					oauth_token: data.oauth_token
				}).then(response => {
					// Get variables sent back in the response body
					const data = this.get_url_hash(response.data)
					const account_id = data.user_id
					// If the account was already added, stop execution and show error dialog
					if (!_.isUndefined(this.accounts[account_id])) {
						this.end_authz('show_duplicate')
						return
					}
					// Add request configuration for the account as a prerequisite to syncing
					this.accounts[account_id] = {
						config: {
							consumer_key: store.consumer_key,
							consumer_secret: store.consumer_secret,
							access_token: data.oauth_token,
							access_token_secret: data.oauth_token_secret,
							timeout_ms: 30 * 1000
						}
					}
					// Sync data for the account
					this.$parent.sync(account_id).then(response => {
						// Success! Notify the user via a toast the account was added and end authorization
						this.end_authz('show_success')
					}).catch(error => {
						this.end_authz('show_error')
					})
				}, error => {
					this.end_authz('show_error')
				})
			},
			/**
			* [request description]
			* @param     {Object} options			Include any additional parameters as separate keys
				* @param {String} endpoint		URL of request (omitting the domain)
				* @param {String} method			GET or POST
				* @param [String] oauth_token
				* @param [String] oauth_token_secret
			* @return    {Promise}					Promise with response from the request
			*/
			oauth_req(options) {
				// COLLECT ALL PARAMETERS
				// Create two objects; parameters for the authorization header, and parameters to be sent as data in the request itself.
				let authz_params = {}
				let req_params = {}
				for (let key in options) {
					if (['endpoint', 'method', 'oauth_token', 'oauth_token_secret'].indexOf(key) === -1) {
						authz_params[key] = options[key]
						req_params[key] = options[key]
					}
				}
				// oauth_callback: ONLY if a request token is being requested
				if (options.endpoint === 'oauth/request_token') {
					authz_params.oauth_callback = store.callback_url
				}
				// oauth_token: nearly all requests, if it's unknown, leave it out
				if (typeof options.oauth_token !== 'undefined') {
					authz_params.oauth_token = options.oauth_token
				}
				// oauth_consumer_key
				authz_params.oauth_consumer_key = store.consumer_key
				// oauth_nonce: random 32-character string
				authz_params.oauth_nonce = ''
				let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
				for (let i = 0; i < 32; i++) {
					authz_params.oauth_nonce += possible.charAt(Math.floor(Math.random() * possible.length))
				}
				// oauth_signature_method
				authz_params.oauth_signature_method = 'HMAC-SHA1'
				// oauth_timestamp
				authz_params.oauth_timestamp = Math.round(new Date().getTime() / 1000)
				// oauth_version
				authz_params.oauth_version = '1.0'
				// GENERATE THE SIGNATURE
				// Create the parameter string, for use in the signature base string (the 'message' to be encrypted for the signature).
				let param_str = ''
				// For each parameter (sorted alphabetically) . . .
				Object.keys(authz_params).sort().forEach(key => {
					// Add percent-encoded keys and values to the header in such a format: 'KEY=VALUE&'.
					param_str += this.percent_encode(key) + '=' + this.percent_encode(authz_params[key]) + '&'
				})
				// No ampersand is necessary after the last param, so remove the last '&'.
				param_str = param_str.slice(0, -1)
				// Create signature base string: 'method&url&param_str' (percent-encoding both the url and param string).
				let url = 'https://api.twitter.com/' + options.endpoint
				let base_str = options.method.toUpperCase() + '&'
				base_str += this.percent_encode(url) + '&'
				base_str += this.percent_encode(param_str)
				// Create the signing key: 'oauth_consumer_secret&oauth_token_secret'
				let signing_key = this.percent_encode(store.consumer_secret) + '&'
				//  During authorization, oauth_token_secret may be unknown, in which case it's omitted.
				if (typeof options.oauth_token_secret !== 'undefined') {
					signing_key += this.percent_encode(options.oauth_token_secret)
				}
				// Calculate the signature. Use HMAC-SHA1 encryption, and Base64 to encode the raw output.
				authz_params.oauth_signature = hmac_sha1(base_str, signing_key).toString(encode_base64)
				// CREATE AUTHORIZATION HEADER
				let authz_header = 'OAuth '
				// For each param (sorted alphabetically) . . .
				Object.keys(authz_params).sort().forEach(key => {
					// Only append parameters to authorization header if they are one of the eight OAuth-compliant ones.
					let oauth_params = ['oauth_callback', 'oauth_consumer_key', 'oauth_nonce', 'oauth_signature', 'oauth_signature_method', 'oauth_timestamp', 'oauth_token', 'oauth_version']
					if (oauth_params.indexOf(key) !== -1) {
						// Add percent-encoded keys and values to the header in such a format: 'KEY="VALUE", '.
						authz_header += this.percent_encode(key) + '="' + this.percent_encode(authz_params[key]) + '", '
					}
				})
				// No comma is necesary after the last item, so remove the last two characters: ', '
				authz_header = authz_header.slice(0, -2)
				// SEND REQUEST
				return Vue.http.get({
					url: url,
					data: req_params,
					method: options.method,
					headers: {
						Authorization: authz_header
					},
					emulateJSON: true,
					timeout: 10000
				})
			},
			/**
			* [percent_encode]
			* @param  {String} str	string of parameters to be URL-encoded for an OAuth request
			* @return {String}		OAuth compliant percent/URL-encoded string of parameters
			*/
			percent_encode(str) {
				// Replace the values which encodeURIComponent doesn't encode
				// encodeURIComponent ignores: - _ . ! ~ * ' ( )
				// OAuth dictates the only ones you can ignore are: - _ . ~
				return encodeURIComponent(str)
					.replace(/\!/g, "%21")
					.replace(/\*/g, "%2A")
					.replace(/\'/g, "%27")
					.replace(/\(/g, "%28")
					.replace(/\)/g, "%29")
			}
		}
	}
	
</script>
