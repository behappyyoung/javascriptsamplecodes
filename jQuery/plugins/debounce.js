
jQuery(function($) {
	var counter_1 = 0,
		counter_2 = 0
	last_time_1 = +new Date(),
		last_time_2 = +new Date();

	// This function is not throttled, but instead bound directly to the event.
	function resize_1() {
		var now = +new Date(),
			html = 'resize handler executed: ' + counter_1++ + ' times'
				+ ' (' + ( now - last_time_1 ) + 'ms since previous execution)'
				+ '<br/>window dimensions: ' + $(window).width() + 'x' + $(window).height();

		last_time_1 = now;

		$('#text-resize-1').html( html );
	};

	// This function is throttled, and the new, throttled, function is bound to
	// the event. Note that in jQuery 1.4+ a reference to either the original or
	// throttled function can be passed to .unbind to unbind the function.
	function resize_2() {
		var now = +new Date(),
			html = 'throttled resize handler executed: ' + counter_2++ + ' times'
				+ ' (' + ( now - last_time_2 ) + 'ms since previous execution)'
				+ '<br/>window dimensions: ' + $(window).width() + 'x' + $(window).height();

		last_time_2 = now;

		$('#text-resize-2').html( html );
	};

	// Bind the not-at-all debounce handler to the resize event.
	$(window).resize( resize_1 );

	// Bind the debounce handler to the resize event.
	$(window).resize( $.debounce( 250, resize_2 ) ); // This is the line you want!


	var default_text = $('#text-type').text(),
		text_counter_1 = 0,
		text_counter_2 = 0;

	// This function is not debounced, but instead bound directly to the event.
	function text_1() {
		var val = $(this).val(),
			html = 'Not-debounced AJAX request executed: ' + text_counter_1++ + ' times.'
				+ ( val ? ' Text: ' + val : '' );

		$('#text-type-1').html( html );
	};

	// This function is debounced, and the new, debounced, function is bound to
	// the event. Note that in jQuery 1.4+ a reference to either the original or
	// debounced function can be passed to .unbind to unbind the function.
	function text_2() {
		var val = $(this).val(),
			html = 'Debounced AJAX request executed: ' + text_counter_2++ + ' times.'
				+ ( val ? ' Text: ' + val : '' );

		$('#text-type-2').html( html );
	};

	// Bind the not-at-all debounced handler to the keyup event.
	$('input.text').keyup( text_1 );

	// Bind the debounced handler to the keyup event.
	$('input.text').keyup( $.debounce( 250, text_2 ) ); // This is the line you want!

	// Trigger the callbacks once to show some initial (zero) values.
	text_1();
	text_2();


});
