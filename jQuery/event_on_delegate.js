
jQuery(function($) {
	$( "body #event" ).delegate( "p", "click", function() {
	  $( this ).after( "<p>Another paragraph!</p>" );
	});
	$( "body #event" ).on( "click", "div", function() {
		  $( this ).after( "<div>Another div!</div>" );
	});
});