
jQuery(function($) {
	$( "body" ).delegate( "p", "click", function() {
	  $( this ).after( "<p>Another paragraph!</p>" );
	});
	$( "body" ).on( "click", "div", function() {
		  $( this ).after( "<div>Another div!</div>" );
	});
});