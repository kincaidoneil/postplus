<style lang="stylus">

	#accounts_pane
		margin-top: 20px
		box-sizing: border-box
		flex-grow: 1
		flex-shrink: 1
		flex-basis: auto
		
		.account
			width: 100%
			height: 72px
			font-size: 12pt
		
			.profile_picture
				width: 48px
				height: 48px
				margin-right: 12px
				border-radius: 50%
				box-sizing: border-box
				float: left
				
			.name
				width: calc(100% - 60px)
				height: 24px
				float: left
				display: flex
				justify-content: flex-end // Make sure the text is aligned to the bottom
				flex-direction: column
				font-family: "WeblySleek UI"
				font-weight: bold
				font-size: 11pt
				
			.username
				width: calc(100% - 60px)
				height: 24px
				float: left
				color: white
				font-family: "WeblySleek UI"
				font-weight: 300
				font-size: 10pt
				
			.link
				width: 100%
				float: left
				
</style>
<template>
	<div class="account" v-for="(account_id, account) in accounts">
		<img class="profile_picture" :src="account.profile_image_url_https" />
		<div class="name">{{account.name}}</div>
		<div class="username">@{{account.screen_name}}</div>
		<div class="link" @click="add_column(account_id, 'timeline')">Timeline</div>
		<div class="link" @click="add_column(account_id, 'timeline')">Timeline2</div>
	</div>
</template>
