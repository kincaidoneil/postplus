export default {
	accounts: {
		'254345401': {
			config: {
	            consumer_key: "JndzzjUy4Nej49X0qGDWNQ",
	            consumer_secret: "CCztEsN37EEHmy7xNlsHNiRou9IJxZBlYsuz4T7HLiE",
	            access_token: "254345401-GBUbI5f4jkOIgUAZGZhY5RBsvlHbA9ZxQbLhVfS8",
	            access_token_secret: "LM7oc5wT77O8JRWDnMi7vyul8UodnJFNvLxCPxnTSZU",
	            timeout_ms: 30000
	        },
			home_timeline: {
				tweets: [],
				newest_id: '',
				oldest_id: ''
			},
			user_timeline: {
				tweets: [],
				newest_id: '',
				oldest_id: ''
			},
			mentions_timeline: {
				tweets: [],
				newest_id: '',
				oldest_id: ''
			},
			lists: {
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
			direct_messages: {
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
		name: 'Timeline',
		account_id: '254345401',
		endpoint: 'statuses/home_timeline',
		oldest_id: 0,
		newest_id: 0
	}, {
		name: 'Profile',
		account_id: '254345401',
		endpoint: 'statuses/user_timeline',
		oldest_id: 0,
		newest_id: 0
	}],
	// Globals
	consumer_key: 'JndzzjUy4Nej49X0qGDWNQ',
	consumer_secret: 'CCztEsN37EEHmy7xNlsHNiRou9IJxZBlYsuz4T7HLiE',
	callback_url: 'postplusapp.com',
	// Settings
	settings: {
		// Constant for whether to use a 12/24 hour clock
		twelve_hour: true,
		// Streaming
		stream: true,
		// Milliseconds between each request
		sync_interval: 1000 * 60,
		// Use browser or built-in preview
		open_in_browser: false
	}
}
