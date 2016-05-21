/*
// Allow callback to run at most 1 time per 100ms
window.addEventListener("resize", throttle(callback, 100));
// Allow callback to run on each resize event
window.addEventListener("resize", callback2);

function callback ()  { console.count("Throttled");     }
function callback2 () { console.count("Not Throttled"); }
*/

function throttle (callback, limit) {
    var wait = false;                  // Initially, we're not waiting
    return function () {               // We return a throttled function
        if (!wait) {                   // If we're not waiting
            callback.call();           // Execute users function
            wait = true;               // Prevent future invocations
            setTimeout(function () {   // After a period of time
                wait = false;          // And allow future invocations
            }, limit||500);
        }
    }
}

var debounce = function(func, wait) {
    var timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.call();
        }, wait || 500);
    };
};


var debounceImm = function(func, wait, immediate) {     //
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if ( !immediate ) {
                func.apply(context, args);
            }
        };
       var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait || 200);
        if ( callNow ) {
            func.apply(context, args);
        }
    };
};

var throttleCount = 0;
function throtttleCallback() {
    document.getElementById('throttle').innerHTML=  throttleCount++;
}
var  nonthrotttleCount=0;
function nonthrotttleCallback() {
    document.getElementById('nonthrottle').innerHTML=  nonthrotttleCount++;
}
document.getElementById('board').addEventListener('mousemove',  throttle(throtttleCallback, 500)); // Allow callback to run at most 1 time per 500ms
document.getElementById('board').addEventListener('mousemove',  nonthrotttleCallback);

var debounceCount=0;
function debounceCallback() {
    document.getElementById('debounce').innerHTML=  debounceCount++;
}
document.getElementById('board').addEventListener('mousemove',  debounce(debounceCallback, 500)); // Allow callback to run after 500ms