
jQuery(function($) {

    $('#tabs').tab();


    var current = 1;

    $('#tab-behavior').on(
        {
            'click' : function(){
                if(current < 2){
                    $('#behavior' ).animate({
                        left: '-=900px'
                    }, 500);
                }else if(current > 2){
                    $('#behavior' ).animate({
                        left: '+=900px'
                    }, 500);
                }
                $('#dashboard' ).css('left', '-900px');
                $('#chart' ).css('left', '900px');
                $('#log' ).css('left', '900px');
                $('#track' ).css('left', '900px');
                current = 2;
            }
        }
    );
    $('#tab-chart').on(
        {
            'click' : function(){
                if(current < 3){
                    $('#chart' ).animate({
                        left: '-=900px'
                    }, 500);
                }else if(current > 3){
                    $('#chart' ).animate({
                        left: '+=900px'
                    }, 500);
                }
                $('#dashboard' ).css('left', '-900px');
                $('#behavior' ).css('left', '-900px');
                $('#log' ).css('left', '900px');
                $('#track' ).css('left', '900px');
                current = 3;
            }
        }
    );
    $('#tab-log').on(
        {
            'click' : function(){
                if(current < 4){
                    $('#log' ).animate({
                        left: '-=900px'
                    }, 500);
                }else if(current > 4){
                    $('#log' ).animate({
                        left: '+=900px'
                    }, 500);
                }
                $('#dashboard' ).css('left', '-900px');
                $('#behavior' ).css('left', '-900px');
                $('#chart' ).css('left', '-900px');
                $('#track' ).css('left', '900px');
                current = 4;
            }
        }
    );
    $('#tab-track').on(
        {
            'click' : function(){
                if(current < 5){
                    $('#track' ).animate({
                        left: '-=900px'
                    }, 500);
                    $('#dashboard' ).css('left', '-900px');
                    $('#behavior' ).css('left', '-900px');
                    $('#chart' ).css('left', '-900px');
                    $('#log' ).css('left', '-900px');
                }
                setTimeout(function(){initialize();}, 500);
                current = 5;
            }
        }
    );

    $('#tab-dashboard').on(
        {
            'click' : function(){
                if(current!=1){
                    $('#dashboard' ).animate({
                        left: '+=900px'
                    }, 500);
                    $('#behavior' ).css('left', '900px');
                    $('#chart' ).css('left', '900px');
                    $('#log' ).css('left', '900px');
                    $('#track' ).css('left', '900px');
                }
                current = 1;
            }
        }
    );


    function moveBase(which){
        switch (which) {
            case 1:
                $('#tab-dashboard').trigger('click');
                break;
            case 2:
                $('#tab-behavior').trigger('click');
                break;
            case 3:
                $('#tab-chart').trigger('click');
                break;
            case 4:
                $('#tab-log').trigger('click');
                break;
            case 5:
                $('#tab-track').trigger('click');
                break;
            default :
                break;
        }
    }

    // for swipe effect
    var maxTime = 1000, // allow movement if < 1000 ms (1 sec)
        maxDistance = 50,  // swipe movement of 50 pixels triggers the swipe
        startX = 0,
        startTime = 0,
        touch = "ontouchend" in document,
        startEvent = (touch) ? 'touchstart' : 'mousedown',
        moveEvent = (touch) ? 'touchmove' : 'mousemove',
        endEvent = (touch) ? 'touchend' : 'mouseup';



    $('#base').on(
        startEvent, function(e){
            // prevent image drag (Firefox)
            e.preventDefault();
            startTime = e.timeStamp;
            startX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX;
        })
        .on(endEvent, function(e){
            startTime = 0;
            startX = 0;
        })
        .on(moveEvent, function(e){
            e.preventDefault();
            var currentX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX,
                currentDistance = (startX === 0) ? 0 : Math.abs(currentX - startX),
            // allow if movement < 1 sec
                currentTime = e.timeStamp;
            if (startTime !== 0 && currentTime - startTime < maxTime && currentDistance > maxDistance) {
                if (currentX < startX) {
                    // swipe left code here
                    next = ( current < 5) ? current +1 : current;
                    moveBase(next);
                }
                if (currentX > startX) {
                    // swipe right code here
                    next = ( current > 1) ? current -1 : current;
                    moveBase(next);
                }
                startTime = 0;
                startX = 0;
            }
        });
    /* with jquery mobile
     'swipeleft': function(){
     console.log('swipe left'+this);
     next = ( current < 5) ? current +1 : current;
     moveBase(next);
     }
     ,
     'swiperight': function(){
     console.log('swipe right'+this);
     next = ( current > 1) ? current -1 : current;
     moveBase(next);
     }
     */

    $('#starttracking').on(startEvent, function(e){
        startAnimation(200);
        $(this).removeClass('shadow');
        $(this).addClass('shadowbox');
        $('#stoptracking').removeClass('shadowbox');
        $('#stoptracking').addClass('shadow');
    });

    $('#stoptracking').on(startEvent, function(e){
        stopAnimation();
        $(this).removeClass('shadow');
        $(this).addClass('shadowbox');
        $('#starttracking').removeClass('shadowbox');
        $('#starttracking').addClass('shadow');
    });


    fetchdata();



});

