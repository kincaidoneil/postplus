// COLUMNS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Model
var columns = {};

// Routing
App.ColumnsRoute = Ember.Route.extend({
	model: function() {
		
		return [
			{
				name: 'Friends',
				service: 'Facebook',
				endpoints: [{
					name: 'My Newsfeed',
					url: '/feed'
				}, {
					name: 'My Posts',
					url: '/me'
				}],
				feed: [{hello: 'me!'}]
			},{
				name: 'Friends',
				service: 'Twitter',
				endpoints: [{
					name: 'My Newsfeed',
					url: '/feed'
				}],
				feed: [{hello: 'world'}]
			},
		];
		
		/*
		return chrome.storage.sync.get('accounts', function(result) {
			
			
			
		});
		*/
		
	}
});

App.ColumnsController = Ember.ObjectController.extend({
	actions: {
		// Toggle editing of column name.
		editName: function() {
			this.set('isEditing', true);
		},
		saveName: function() {
			this.set('isEditing', false);
		}
	},
	isEditing: false,
});

App.ColumnsView = Ember.View.extend({
	didInsertElement: function() {
		App.Columns.ui();
		App.Columns.events();
	}
});

App.Columns = Ember.Object.extend({});

App.Columns.reopenClass({
	ui: function() {
		// Set width of columns accroding to screen resolution.
		$('.columnContainer').width(function() {
			if ($(window).width() / 4 > 350) {
				return 350;
			} else if ($(window).width() / 4 < 280) {
				return 280;
			} else {
				return $(window).width() / 4;
			}
		});
		// Set width of column pane to support horizontal overflow scrolling of columns; number of columns * width of each one.
		$('#columnPane').width(
			$('.columnContainer').length * $('.columnContainer').width()
		);
		// Dynamically set width of column labels to width of column (identical width). Due to absolute positioning, CSS doesn't work.
		$('.columnTop').width($('.column').width());
	},
	events: function() {
		$(window).on('resize', function() {
			App.Columns.ui();
		});
	}
});

var accessToken = 'CAAGjYOZBDhxwBAIo5WFZC9DZC3dcZBgTbZBVDCRPRSVNC3K5Tfplj5Fo00AkRZAZCBDal8ZCFZBctYrFRWvLIicfNFbl0BwZBmzYFmBuKhQnSZBzXCxz8ZB9Lt10cLY6u2BZCCGtCZBCMeUtZB4mazBe1v4ThUcNQqZCMBNObRJyWGVZC7rwAyZBVTAqmxVfk8V3VfGtniMkwZD';

getPosts(accessToken).done(function(obj) {
	obj.data.service = 'Facebook';
	console.log(obj.data);
});

function getPosts(accessToken) {
	return $.ajax({
		type: 'GET',
		url: 'https://graph.facebook.com/me/home?access_token=' + accessToken
	});
}