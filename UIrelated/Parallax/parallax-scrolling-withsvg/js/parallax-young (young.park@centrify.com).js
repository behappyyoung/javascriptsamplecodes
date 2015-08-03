$(document).ready(function() {
	
   var intOverallDelta = 0;
     var sectionTop = $('#parallax-main').offset().top;
     var sectionHeight = $('#parallax-main').height();
     var sectionBottom = sectionTop+sectionHeight;
      var gapInt = 50;
     var titles = ['Centrify Solution: Modern Enterprise Management for Apple', 'Enterprise identity management for Apple users'];
    window.titles = titles;
    
    $('#parallax-main').on( 'DOMMouseScroll mousewheel', function ( event ) {
         var deltaMax = sectionHeight;
         var deltaMin = 0;
    
        if(( event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0 ) &&  intOverallDelta < deltaMax) { //alternative options for wheelData: wheelDeltaX & wheelDeltaY
          //scroll down
          console.log('Down', intOverallDelta);
            intOverallDelta++;
        } else if(intOverallDelta > deltaMin){
          //scroll up
          console.log('Up', intOverallDelta);
          intOverallDelta--;        
        }

                            if(intOverallDelta >0 && intOverallDelta < gapInt){
                                    resetActive();
                            }else if(intOverallDelta > gapInt && intOverallDelta < gapInt*2){
                                    updateActive(1);
                            }else if(intOverallDelta > gapInt*2 && intOverallDelta < gapInt*3){
                                    updateActive(2);
                             }else if(intOverallDelta > gapInt*2 && intOverallDelta < gapInt*3){
                                    updateActive(3);
                             }else if(intOverallDelta > gapInt*2 && intOverallDelta < gapInt*3){
                                    updateActive(4);
                            }
        //prevent page fom scrolling
        return false;
      });
     /* 
    $(window).on('scroll',function(e){
            
console.log($(document).scrollTop(), sectionTop,  e.pageY, e.clientY,  gapInt);
                  
       if(e.pageY < sectionTop || e.pageY > sectionBottom){
           initSetting();
       }else if(e.pageY > sectionTop && e.pageY < sectionBottom){
           
           e.preventDefault();
           if(e.pageY<sectionTop + gapInt){
            resetActive();   
           }else if(e.pageY> sectionTop + gapInt && e.pageY < sectionTop + gapInt*2){
               updateActive(1);
           }else if(e.pageY> sectionTop + gapInt*2 && e.pageY < sectionTop + gapInt*3){
               updateActive(2);
           }
            
        }        
    
    });
    */
    $(window).mousemove(function(e){
        console.log($(document).scrollTop(), sectionTop,  e.pageY, e.clientY,  gapInt);
    });
   
  function updateActive(newActive){
     $("#test2").html('active ' + newActive);
        for(var i=1 ; i<=4;i++){
            $('.slide--'+i).removeClass('active');
            $('.slide--'+i).removeClass('first');
            $('.slide--'+i).addClass('deactive');
        }
    $('.slide--'+newActive).removeClass('deactive');
    $('.slide--'+newActive).addClass('active');
    $('.title').html(titles[newActive]);
}

function resetActive(){
    for(var i=1 ; i<=4;i++){
         $('.slide--'+i).addClass('first');
        $('.slide--'+i).removeClass('active');
        $('.slide--'+i).removeClass('deactive');
    }
    $('.title').html(titles[0]);
}
function initSetting(){
        for(var i=1 ; i<=4;i++){
        $('.slide--'+i).removeClass('active');
        $('.slide--'+i).removeClass('first');
        $('.slide--'+i).removeClass('deactive');
    }
   
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
    $('a.slideinit').click(function(){
         initSetting();
         intOverallDelta =0;
    	return false;
	});
    $('a.slide0').click(function(){
         resetActive();
         intOverallDelta =0;
    	return false;
	});
    $('a.slide1').click(function(){
         updateActive(1);
         intOverallDelta =0;
    	return false;
	});
    $('a.slide2').click(function(){
        updateActive(2);
         intOverallDelta =gapInt;
    	return false;
    });
        $('a.slide3').click(function(){
        updateActive(3);
         intOverallDelta = 2*gapInt;
    	return false;
    });
        $('a.slide4').click(function(){
        updateActive(4);
         intOverallDelta = 3*gapInt;
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