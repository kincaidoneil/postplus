<style lang="stylus" scoped>
	
	@import '../styles/global'
	
	.column_container
		width: 360px
		height: 100%
		overflow-x: hidden
		overflow-y: hidden
		
		.column_top
			width: 100%
			height: 40px
			padding: 0 10px
			float: left
			box-sizing: border-box
			background: $navy_base
			
			.column_label
				line-height: 40px
				text-align: left
				float: left
				text-transform: uppercase
				font-family: "Montserrat"
				font-size: 14pt
				color: white
				border: none
				outline: none
				background: transparent
				
		.column
			width: 100%
			height: calc(100% - 40px)
			padding: 10px 0 0 0
			box-sizing: border-box
			overflow-y: scroll
			overflow-x: hidden
			float: left
			
			.divider
				width: calc(100% - 40px)
				height: 1px
				margin: 0 20px 15px 20px
				float: left
				background: lightgray
			
			// Hide the last divider
			.divider:last-of-type
				display: none
			
			.loading_older_progress
				width: 100%
				float: left
				
	.loading_spinner
		width: 60px
		height: 60px
		top: calc((100% - 60px) / 2)
		left: calc((100% - 60px) / 2)
		position: absolute
		
	.fade-transition
		transition: all 1s ease
		
	.fade-enter, .fade-leave
		opacity: 0
		
</style>
<template>
	<div class="column_container">
		<div class="column_top">
			<input class="column_label" type="text" :value="column.name" />
		</div>
		<!-- <Tweets class="column_content"></Tweets> -->
	</div>
</template>
<script>
	
	import store from 'store'
	// import Tweets from 'Tweets.vue'
	import Twit from 'Twit'
	
	export default {
		props: ['column-id'],
		// components: { Tweets },
		data() {
			let data = {}
			data.store = store
			data.column = store.columns[this.columnId]
			return data
		}
	}
	
</script>