function getTimeString(mytime){

    var monthstring = (mytime.getMonth()<9) ? '0'+(mytime.getMonth()+1) : mytime.getMonth()+1;
    var datestring = (mytime.getDate()<10) ? '0'+mytime.getDate() : mytime.getDate();
    var ampm = 'AM';
    var hourString = mytime.getHours();

    if(hourString==12){
        ampm = 'PM';
    }else if(hourString>12){
        hourString = hourString - 12;
        ampm = 'PM';
    }
    var hourString = (hourString<10) ? '0'+hourString : hourString;

    var minuteString = (mytime.getMinutes()<10) ? '0'+mytime.getMinutes() : mytime.getMinutes();
    var secondString = (mytime.getSeconds()<10) ? '0'+mytime.getSeconds() : mytime.getSeconds();

    var timestring = monthstring+'/'+datestring+'/'+mytime.getFullYear()+' '+hourString+':'+minuteString+':'+secondString + ' ' + ampm;

    return timestring;

}

function changeTime(cur){
    var value = cur.value;
    var mytime = new Date($('#endtime').val());
    switch(value){
        case '1':
            mytime.setHours(mytime.getHours()-1);
            break;
        case '3':
            mytime.setHours(mytime.getHours()-3);
            break;
        case '30':
            mytime.setMinutes(mytime.getMinutes()-30);
            break;
        case 'day':
            mytime.setDate(mytime.getDate()-1);
            break;
        case '7days':
            mytime.setDate(mytime.getDate()-7);
            break;
        case 'month':
            mytime.setMonth(mytime.getMonth()-1);
            break;
        case 'year':
            mytime.setFullYear(mytime.getFullYear()-1);
            break;
        default :
            console.log(value);
            break;
    }

    var monthstring = (mytime.getMonth()<9) ? '0'+(mytime.getMonth()+1) : mytime.getMonth()+1;
    var datestring = (mytime.getDate()<10) ? '0'+mytime.getDate() : mytime.getDate();

    var hourString = (mytime.getHours()<10) ? '0'+mytime.getHours() : mytime.getHours();
    var minuteString = (mytime.getMinutes()<10) ? '0'+mytime.getMinutes() : mytime.getMinutes();
    var secondString = (mytime.getSeconds()<10) ? '0'+mytime.getSeconds() : mytime.getSeconds();

    var timestring = monthstring+'/'+datestring+'/'+mytime.getFullYear()+' '+hourString+':'+minuteString+':'+secondString;


    $('#starttime').val(timestring);


}

