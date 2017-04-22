<style lang="stylus" scoped>
	
	@import '../styles/global'
	
	#dashboard
		width: 100%
		height: 100%
		user-select: none
		background: white
	
	// Drawer/Tab Pane
	
	#drawerPane
		width: 250px
		height: 100%
		padding: 20px
		float: left
		box-sizing: border-box
		display: flex
		flex-direction: column
		background: twitterBlue
		color: white
		
		header
			margin: auto
			align-self: flex-start
			text-align: center
			font-family: "Montserrat"
			font-weight: bold
			font-size: 24pt
			
		#tabPane
			margin-top: 20px
			flex: 1 1 auto
			
			.tab
				width: 100%
				height: 36px
				margin-bottom: 10px
				color: white
				
				.columnAccount
					width: 36px
					height: 36px
					margin-right: -10px
					border-radius: 50%
					float: left
					
				.columnName
					width: 100px
					height: 36px
					margin-left: 12px
					float: left
					font-family: "Montserrat"
					text-transform: uppercase
					font-size: 11pt
					line-height: 36px
				
	// Columns
	
	#columnPane
		width: calc(100% - 250px)
		height: 100%
		float: left
		overflow-x: scroll
		overflow-y: hidden
		white-space: nowrap
		
		.column
			width: 360px
			height: 100%
			background: white
			display: inline-block
			
			.columnLabel
				width: 100%
				height: 40px
				padding: 0 10px
				float: left
				box-sizing: border-box
				background: navyBase
				font-family: "Montserrat"
				line-height: 40px
				text-align: left
				text-transform: uppercase
				font-size: 14pt
				color: white
				
		.item-move
			transition: transform 0.5s ease-in-out
				
	/*.item-transition
		transition: opacity 0.5s ease
		
	.item-enter
		opacity: 0
		
	.item-leave
		opacity: 0*/
		
</style>
<template>
	<div id="dashboard">
		<div id="drawerPane">
			<header>POST+</header>
			<div id="tabPane">
				<div class="tab" v-for="column in columns">
					<img class="columnAccount" :src="accounts[column.account_id].profile_image_url_https" />
					<Icon class="columnType" :type="column.type"></Icon>
					<div class="columnName">{{ column.type }}</div>
				</div>
			</div>
		</div>
		<div id="columnPane">
			<div v-for="column in columns"
				class="column"
				transition="item">
				<div class="columnLabel">{{ column.type }}</div>
			</div>
		</div>
	</div>
</template>
<script>
	
	import store from 'store'
	import Column from 'Column.vue'
	import Icon from 'Icon.vue'
	import Twit from 'twit'
	
	import _merge from 'lodash/merge'
	// import _shuffle from 'lodash/shuffle'
	
	// Use vue-animated-list for smooth transitions when columns are re-ordered
	import Vue from 'vue'
	import VueAnimatedList from 'vue-animated-list'
	Vue.use(VueAnimatedList)
	
	export default {
		components: { Column, Icon },
		data() {
			return store
		},
		ready() {
			for (let account_id in this.accounts) {
				// Sync data for every account (followers, profile pictures, etc)
				this.sync(account_id)
				// If streaming is enabled, start streaming for each account
				// if (this.settings.stream) this.streamUser(account_id)
			}
			// // If streaming is enabled
			// if (this.settings.stream) {
			// 	// Loop through columns, checking for filters of public tweets/searches
			// 	for (let column of this.columns) {
			// 		// Start streaming for each search/filter
			// 		if (column.stream_type === 'filter') {
			// 			this.streamPublic(column.account_id, column.stream_params)
			// 		}
			// 	}
			// }
			// FOR TESTING PURPOSES ONLY: Shuffle dem columns
			// setInterval(() => {
			// 	Vue.set(this, 'columns', _shuffle(this.columns))
			// }, 2000)
		},
		methods: {
			/**
			 * Cache followers and other info locally for the specified account
			 * @param  {Integer} account_id [description]
			 * @return {Promise}            [description]
			 */
			sync(account_id) {
				// Create new instance for Twitter request to save to data store
				let config = this.accounts[account_id].config
				let req = new Twit(config)
				return req.get('account/verify_credentials', (error, data, response) => {
					// If there's an error, exit and don't modify the cached data
					if (error) return
					// Save updated account info: high-res profile pics, access tokens and config for requests
					_merge(data, {
						profile_image_url_large: data.profile_image_url.replace('_normal', ''),
						profile_image_url_https_large: data.profile_image_url_https.replace('_normal', ''),
						config
					})
					// TO DO: Verify that I do not need to deep copy the object
					this.accounts[account_id] = data
				})
			},
			addColumn(account_id, type) {
				
				// Refactor this
				
				this.columns.push({
					account_id,
					endpoint: this.column_endpoints[type]
				})
				
			},
			streamUser(account_id) {
				// Begin streaming for the given account
				let account = this.accounts[account_id]
				let req = new Twit( account.config )
				req.stream('user', {
					stringify_friend_ids: true
				}).on('tweet', tweet => {
					
					account.homeTimeline.tweets.unshift(tweet)
					account.homeTimeline.newest_id = tweet.id
					
				}).on('error', error => {
					
					// Log the error
					console.log(`Error code: ${error.code}`)
					console.log(`Status code: ${error.statusCode}`)
					console.log(error.message)
					
				}).on('delete', message => {
					
					// Nah, don't worry about it!
					
				}).on('limit', message => {
					
				}).on('scrub_geo', message => {
					
				}).on('disconnect', message => {
					
				}).on('connect', request => {
					
				}).on('connected', response => {
					
				}).on('reconnect', (request, response, interval) => {
					
				}).on('warning', warning => {
					
				}).on('friends', message => {
					
					// Friends preamble...
					
				}).on('direct_message', message => {
					
				}).on('user_event', message => {
					
				}).on('blocked', message => {
					
				}).on('unblocked', message => {
					
				}).on('favorite', message => {
					
				}).on('unfavorite', message => {
					
				}).on('follow', message => {
					
				}).on('unfollow', message => {
					
				}).on('user_update', message => {
					
				}).on('list_created', message => {
					
				}).on('list_destroyed', message => {
					
				}).on('list_updated', message => {
					
				}).on('list_member_added', message => {
					
				}).on('list_member_removed', message => {
					
				}).on('list_user_subscribed', message => {
					
				}).on('list_user_unsubscribed', message => {
					
				}).on('quoted_tweet', message => {
					
				}).on('retweeted_retweet', message => {
					
				}).on('favorited_retweet', message => {
					
				})
				
				// TODO: Add code to call stream.stop() if the user changes their streaming preferences
				
			},
			streamPublic(account_id, params) {
				// Begin streaming for the given endpoint
				let req = new Twit( this.accounts[account_id].config )
				req.stream('statuses/filter',
					params || {}
				).on('tweet', tweet => {
					
				}).on('error', error => {
					
					// Log the error
					console.log(`Error code: ${error.code}`)
					console.log(`Status code: ${error.statusCode}`)
					console.log(error.message)
					
				}).on('delete', message => {
					
				}).on('limit', message => {
					
				}).on('scrub_geo', message => {
					
				}).on('disconnect', message => {
					
				}).on('connect', request => {
					
				}).on('connected', response => {
					
				}).on('reconnect', (request, response, interval) => {
					
				}).on('warning', warning => {
					
				})
				
				// TODO: Add code to call stream.stop() if the user changes their streaming preferences
				
			}
		}
	}
	
</script>
