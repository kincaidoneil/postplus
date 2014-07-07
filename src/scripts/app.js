$(document).ready(function() {
	page.ui();
	page.events();
});

var page = {
	ui: function() {
		// Set width of column pane to support horizontal overflow scrolling of columns; number of columns * width of each one.
		$('#columnPane').width(
			$('.columnContainer').length * $('.columnContainer').width()
		);
	},
	events: function() {
		// Update UI elements when page is resized.
		$(window).resize(function() {
			page.ui();
		});
	}
}