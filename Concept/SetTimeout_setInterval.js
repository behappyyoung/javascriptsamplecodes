

function callLater(paramA, paramB, paramC){
    return (function(){
        console.log(paramA +' ' +  paramB+' ' +  paramC);

    });

}
function callnow(paramA, paramB, paramC){
    console.log(paramA +' ' +  paramB+' ' +  paramC);
}


var functRef = callLater('elStyle', "display", "none");
functRef();
callnow('test1', 'test2', 'test3');

nowset=setTimeout(callnow('test4', 'test5', 'test6'), 3000);   // settimeout doesn't work
nowset2=setTimeout(callnow, 3000, 'test7', 'test8', 'test9');       // not for old browsers
nowsetnew=setTimeout(functRef, 3000);
nowsetnew2=setTimeout(function(){callnow('test10', 'test11', 'test12')}, 3000);


function getLiveTemp(){
    var t =  setInterval(function(){returnFunction(1)}, 1000);
}
function returnFunction(a){
    console.log(a+'test');
}
getLiveTemp();

function timeTest(){
    var t = setTimeout(console.log('test'), 1000);
}
timeTest();