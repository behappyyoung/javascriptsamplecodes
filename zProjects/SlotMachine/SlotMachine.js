/**
 * Created by youngsug on 5/25/2016.
 */

jQuery(function($) {
    $( "#bar" ).on( "click", function() {
        if( ! $( "#bar" ).hasClass('pull')){      // check if spinning reel is done.
            $( "#bar" ).addClass('pull');
            spinReel();
        }
    });
    function spinReel(){                        // spinning the reel by updating classes

        var t = setTimeout(function(){ $( "#bar" ).removeClass('pull');}, 1000);
    }
    for(var i=-160; i<80; i++){
        console.log(i);
        (function(x){setTimeout(function(){ $('#maker').css('top', x+'px');}, 1000)})(i);
    }

}); 