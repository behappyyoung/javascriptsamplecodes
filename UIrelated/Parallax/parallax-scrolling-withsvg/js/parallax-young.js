$(document).ready(function () {

    var intOverallDelta = 0;
    var sectionTop = $('#parallax-main').offset().top;
    var sectionHeight = $('.parallax-wrapper').height();
   // var sectionBottom = sectionTop + sectionHeight;
    var gapInt = 10;
    var currentStage = 0;
    var inZone = false;
    var titles = ['Centrify Solution: Modern Enterprise Management for Apple',
    'Enterprise Identity Management for Apple Users ',
    'Enterprise Device Management for Mac OS X and iOS',
    'Enterprise Application Management for All Applications ',
    'Complete Management for Apple Devices On-Premises ',
    'Complete Management for Apple Devices On-Premises or From the Cloud ',
    'Complete Management for Apple Devices On-Premises or From the Cloud, or Both',
    'Centrify Solution: Modern Enterprise Management for Apple'];

 $( ".parallax-wrapper" ).on( {
		  "swipeleft" : swipeLeft,
		  "swiperight": swipeRight
		  
  });
  function swipeLeft(event){
      
      currentStage = currentStage < 7  ? currentStage+ 1 : 0; 
      console.log(currentStage);
      goStage(currentStage);
  }
  function swipeRight(event){
      currentStage = currentStage >0 ? currentStage - 1 : 7; 
    console.log(currentStage);
    goStage(currentStage);
  }
  function goStage(stage){
      console.log('go stage :' + stage)
      if(stage===0 || stage ===7){
          resetActive(stage);
          intOverallDelta = 0;
      }else{
          updateActive(stage);
          intOverallDelta = gapInt * stage;
      }
      
  }
    $('.parallax-wrapper').on('DOMMouseScroll mousewheel', function (event) {
         
        if (inZone) {
            var deltaMax = gapInt * 8;
            var deltaMin = 0;
            var delta;
            if (event.originalEvent.wheelDelta){
               if(event.originalEvent.wheelDelta < 0 ){
                    delta =(event.originalEvent.wheelDelta == -120)? 1 : 0.2;		// windows ie. chrome : mac
               }else{
                    delta =(event.originalEvent.wheelDelta == 120)? -1 : -0.2;
               }
            } 
            else if (event.originalEvent.detail) delta = -event.originalEvent.detail / -3;       // firefox
            //console.log(event.originalEvent.detail, event.originalEvent.wheelDelta, intOverallDelta, delta);
            //var direction = (event.detail<0 || event.wheelDelta>0) ? 1 : -1;
            if (( delta >0 && intOverallDelta <= deltaMax) || (delta < 0 && intOverallDelta >= 0)) {

                intOverallDelta += delta;

            }

              console.log(event.originalEvent.detail, event.originalEvent.wheelDelta, intOverallDelta, delta);


            if (intOverallDelta > 0 && intOverallDelta < gapInt) {
                resetActive(0);
            } else if (intOverallDelta > gapInt && intOverallDelta <= gapInt * 2) {
                updateActive(1);
            } else if (intOverallDelta > gapInt * 2 && intOverallDelta <= gapInt * 3) {
                updateActive(2);
            } else if (intOverallDelta > gapInt * 3 && intOverallDelta <= gapInt * 4) {
                updateActive(3);
            } else if (intOverallDelta > gapInt * 4 && intOverallDelta <= gapInt * 5) {
                updateActive(4);
            } else if (intOverallDelta > gapInt * 5 && intOverallDelta <= gapInt * 6) {
                updateActive(5);
            } else if (intOverallDelta > gapInt * 6 && intOverallDelta <= gapInt * 7) {
                updateActive(6);
            } else if (intOverallDelta > gapInt * 7) {
                resetActive(7);
            }

        } else {
            //event.preventDefault();
            // console.log($(document).scrollTop(), sectionTop, screen.height, sectionHeight, screen.width);
            //$('html, body').animate({scrollTop: $(".parallax-wrapper").offset().top}, 2000);
        }
       


        return false;
    });

    $(window).on('scroll', function (e) {

        console.log($(document).scrollTop(), sectionTop, screen.height, sectionHeight, screen.width);

        if( $(document).scrollTop() < sectionTop && $(window).width() > 740 ){
            inZone = true;
        }else{
            inZone = false;
        }
        
    });

    
    $(window).mousemove(function (e) {
        console.log('mousemove' , $(document).scrollTop(), sectionTop, $(window).height(), e.pageY, e.clientY);
         if( $(document).scrollTop() < sectionTop ,  $(window).width() > 740 ){
            inZone = true;
        }else{
            inZone = false;
        }
    });
    
    function updateActive(newActive) {
        console.log('currentstage ' + currentStage, 'new' + newActive);

        if (newActive % 2 === 1) {
            $('.parallax-main #moving-div').addClass('left');
            $('.parallax-main #moving-div').removeClass('right');
        } else {
            $('.parallax-main #moving-div').removeClass('left');
            $('.parallax-main #moving-div').addClass('right');
            
        }



        if (currentStage !== newActive) {
            for (var i = 1; i <= 7; i++) {
                $('.slide--' + i).removeClass('active');
                $('.slide--' + i).removeClass('first');
                $('.slide--' + i).addClass('deactive');
                $('nav#primary a.slide' + i).removeClass('active');
            }

            $('nav#primary a.slide0').removeClass('active');
            $('nav#primary a.slideinit').removeClass('active');

            if (newActive === 6) {
                $('.slide--4').addClass('secondactive');
                $('.slide--5').addClass('secondactive');
                $('.slide--7').addClass('secondactive');

            } else {
                $('.slide--4').removeClass('secondactive');
                $('.slide--5').removeClass('secondactive');
                $('.slide--7').removeClass('secondactive');
            }

            if (newActive === 5 || newActive === 4) {
                $('.slide--7').addClass('secondactive');
            }


            $('.slide--' + newActive).removeClass('deactive');
            $('.slide--' + newActive).addClass('active');
            $('.title').html(titles[newActive]);
            $('nav#primary a.slide' + newActive).addClass('active');

        }
        currentStage = newActive;

    }

    function resetActive(title) {
        for (var i = 1; i <= 7; i++) {
            $('.slide--' + i).addClass('first');
            $('.slide--' + i).removeClass('active');
            $('.slide--' + i).removeClass('deactive');
            $('nav#primary a.slide' + i).removeClass('active');
        }
        $('nav#primary a.slideinit').removeClass('active');
        $('.slide--4').removeClass('secondactive');
        $('.slide--5').removeClass('secondactive');
        $('.slide--7').removeClass('secondactive');
        $('nav#primary a.slide' + title).addClass('active');
        $('.title').html(titles[title]);
       if(title===7){
           $('.slide--7').addClass('active');
       }
            
        
          $('.parallax-main #moving-div').removeClass('right');
            $('.parallax-main #moving-div').removeClass('left');
            currentStage=title;
    }
    function initSetting() {
        for (var i = 0; i <= 7; i++) {
            $('.slide--' + i).removeClass('active');
            $('.slide--' + i).removeClass('first');
            $('.slide--' + i).removeClass('deactive');
            $('nav#primary a.slide' + i).removeClass('active');
        }
        $('nav#primary a.slideinit').addClass('active');
        $('.title').html(titles[0]);
         $('.parallax-main #moving-div').removeClass('right');
           $('.parallax-main #moving-div').removeClass('left');
        intOverallDelta = 0;
        currentStage = 0;

    }
    /*	
    $("#parallax-main").mousewheel(function(objEvent, intDelta){
    objEvent.preventDefault();
    var sectionHeight = 200;
                            
    var deltaMax = 400;
    var deltaMin = -400;
    if (intDelta > 0 && intOverallDelta < deltaMax){
    intOverallDelta++;

    $("#test").html('up - (' + intOverallDelta + ')');
    }
    else if (intDelta < 0 && intOverallDelta > deltaMin){
    intOverallDelta--;  
    $("#test").html('down - (' + intOverallDelta + ')');
    }
                           

    if(intOverallDelta <0 && intOverallDelta > gapInt){
    resetActive();
    }else if(intOverallDelta < gapInt && intOverallDelta > gapInt*2){
    updateActive(1);
    }else if(intOverallDelta < gapInt*2 && intOverallDelta > gapInt*3){
    updateActive(2);
    }else if(intOverallDelta < gapInt*2 && intOverallDelta > gapInt*3){
    updateActive(3);
    }else if(intOverallDelta < gapInt*2 && intOverallDelta > gapInt*3){
    updateActive(4);
    }
                            
                            
    });
    */

    /* Next/prev and primary nav btn click handlers */
    $('a.slideinit').click(function () {

        initSetting();

        intOverallDelta = 0;

        return false;
    });
    $('a.slide0').click(function () {
        resetActive(0);
        intOverallDelta = 0;
        return false;
    });
    $('a.slide1').click(function () {
        updateActive(1);
        intOverallDelta = gapInt * 1;
        return false;
    });
    $('a.slide2').click(function () {
        updateActive(2);
        intOverallDelta = gapInt * 2;

        return false;
    });
    $('a.slide3').click(function () {
        updateActive(3);
        intOverallDelta = gapInt * 3;

        return false;
    });
    $('a.slide4').click(function () {
        updateActive(4);
        intOverallDelta = gapInt * 4;

        return false;
    });
    $('a.slide5').click(function () {
        updateActive(5);
        intOverallDelta = gapInt * 5;

        return false;
    });
    $('a.slide6').click(function () {
        updateActive(6);
        intOverallDelta = gapInt * 6;

        return false;
    });
    $('a.slide7').click(function () {

        resetActive(7);
        intOverallDelta = gapInt * 7;


        return false;
    });
    $('a.english-channel').click(function () {
        $('html, body').animate({
            scrollTop: $('#english-channel').offset().top
        }, 1000, function () {
            parallaxScroll(); // Callback is required for iOS
        });
        return false;
    });
    $('a.about').click(function () {
        $('html, body').animate({
            scrollTop: $('#about').offset().top
        }, 1000, function () {
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