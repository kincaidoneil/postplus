<template>
	<span :title="full_timestamp">{{elapsed_timestamp}}</span>
</template>
<script type="text/javascript">
	
	// Import ES6 modules
	// import store from 'store'
	let store = require('store')
	
	module.exports = {
		props: ['timestamp'],
		data() {
			return {
				elapsed_timestamp: ''
			}
		},
		ready() {
			this.update()
		},
		methods: {
			update() {
				let now = new Date()
				let timestamp = new Date(this.timestamp)
				// Number of milliseconds since post was created: current time - time of creation.
				let diff = now - timestamp
				// Determine units of time in milliseconds
				let second = 1000
				let minute = second * 60
				let hour = minute * 60
				let day = hour * 24
				// To improve performance, only update timestamps when they'll likely be updated
				// If one day or more has elapsed
				if (diff / day >= 1) {
					// Abbreviate the month
					let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
					let month = months[timestamp.getMonth()]
					// Determine date
					let date = timestamp.getDate()
					// Determine year: if the tweet was posted this year, omit the year
					let year = timestamp.getFullYear() === now.getFullYear() ? '' : timestamp.getFullYear().toString()
					this.elapsed_timestamp = `${month} ${date} ${year}`
				} // If one hour or more has elapsed
				else if (diff / hour >= 1) {
					this.elapsed_timestamp = Math.floor(diff / hour).toString() + 'h'
					// Update timestamp after an hour passes
					setTimeout(() => {
						this.update()
					}, 3600000);
				} // If one minute or more has elapsed
				else if (diff / minute >= 1) {
					this.elapsed_timestamp = Math.floor(diff / minute).toString() + 'm'
					// Update timestamp after a minute passes
					setTimeout(() => {
						this.update()
					}, 60000);
				} // If one second or more has elapsed
				else if (diff / second >= 1) {
					this.elapsed_timestamp = Math.floor(diff / second).toString() + 's'
					// Update timestamp after 1 second
					setTimeout(() => {
						this.update()
					}, 1000)
				} // If less than one second has elapsed
				else {
					this.elapsed_timestamp = 'Just now'
					// Update timestamp after 1 second
					setTimeout(() => {
						this.update()
					}, 1000)
				}
			}
		},
		computed: {
			full_timestamp() {
				let timestamp = new Date(this.timestamp)
				// Determine date
				let year = timestamp.getFullYear()
				// Determine month
				let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
				let month = months[timestamp.getMonth()]
				// Determine date
				let date = timestamp.getDate()
				// Determine hour
				let hour = timestamp.getHours()
				// Determine minute
				let minute = timestamp.getMinutes()
				// Determine if AM/PM should be appended
				// If 12 hour clock is enabled, correct the hours
				let half = ''
				if (store.settings.twelve_hour) {
					half = (hour < 12) ? 'am' : 'pm'
					if (hour > 12) hour = hour - 12
					if (hour === 0) hour = 12
				}
				// If minutes are single digit, add a zero
				if (minute < 10) minute = '0' + minute.toString()
				// Return the full timestamp
				return `${hour}:${minute}${half}, ${month} ${date}, ${year}`
			}
		}
	}
	
</script>
