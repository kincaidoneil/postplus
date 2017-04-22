<style lang="stylus" scoped>
	
	@import '../styles/global.styl'
		
	// Tweet styles
	
	#tweet_container
		width: 100%
		padding: 0 10px 15px 10px
		float: left
		box-sizing: border-box
		user-select: text
		font-size: 11pt
		font-family: "WeblySleek UI"
		color: twitterGray
		
		// Left pane of tweet with profile picture
		
		#profile_container
			width: 58px
			float: left
			position: relative
			
			#profile_pic
				width: 48px
				height: 48px
				margin-right: 10px
				border-radius: 50%
				float: left
				
			#verified_check
				width: 16px
				height: 16px
				left: 34px
				top: 34px
				position: absolute
				
			#action_buttons
				margin-top: 6px
				float: left
				
				iron-icon
					width: 18px
					height: 18px
					margin-bottom: 6px
					float: left
					color: lightgray
					cursor: pointer
					
				iron-icon:hover
					color: $twitterAccent
					
				#fav_button
					margin-right: 8px
					
				#retweet_button
					width: 22px
					height: 22px
					margin-top: -2px
					margin-bottom: 0
					
				#reply_button
					margin-right: 8px
					
				#more_button
					width: 22px
					height: 22px
					
		// Right pane of tweet with content
		
		#tweet_content
			width: calc(100% - 60px)
			float: left
			
			#tweet_details
				width: 100%
				float: left
				line-height: 10pt
				
				#tweet_name
					margin-right: 4px
					float: left
					font-weight: bold
					
				#tweet_username, #tweet_timestamp
					float: left
					font-size: 9pt
					color: darkgray
					
				#tweet_timestamp
					float: right
			
			#tweet_media
				max-width: 100%
				max-height: 200px
				margin-top: 4px
				float: left
				
			#tweet_text
				width: 100%
				margin-top: 2px
				float: left
				line-height: 14pt
				font-size: 11pt
				font-weight: 300
				
			// Styles for quoted tweets
			
			#quoted_content
				width: 100%
				margin-top: 8px
				padding: 8px
				border: 1px solid lightgray
				border-radius: 5px
				box-sizing: border-box
				float: left
				
				#quoted_details
					width: 100%
					float: left
					line-height: 10pt
					
					#quoted_name
						margin-right: 4px
						float: left
						font-size: 10pt
						font-weight: bold
						
					#quoted_username, #quoted_timestamp
						float: left
						font-size: 9pt
						color: darkgray
						
					#quoted_timestamp
						float: right
						
				#quoted_text
					width: 100%
					margin-top: 4px
					float: left
					line-height: 12pt
					font-size: 10pt
					font-weight: 300
		
		#retweeted_container
			width: 100%
			float: left
			
			#retweeted_icon
				width: 26px
				height: 26px
				margin-top: 2px
				margin-left: -46px
				padding: 4px
				float: left
				border-radius: 50%
				box-sizing: border-box
				background: limegreen
				fill: white
					
			#retweetedCaption
				margin-top: 8px
				float: left
				line-height: 10pt
				font-size: 10pt
				font-weight: 300
				
