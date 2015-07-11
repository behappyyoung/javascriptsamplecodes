$(document).ready(function() {
	
	redrawDotNav();
    //$('.slide--1').addClass('active');
	/* Scroll event handler */
    $(window).bind('scroll',function(e){
    	parallaxScroll();
		redrawDotNav();
    });
    
	/* Next/prev and primary nav btn click handlers */
	$('a.slide1').click(function(){
        $('.slide--1').addClass('active');
        $('.slide--2').removeClass('active');
    	return false;
	});
    $('a.slide2').click(function(){
        $('.slide--2').addClass('active');
        $('.slide--1').removeClass('active');
    	return false;
    });
    $('a.english-channel').click(function(){
    	$('html, body').animate({
    		scrollTop:$('#english-channel').offset().top
    	}, 1000, function() {
	    	parallaxScroll(); // Callback is required for iOS
		});
    	return false;
    });
	$('a.about').click(function(){
    	$('html, body').animate({
    		scrollTop:$('#about').offset().top
    	}, 1000, function() {
	    	parallaxScroll(); // Callback is required for iOS
		});
    	return false;
    });
    
    /* Show/hide dot lav labels on hover */
    $('nav#primary a').hover(
    	function () {
			$(this).prev('h1').show();
		},
		function () {
			$(this).prev('h1').hide();
		}
    );
    
});

/* Scroll the background layers */
function parallaxScroll(){
	var scrolled = $(window).scrollTop();
    console.log(scrolled);
    if(scrolled<500){
        $('.slide--1').css('top', scrolled+'px');
        $('.slide--2').css('top', scrolled+'px');
        $('.slide--3').css('top', scrolled+'px');
        $('.slide--4').css('top', scrolled+'px');
    }

}

/* Set navigation dots to an active state as the user scrolls */
function redrawDotNav(){
	var section1Top =  0;
    console.log($(document).scrollTop());
    if($(document).scrollTop() >=100 && $(document).scrollTop() < 200){
        $('nav#primary a.slide1').addClass('active');
        $('.slide--1').addClass('active');
        $('.slide--2').removeClass('active');
    }else if($(document).scrollTop() >=200 && $(document).scrollTop() < 300){
        $('.slide--2').addClass('active');
        $('nav#primary a.slide2').addClass('active');
        $('.slide--1').removeClass('active');
        $('.slide--3').removeClass('active');
    }else if($(document).scrollTop() >=300){
        $('.slide--3').addClass('active');
        $('nav#primary a.slide3').addClass('active');
        $('.slide--2').removeClass('active');
        $('.slide--4').removeClass('active');
    }else{

    }

    return true;
	// The top of each section is offset by half the distance to the previous section.
	var section2Top =  $('#frameless-parachute').offset().top - (($('#english-channel').offset().top - $('#frameless-parachute').offset().top) / 2);
	var section3Top =  $('#english-channel').offset().top - (($('#about').offset().top - $('#english-channel').offset().top) / 2);
	var section4Top =  $('#about').offset().top - (($(document).height() - $('#about').offset().top) / 2);;
	$('nav#primary a').removeClass('active');

	if($(document).scrollTop() >= section1Top && $(document).scrollTop() < section2Top){
		$('nav#primary a.manned-flight').addClass('active');
	} else if ($(document).scrollTop() >= section2Top && $(document).scrollTop() < section3Top){
		$('nav#primary a.frameless-parachute').addClass('active');
	} else if ($(document).scrollTop() >= section3Top && $(document).scrollTop() < section4Top){
		$('nav#primary a.english-channel').addClass('active');
	} else if ($(document).scrollTop() >= section4Top){
		$('nav#primary a.about').addClass('active');
	}
	
}
