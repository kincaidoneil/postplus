// ROUTING/INIT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var App = Ember.Application.create();

App.Router.map(function() {
	this.route('columns');
	this.route('login');
});

// COMPONENTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Automatically focus all textfields (using helper focus-input).
App.FocusInputComponent = Ember.TextField.extend({
	didInsertElement: function() {
		this.$().focus();
	}
});

// Images can't be directly embedded. A blob is fetched via XHR, and then set as the image's 'src' attribute.
App.ImageComponent = Ember.View.extend({
	tagName: 'img',
	didInsertElement: function(src) {
		var url = this.$().attr('src');
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
		xhr.onload = function(event) {
			this.$()
				.attr('src', window.webkitURL.createObjectURL(this.response))
				.animate({opacity: 1}, 400);
		};
		xhr.send();
	}.property('src')
});

// HELPERS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Ember.Handlebars.helper('equal', function(param1, param2, options) {
	if (param1 === param2) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});