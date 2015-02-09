var mydiv = document.getElementById('div');

function callLater(paramA, paramB, paramC){
    return (function(){
        mydiv.innerHTML = mydiv.innerHTML + paramA + paramB + paramC + '<br />';

    });

}
function callnow(paramA, paramB, paramC){
    mydiv.innerHTML = mydiv.innerHTML + paramA + paramB + paramC + '<br />';
}


var functRef = callLater('elStyle', "display", "none");
functRef();
callnow('test1', 'test2', 'test3');

nowset=setTimeout(callnow('test4', 'test5', 'test6'), 3000);   // settimeout doesn't work
nowset2=setTimeout(callnow, 3000, 'test7', 'test8', 'test9');       // not for old browsers
nowsetnew=setTimeout(functRef, 3000);


nowset3=setInterval(callnow, 3000, 'test11', 'test12', 'test13');       // not for old browsers
nowsetnew2=setInterval(functRef, 3000);
