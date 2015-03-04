/**
 * Created by young on 3/2/15.
 */
var i = 0;

function timedCount() {
    i ++ ;
    postMessage('this is the '+i+'th message from web worker ');
    setTimeout("timedCount()",500);
}

timedCount();