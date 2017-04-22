// import configStore from 'configstore'
// const config = new configStore('postplus')
//
// import _merge from 'lodash/merge'
//
// // Add all saved user data, if it exists
// _merge(options, config.get('data'))

export default {
	accounts: {
		// This is an example account schema!
		// TODO: Add Twitter account ID for the key below
		'': {
			config: {
				consumer_key: "",
				consumer_secret: "",
				access_token: "",
				access_token_secret: "",
				timeout_ms: 30000
			},
			homeTimeline: {
				tweets: [],
				newest_id: '',
				oldest_id: '',
				rateLimit: 15
			},
			userTimeline: {
				tweets: [],
				newest_id: '',
				oldest_id: '',
				rateLimit: 180
			},
			mentionsTimeline: {
				tweets: [],
				newest_id: '',
				oldest_id: '',
				rateLimit: 15
			},
			lists: {
				rateLimit: 180,
				'list_id': {
					// Other miscellaneous metadata here
					tweets: [],
					newest_id: '',
					oldest_id: ''
				},
				'list_id2': {
					// Other miscellaneous metadata here
					tweets: [],
					newest_id: '',
					oldest_id: ''
				}
			},
			directMessages: {
				'user_id': {
					// Other miscellaneous metadata here
					messages: [],
					newest_id: '',
					oldest_id: ''
				},
				'user_id2': {
					// Other miscellaneous metadata here
					messages: [],
					newest_id: '',
					oldest_id: ''
				}
			}
			// Trends
			// Notifications
			// Activity
			// Likes
			// Search
			// Followers
			// Users
			// Trending
		}
	},
	columns: [{
		type: 'timeline',
		account_id: '',
		endpoint: 'statuses/home_timeline'
	}, {
		type: 'profile',
		account_id: '',
		endpoint: 'statuses/user_timeline'
	}, {
		type: 'messages',
		account_id: ''
	}, {
		type: 'list',
		account_id: ''
	}, {
		type: 'notifications',
		account_id: ''
	}, {
		type: 'trending',
		account_id: ''
	}],
	// Globals
	consumerKey: '',
	consumerSecret: '',
	callbackURL: '',
	// Settings
	settings: {
		// Constant for whether to use a 12/24 hour clock
		twelveHour: true,
		// Streaming
		stream: true,
		// Milliseconds between each request
		syncInterval: 1000 * 60,
		// Use browser or built-in preview
		openInBrowser: false
	}
}
