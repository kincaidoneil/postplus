<style lang="stylus" scoped>
	
	.backdrop
		width: 100%
		height: 100%
		position: absolute
		left: 0
		top: 0
		z-index: 15
		background: black
		opacity: 0.5
		
	.fade-transition
		transition: all 0.3s ease
		
	.fade-enter, .fade-leave
		opacity: 0
		
	.dialog
		width: 500px
		height: 500px
		position: absolute
		left: calc((100% - 500px) / 2)
		top: calc((100% - 500px) / 2)
		transform: scale(1)
		z-index: 20
		background: white
		
	.expand-transition
		transition: all 0.3s ease
		
	.expand-enter, .expand-leave
		transform: scale(0)
		
</style>
<template>
	<div class="backdrop" @click="exit" v-show="show" transition="fade"></div>
	<div class="dialog" v-show="show" transition="expand">
		<slot></slot>
	</div>
</template>
<script>
	
	export default {
		props: ['show'],
		methods: {
			exit() {
				this.show = false
			}
		}
	}
	
</script>
