/**
 * Created by youngsug on 5/25/2016.
 */

jQuery(function($) {
    $( "#bar" ).on( "click", function() {
        if( ! $( "#bar" ).hasClass('pull')){      // check if spinning reel is done.
           spinReel();
        }else{
           showMessgae('0', 'wait');
        }
    });
    var makerInterval, filterInterval, groundInterval;
    var turnSpeed = 3;
    var makerPosition =50, filterPosition =50, groundPosition =50;
    var randomMaker = 0, randomGround=0, randomFilter=0;
    var makerSpeed = turnSpeed-2;
    var filterSpeed = turnSpeed-1;
    var groundSpeed = turnSpeed;

    function spinReel(){
        $( "#bar" ).addClass('pull');
        $('.message').css('display', 'none');
        makerInterval = setInterval(turnMaker, 100);
        filterInterval = setInterval(turnFilter, 100);
        groundInterval = setInterval(turnGround, 100);
    }

    function initReel(){
        turnSpeed = 3;
        makerPosition = 50;
        filterPosition = 50;
        groundPosition= 50;
        randomMaker = 0;
        randomGround = 0;
        randomFilter = 0;
        makerSpeed = turnSpeed-2;
        filterSpeed = turnSpeed-1;
        groundSpeed = turnSpeed;
        $( "#bar" ).removeClass('pull');
    }
    function showMessgae(result, msg){
        var textMessage='';
        var imageDisplay = true;
        var imageSrc ='';
        switch(result){
            case 1: textMessage = 'Enjoy your Coffee';
                    imageSrc = 'images/coffee.jpg';
                    break;
            case 2: textMessage ='Enjoy Your Espresso';
                    imageSrc ='images/espresso.jpg';
                    break;
            case 3: textMessage='Enjoy Your Tea';
                    imageSrc ='images/tea.jpg';
                    break;
            case 4: textMessage ='So Close.. Try Again';
                    imageDisplay = false;
                    break;
            default: imageDisplay = false;
                     textMessage = msg;
                     break;
        }
        if(imageDisplay){
            $('.message .image img').attr("src", imageSrc);
            $('.message .image').css("display", 'block');

        }else{
            $('.message .image').css("display", 'none');
        }
        $('.message .text').html(textMessage);
        $('.message').css('display', 'block');
    }

    function turnMaker(){
        $('#maker').css('background-position', '0px '+makerPosition+'px');
        if(randomMaker !==0 && ((randomMaker-1)*100+50) == makerPosition){                      // turn until get to the correct matching image
            clearInterval(makerInterval);
        }else if(makerPosition <=550){
            makerPosition +=  50;
        }else{
            makerPosition = 50;
            if(makerSpeed >1){
                 makerSpeed--;
            }else if(randomMaker ===0){
                randomMaker = parseInt(Math.random()*3+1) ;     //    get  1 , 2 or 3
            }
        }
    }

    function turnFilter(){
        $('#filter').css('background-position', '0px '+filterPosition+'px');
        if(randomFilter !==0 && ((randomFilter-1) *100+50) == filterPosition){                              //
            clearInterval(filterInterval);
        }else if(filterPosition <=550){
            filterPosition += 50;
        }else{
            filterPosition = 50;
            if(filterSpeed >1){
                filterSpeed--;
            }else if(randomFilter ===0){
                randomFilter = parseInt(Math.random()*3+1);      //    get  1 , 2 or 3
            }
        }
    }


    function turnGround(){
        $('#ground').css('background-position', '0px '+ groundPosition+'px');
        if(randomGround !==0 && ((randomGround-1)*100+50) == groundPosition){                 //
            clearInterval(groundInterval);
            if(randomMaker==randomFilter && randomFilter==randomGround){                  // if all three are equal
                showMessgae(randomMaker);
            }else{
                showMessgae(4);
            }
            initReel();

        }else if(groundPosition<=550){
            groundPosition +=  50;
        }else{
            groundPosition = 50;
            if(groundSpeed >1){
                groundSpeed--;
            }else if(randomGround ===0){
                randomGround = parseInt(Math.random()*3+1)  ;    //    get  1 , 2 or 3
            }
        }
    }


}); 