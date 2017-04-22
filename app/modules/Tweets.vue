<style lang="stylus" scoped>
	
	@import '../styles/global'
	
	// Add more styles here
	
</style>
<template>
	<div class="column"
		v-infinite-scroll="older()"
		infinite-scroll-immediate-check="false"
		infinite-scroll-disabled="loadingAll || loadingOlder"
		infinite-scroll-distance="500"
		v-keep-scroll>
		<!-- TODO: Add a "newer" progress bar -->
		<template v-for="tweet in tweets" track-by="id">
			<Tweet class="tweet" :tweet="tweet" transition="fade" stagger="200"></Tweet>
			<div class="divider"></div>
		</template>
		<!-- TODO: Add a "older" progress bar -->
	</div>
</template>
<script type="text/javascript">
	
	import Tweet from 'Tweet.vue'
	import store from 'store'
	
	import Vue from 'vue'
	import infiniteScroll from 'vue-infinite-scroll'
	import keepScroll from 'vue-keep-scroll'
	Vue.use(infiniteScroll)
	Vue.use(keepScroll)
	
	import Twit from 'twit'
	import _uniqBy from 'lodash/uniqBy'
	import _concat from 'lodash/concat'
	
	export default {
		props: [ 'request' ],
		components: { Tweet },
		data() {
			return { store }
		},
		ready() {
			// Create the Twit instance
			this.req = new Twit(this.account.config)
			// Load all tweets
			this.load()
		},
		methods: {
			load() {
				this.loadingAll = true
				// TODO: Add whatever the endpoint stored in columns was
				this.request.get(this.column.endpoint, (error, data, response) => {
					this.loadingAll = false
					// If there's an error loading tweets, try again in 2 minutes
					if (error) {
						setTimeout(() => this.load(), 120000)
						return
					}
					// Success: update column with the latest tweets!
					Vue.set(this, 'tweets', data)
					this.column.newest_id = this.tweets[0].id
					this.column.oldest_id = _.last(this.tweets).id
					// Begin updating the tweets
					// Set the interval even if streaming is disabled so that if the
					// setting is updated, fallback to REST will begin automatically
					setInterval(() => this.newer(), this.settings.sync_interval)
				})
			},
			older() {
				// If already in the process of loading older tweets, cancel the request
				if (this.loadingOlder) return
				// Animate in the loading spinner
				this.loadingOlder = true
				// Send request
				this.req.get(this.column.endpoint, {
					max_id: this.column.oldest_id
				}, (error, data, response) => {
					this.loadingOlder = false
					// TO DO: Parse error
					if (error) return
					// Success: update column with older tweets!
					// But... sometimes Twitter returns the same tweet with the max_id
					// And Vue replaces the tweet in the view, causing an animation to play
					// So prevent it by making sure the tweets are unique!
					this.tweets = _.uniqBy(_.concat(this.tweets, data), 'id')
					this.column.oldest_id = _.last(this.tweets).id
				})
			},
			newer() {
				// Streaming begins automatically on an account-wide level
				// Only fallback to REST if streaming is disabled
				if (this.settings.stream) return
				// If already in the process of loading newer tweets, cancel the request
				if (this.loadingNewer) return
				this.loadingNewer = true
				this.req.get(this.column.endpoint, {
					since_id: this.column.newest_id
				}, (error, data, response) => {
					this.loadingNewer = false
					// TODO: Parse error
					if (error) return
					// Success: update column with the latest tweets!
					// But... sometimes Twitter returns the same tweet with the since_id
					// And Vue replaces the tweet in the view, causing an animation to play
					// So prevent it by making sure the tweets are unique!
					this.tweets = _uniqBy(_concat(data, this.tweets), 'id')
					this.column.newest_id = this.tweets[0].id
				})
			}
		}
	}
	
</script>
