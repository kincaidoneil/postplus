<style lang="stylus">
	
	@import '../styles/global'
	
	.iconContainer
		width: 22px
		height: 22px
		padding: 5px
		position: relative
		z-index: 10
		background: twitterGray
		border-radius: 50%
		float: left
		border: 2px solid white
		
	.icon
		width: 22px
		height: 22px
		fill: white
		float: left
		
	.messages
		width: 18px
		height: 18px
		padding: 2px
		
</style>
<template>
	<div class="iconContainer"
		<!-- Timeline -->
		<svg class="icon"
			v-if="type === 'timeline'"
			xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M46 16c0 2.2-1.8 4-4 4-.36 0-.7-.04-1.02-.14l-7.12 7.1c.1.32.14.68.14 1.04 0 2.2-1.8 4-4 4s-4-1.8-4-4c0-.36.04-.72.14-1.04l-5.1-5.1c-.32.1-.68.14-1.04.14s-.72-.04-1.04-.14l-9.1 9.12c.1.32.14.66.14 1.02 0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.36 0 .7.04 1.02.14l9.12-9.1c-.1-.32-.14-.68-.14-1.04 0-2.2 1.8-4 4-4s4 1.8 4 4c0 .36-.04.72-.14 1.04l5.1 5.1c.32-.1.68-.14 1.04-.14s.72.04 1.04.14l7.1-7.12c-.1-.32-.14-.66-.14-1.02 0-2.2 1.8-4 4-4s4 1.8 4 4z"/></svg>
		<!-- Notifications -->
		<svg class="icon notifications"
			v-if="type === 'notifications'"
			xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M24 44c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4zm12-12V22c0-6.15-3.27-11.28-9-12.64V8c0-1.66-1.34-3-3-3s-3 1.34-3 3v1.36c-5.73 1.36-9 6.49-9 12.64v10l-4 4v2h32v-2l-4-4z"/></svg>
		<!-- Profile -->
		<svg class="icon"
			v-if="type === 'profile'"
			xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M24 24c4.42 0 8-3.59 8-8 0-4.42-3.58-8-8-8s-8 3.58-8 8c0 4.41 3.58 8 8 8zm0 4c-5.33 0-16 2.67-16 8v4h32v-4c0-5.33-10.67-8-16-8z"/></svg>
		<!-- List -->
		<svg class="icon"
			v-if="type === 'list'"
			xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M6 26h4v-4H6v4zm0 8h4v-4H6v4zm0-16h4v-4H6v4zm8 8h28v-4H14v4zm0 8h28v-4H14v4zm0-20v4h28v-4H14z"/></svg>
		<!-- Trending -->
		<svg class="icon"
			v-if="type === 'trending'"
			xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M32 12l4.59 4.59-9.76 9.75-8-8L4 33.17 6.83 36l12-12 8 8 12.58-12.59L44 24V12z"/></svg>
		<!-- Messages -->
		<svg class="icon messages"
			v-if="type === 'messages'"
			xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M40 4H8C5.79 4 4 5.79 4 8v36l8-8h28c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4z"/></svg>
	</div>
</template>
<script>
	
	export default {
		props: ['type']
	}
	
</script>