</style>
<template>
	<div id="tweet_container">
		<!-- "Retweeted by" text -->
		<!-- <div id="retweeted_container" v-if="tweet.retweeted_status">
			<div id="retweetedCaption">{{retweetedCaption}}</div>
			<iron-icon id="retweeted_icon" icon="postplus:retweet"></iron-icon>
		</div> -->
		<div id="profile_container">
			<img id="profile_pic"
				:src="_tweet.user.profile_image_url_https" @click="retweet" />
			<img id="verified_check"
				v-if="_tweet.user.verified"
				src="../assets/verified.png" />
			<!-- <div id="action_buttons">
				<iron-icon id="fav_button" icon="favorite"></iron-icon>
				<iron-icon id="retweet_button" icon="postplus:retweet" @click="retweet"></iron-icon>
				<iron-icon id="reply_button" icon="postplus:reply"></iron-icon>
				<iron-icon id="more_button" icon="more-vert"></iron-icon>
			</div> -->
		</div>
		<div id="tweet_content">
			<!-- Tweet author and time -->
			<div id="tweet_details">
				<span id="tweet_name">{{_tweet.user.name}}</span>
				<span id="tweet_username">@{{_tweet.user.screen_name}}</span>
				<time id="tweet_timestamp" :timestamp="_tweet.created_at"></time>
			</div>
			<!-- Tweet media -->
			<img id="tweet_media"
				v-if="_tweet.entities.media"
				:src="_tweet.entities.media[0].media_url_https" />
			<!-- Tweet text -->
			<div id="tweet_text">{{{_tweet.text | entities}}}</div>
			<!-- Quoted tweet -->
			<div id="quoted_content" v-if="tweet.is_quote_status">
				<div id="quoted_details">
					<span id="quoted_name">{{_tweet.quoted_status.user.name}}</span>
					<span id="quoted_username">@{{_tweet.quoted_status.user.screen_name}}</span>
					<time id="quoted_timestamp" :timestamp="_tweet.quoted_status.created_at"></time>
				</div>
				<div id="quoted_text">{{_tweet.quoted_status.text}}</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	
	import _ from 'lodash'
	import Vue from 'vue'
	import store from 'store'
	import Time from 'Time.vue'
	
	// TODO: replace lodash forEach for a for-of loop
	import _escape from 'lodash/escape'
	import _cloneDeep from 'lodash/cloneDeep'
	
	export default {
		props: ['tweet', 'show_actions'],
		components: { Time },
		ready() {
			console.log('hello')
			console.log(this.tweet)
		},
		methods: {},
		filters: {
			entities(text) {
				if (!this._tweet.entities) {
					return _escape(text)
				}
				let index_map = {}
				// Parse links
				_.forEach(this._tweet.entities.urls, link => {
					index_map[link.indices[0]] = {
						end: link.indices[1],
						html: '<a target="_blank" href="' +
							_escape(link.expanded_url) +
							'">' +
							_escape(link.display_url) +
							'</a>'
					}
				})
				// Parse media
				_.forEach(this._tweet.entities.media, media => {
					index_map[media.indices[0]] = {
						end: media.indices[1],
						html: '<a target="_blank" href="' +
							_escape(media.media_url_https) +
							'">' +
							_escape(media.display_url) +
							'</a>'
					}
				})
				// Parse hashtags
				_.forEach(this._tweet.entities.hashtags, hashtag => {
					index_map[hashtag.indices[0]] = {
						end: hashtag.indices[1],
						html: '<a target="_blank" href="http://twitter.com/search?q=' +
							_escape('#' + hashtag.text) +
							'">' +
							_escape('#' + hashtag.text) +
							'</a>'
					}
				})
				// Parse mentions
				_.forEach(this._tweet.entities.user_mentions, mention => {
					index_map[mention.indices[0]] = {
						end: mention.indices[1],
						html: '<a target="_blank" title="' +
							_escape(mention.name) +
							'" href="https://twitter.com/' +
							_escape(mention.screen_name) +
							'">' +
							_escape('@' + mention.screen_name) +
							'</a>'
					}
				})
				// Iterate through characters of string looking for matches in the index_map
				// Then append to resulting HTML string
				let result = ''
				for (let i = 0; i < text.length; ++i) {
					let entity = index_map[i]
					if (entity) {
						result += entity.html
						i = entity.end - 1
					} else {
						// If there's no entity, append character to output
						result += text[i]
					}
				}
				// Replace newlines with line breaks
				return result.replace(/(?:\r\n|\r|\n)/g, '<br />')
			}
		},
		computed: {
			// Link to the actual tweet being displayed
			// TO DO: Comment this
			// Maybe rename the raw data to something different?
			_tweet() {
				if (this.tweet.retweeted_status) return this.tweet.retweeted_status
				else return this.tweet
			},
			retweetedCaption() {
				// Check if the ID of the author of the tweet is that same as the account ID
				// If so, return "You" for the name of the person who retweeted it
				if (this.$parent.account.id === this.tweet.user.id) return 'You Retweeted'
				else return `${this.tweet.user.name} Retweeted`
			}
		}
	}
	
</script>
