/*
// Allow callback to run at most 1 time per 100ms
window.addEventListener("resize", throttle(callback, 100));
// Allow callback to run on each resize event
window.addEventListener("resize", callback2);

function callback ()  { console.count("Throttled");     }
function callback2 () { console.count("Not Throttled"); }
*/

function throttle (callback, limit) {
    var noWait = true;                  // Initially, we're not waiting
    return function () {               // We return a throttled function
        if (noWait) {                   // If we're not waiting
            callback.call();           // Execute users function
            noWait = false;               // Prevent future invocations
            setTimeout(function () {   // After a period of time
                noWait = true;          // And allow future invocations
            }, limit||500);
        }
    }
}

var debounce = function(func, wait) {
    var timeout;
    return function() {
        clearTimeout(timeout);                      // keep killing prev if there is an event..
        timeout = setTimeout(function() {           // put current one..    => will fire if there is no event
            func.call();
        }, wait || 500);
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

var debounceCount=0;
function debounceCallback() {
    document.getElementById('debounce').innerHTML=  debounceCount++;
}

document.getElementById('board').addEventListener('mousemove',  throttle(throtttleCallback, 1000)); // Allow callback to run at most 1 time per 1000ms
document.getElementById('board').addEventListener('mousemove',  nonthrotttleCallback);
document.getElementById('board').addEventListener('mousemove',  debounce(debounceCallback, 500)); // Allow callback to run after 500ms

function throtttleInputCallback() {
    var text = document.getElementById('throttle-input').innerHTML;
    document.getElementById('throttle-input').innerHTML = text +' / '+ document.getElementById('inputText').value;
}

function nonthrotttleInputCallback() {
    var text = document.getElementById('nonthrottle-input').innerHTML;
    document.getElementById('nonthrottle-input').innerHTML = text +' / '+ document.getElementById('inputText').value;
}

function debounceInputCallback() {
    var text = document.getElementById('debounce-input').innerHTML;
    document.getElementById('debounce-input').innerHTML = text +' / '+ document.getElementById('inputText').value;
}

document.getElementById('inputText').addEventListener('keyup',  throttle(throtttleInputCallback, 1000)); // Allow callback to run at most 1 time per 1000ms
document.getElementById('inputText').addEventListener('keyup',  nonthrotttleInputCallback);
document.getElementById('inputText').addEventListener('keyup',  debounce(debounceInputCallback, 500)); // Allow callback to run after 500ms