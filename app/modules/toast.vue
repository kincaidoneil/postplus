<style lang="stylus">
	
	@import '../styles/global'
	
	.toast
		height: 48px
		padding: 0 20px
		border-radius: 24px
		box-sizing: border-box
		position: absolute
		z-index: 5
		left: 40px
		background: $twitter_gray
		line-height: 48px
		text-align: left
		font-family: "WeblySleek UI"
		font-size: 11pt
		font-weight: 300
		color: white
		
	.toast_button
		margin-left: 10px
		display: inline
		text-transform: uppercase
		text-decoration: none
		font-family: "Montserrat"
		font-size: 11pt
		font-weight: bold
		color: $accent
		cursor: pointer
		
	.toast_button:hover
		text-decoration: underline
		
	.slide-transition
		transition: all 0.3s ease
		bottom: 40px
		
	.slide-enter, .slide-leave
		bottom: -48px
		
</style>
<template>
	<div class="toast" v-if="show" transition="slide" @mouseover="pause" @mouseout="reset">
		<slot></slot>
	</div>
</template>
<script type="text/javascript">
	
	export default {
		props: ['show'],
		data() {
			return {
				timeout_id: ''
			}
		},
		watch: {
			show() {
				// When the toast is visible, hide it after 8 seconds
				if (this.show) this.reset()
			}
		},
		methods: {
			reset() {
				this.timeout_id = setTimeout(() => {
					this.show = false
				}, 8000)
			},
			pause() {
				clearTimeout(this.timeout_id)
			}
		}
	}
	
</script>
