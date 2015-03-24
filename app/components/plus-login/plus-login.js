Polymer('plus-login', {
	authz: {
		inProgress: false,
		service: '',
		requestURL: '',
		callbackURL: 'https://www.bing.com/'
	},
	accounts: [],
	ready: function() {
		$(window).ready(function() {
			chrome.storage.sync.get('accounts', function(accounts) {
				if ($.isEmptyObject(accounts)) {
					this.accounts = [];
				} else {
					this.accounts = accounts.accounts;
				}
				// Wait to load UI until accounts have been checked
				this.ui();
			}.bind(this));
		}.bind(this));
	},
	ui: function() {
		// As they're building-in from off-screen, begin at full speed (easeOutQuart).
		$(this.$.introPane).velocity({opacity: 1}, {duration: 1000, fill: 'both', easing: 'easeOutQuart'});
		$(this.$.accountsPane).velocity({left: 0}, {duration: 1000, fill: 'both', easing: 'easeOutQuart'});
		$(this.$.fbButton).velocity(
		// Delay animations so less is happening at once; make them more apparent.
			{left: 0, opacity: 1},
			{duration: 800, fill: 'both', easing: 'easeOutQuart'}
		);
		$(this.$.twitterButton).velocity(
			{left: 0, opacity: 1},
			{duration: 800, fill: 'both', delay: 100, easing: 'easeOutQuart'}
		);
		$(this.$.instaButton).velocity(
			{left: 0, opacity: 1}, 
			{duration: 800, fill: 'both', delay: 200, easing: 'easeOutQuart'}
		);
	},
	getURLHash: function(str) {
		var vars = str.split(/[\#\?\&]/gim);
		var obj = {};
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			obj[pair[0]] = pair[1];
		}
		return obj;
	},
	// Launch and cancel web authorization.
	launchWebAuth: function(event, details, target) {
		// Only go forward if no authorization is already in progress.
		if (this.authz.inProgress === false) {
			this.authz.inProgress = true;
			switch (target.dataset.service) {
				// Facebook
				case 'Facebook':
					// Redirect user to authorization screen.
					this.authz.requestURL = 'https://www.facebook.com/dialog/oauth' +
						'?client_id=' + '461111707272988' +
						'&redirect_uri=' + encodeURIComponent(this.authz.callbackURL) +
						'&response_type=token' +
						'&display=popup' +
						'&scope=read_stream';
					this.authz.service = 'Facebook';
					break;
				// Twitter
				case 'Twitter':
					// Make XHR request: get request token.
					var url = 'https://api.twitter.com/oauth/request_token';
					var method = 'POST';
					$.ajax({
						context: this,
						// Generate OAuth Authorization Header.
						headers: {'Authorization': twitter.generateAuthzHeader(
							url, method, {}, true
						)},
						timeout: 10000,
						type: method,
						url: url
					}).done(function(response) {
						// Success! Redirect user to authorization screen.
						this.authz.service = 'Twitter';
						this.authz.requestURL = 'https://api.twitter.com/oauth/authenticate' +
							'?oauth_token=' + this.getURLHash(response).oauth_token;
						// Save oauth_token_secret for next request.
						this.oauth_token_secret = this.getURLHash(response).oauth_token_secret;
					}).fail(function(error, xhr, status) {
						this.showErrorToast();
					});
					break;
				// Instagram
				case 'Instagram':
					// Redirect user to authorization screen.
					this.authz.service = 'Instagram';
					this.authz.requestURL = 'https://instagram.com/oauth/authorize' +
						'?client_id=' + '13bd7f412a95474ab9c7749d99a27cfc' +
						'&redirect_uri=' + encodeURIComponent(this.authz.callbackURL) +
						'&response_type=' + 'token' +
						'&scope=' + 'likes+comments+relationships';
					break;
			}
		}
	},
	checkWebAuth: function(event, details, target) {
		var url = event.url;
		var isTopLevel = event.isTopLevel;
		// Check if the URL to be loaded in the <webview> is one of the designated callback URLs.
		if (isTopLevel == true && url.indexOf(this.authz.callbackURL) > -1) {
			// Success! The user successfully authenticated their account. Get details and add the account.
			switch (this.authz.service) {
				case 'Facebook':
					this.addAccount.facebook.call(this, url);
					break;
				case 'Twitter':
					this.addAccount.twitter.call(this, url);
					break;
				case 'Instagram':
					this.addAccount.instagram.call(this, url);
					break;
			}
		}
	},
	cancelWebAuth: function(event, details, target) {
		this.authz.inProgress = false;
	},
	retryWebAuth: function() {
		// Retry launching the web auth through simulating a button click and passing throught the value of the 'data-service' attribute.
		this.launchWebAuth(null, null, {dataset: {
			service: this.authz.service
		}});
	},
	// Add/remove an account.
	addAccount: {
		facebook: function(response) {
			// Get access token from variable in the returned URL.
			var shortAccessToken = this.getURLHash(response).access_token;
			// If it acutally returned an access token and didn't error...
			if (typeof shortAccessToken != 'undefined' && shortAccessToken != null) {
				// Make XHR request: fetch long-term (60 day) access token using short-term (2 hour) access token.
				var url = 'https://graph.facebook.com/oauth/access_token' +
					'?client_id=' + '461111707272988' +
					'&redirect_uri=' + encodeURIComponent(this.authz.callbackURL) +
					'&client_secret=' + '0b6e647015c72dc9786325e3b82761f1' +
					'&grant_type=' + 'fb_exchange_token' +
					'&fb_exchange_token=' + encodeURIComponent(shortAccessToken);
				$.ajax({
					context: this,
					timeout: 10000,
					url: url
				}).done(function(response) {
					// Get extended access token.
					var longAccessToken = this.getURLHash(response).access_token;
					// If it acutally returned an access token and didn't error...
					if (typeof longAccessToken != 'undefined' && longAccessToken != null) {
						// Make XHR request: fetch basic user information.
						var url = 'https://graph.facebook.com/me' +
							'?access_token=' + longAccessToken;
						$.ajax({
							context: this,
							dataType: 'json',
							timeout: 10000,
							url: url
						}).done(function(data) {
							// Check to see if the account already exists.
							for (var i = 0; i < this.accounts.length; i++) {
								// If the account was already added, stop execution and show error dialog.
								if (this.accounts[i].accountId === data.id) {
									this.showDuplicateToast();
									return;
								}
							};
							// Add Facebook account data!
							this.accounts.push({
								accountId: data.id,
								accessToken: longAccessToken,
								service: 'Facebook',
								fullName: data.name,
								username: data.username,
								profilePicture: 'http://graph.facebook.com/' + data.username + '/picture',
								profilePictureLarge: 'http://graph.facebook.com/' + data.username + '/picture?type=large'
							});
							// Notify the user via a toast the account was added.
							this.$.successToast.show();
							this.authz.inProgress = false;
							this.authz.requestURL = 'https://www.google.com/';
						}).fail(function(error, xhr, status) {
							this.showErrorToast();
						});
					} else {
						this.showErrorToast();
					}
				}).fail(function(error, xhr, status) {
					this.showErrorToast();
				});
			} else {
				this.showErrorToast();
			}
		},
		twitter: function(response) {
			// Make XHR request: convert request token into an access token.
			var url = 'https://api.twitter.com/oauth/access_token';
			var method = 'POST';
			var oauth_token = this.getURLHash(response).oauth_token;
			var oauth_verifier = this.getURLHash(response).oauth_verifier;
			$.ajax({
				// Set scope of callback functions.
				context: this,
				data: {
					oauth_verifier: oauth_verifier
				},
				// Generate OAuth Authorization Header.
				headers: {'Authorization': twitter.generateAuthzHeader(
					url, method, {
						oauth_token: oauth_token,
						oauth_verifier: oauth_verifier
					}, false, this.oauth_token_secret
				)},
				timeout: 10000,
				type: method,
				url: url
			}).done(function(response) {
				// Success! We have a permanent OAuth access token.
				// Make XHR request: get account details.
				var url = 'https://api.twitter.com/1.1/account/verify_credentials.json';
				var method = 'GET';
				var oauth_token = this.getURLHash(response).oauth_token;
				var oauth_token_secret = this.getURLHash(response).oauth_token_secret;
				$.ajax({
					// Set scope of callback functions.
					context: this,
					// Generate OAuth Authorization Header.
					headers: {'Authorization': twitter.generateAuthzHeader(
						url, method, {
							oauth_token: oauth_token
						}, false, oauth_token_secret
					)},
					timeout: 10000,
					type: method,
					url: url
				}).done(function(data) {
					// Check to see if the account already exists.
					for (var i = 0; i < this.accounts.length; i++) {
						// If the account was already added, stop execution and show error dialog.
						if (this.accounts[i].accountId === data.id) {
							this.showDuplicateToast();
							return;
						}
					};
					// Add Twitter account data!
					this.accounts.push({
						accountId: data.id,
						oauthToken: oauth_token,
						oauthTokenSecret: oauth_token_secret,
						service: 'Twitter',
						fullName: data.name,
						username: data.screen_name,
						profilePicture: data.profile_image_url_https,
						// Remove '_normal.JPG' from end of url to indicate larger image.
						profilePictureLarge: (data.profile_image_url_https).substring(0, data.profile_image_url_https.length - 11) + '.png',
					});
					// Notify the user via a toast the account was added.
					this.$.successToast.show();
					this.authz.inProgress = false;
					this.authz.requestURL = 'https://www.google.com/';
				}).fail(function(error, xhr, status) {
					this.showErrorToast();
				});
			}).fail(function(error, xhr, status) {
				this.showErrorToast();
			});
		},
		instagram: function(response) {
			// Get access token from variable in the returned URL.
			var accessToken = this.getURLHash(response).access_token;
			// If it acutally returned an access token and didn't error.
			if (typeof accessToken != 'undefined' && accessToken != null) {
				// Make XHR request: fetch information about user.
				$.ajax({
					context: this,
					dataType: 'json',
					timeout: 10000,
					url: 'https://api.instagram.com/v1/users/self/?access_token=' + encodeURIComponent(accessToken)
				}).done(function(response) {
					var data = response.data;
					// Check to see if the account already exists.
					for (var i = 0; i < this.accounts.length; i++) {
						// If the account was already added, stop execution and show error dialog.
						if (this.accounts[i].accountId === data.id) {
							this.showDuplicateToast();
							return;
						}
					};
					// Add Instagram account data!
					this.accounts.push({
						accountId: data.id,
						accessToken: accessToken,
						service: 'Instagram',
						fullName: data.full_name,
						username: data.username,
						profilePicture: data.profile_picture,
						profilePictureLarge: data.profile_picture
					});
					// Notify the user via a toast the account was added.
					this.$.successToast.show();
					this.authz.inProgress = false;
					this.authz.requestURL = 'https://www.google.com/';
				}).fail(function(error, xhr, status) {
					this.showErrorToast();
				});
			} else {
				this.showErrorToast();
			}
		},
	},
	removeAccount: function(event, detail, target) {
		var accountIndex = $(target).attr('data-index');
		// Remove the account.
		this.accounts.splice(accountIndex, 1);
	},
	completeLogin: function() {
		// Save account data to sync API.
		chrome.storage.sync.set({accounts: this.accounts}, function() {
			// If successful, navigate to dashboard.
			navigatePage(1);
		});
	},
	// Dialogs
	showErrorToast: function() {
		this.authz.inProgress = false;
		this.authz.requestURL = 'https://www.google.com/';
		this.$.errorToast.show();
	},
	showDuplicateToast: function() {
		this.authz.inProgress = false;
		this.authz.requestURL = 'https://www.google.com/';
		this.$.duplicateToast.show();
	},
});