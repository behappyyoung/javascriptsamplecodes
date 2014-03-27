jQuery(function($) {
	$('div').html( "<p> $(window).width();"+$(window).width()+"</p><p> $(document).width();"+$(document).width()+"</p>" );

	 
});
$( window ).resize(function() {
	$('div').html( "<p> $(window).width();"+$(window).width()+"</p><p> $(document).width();"+$(document).width()+"</p>" );
	});
