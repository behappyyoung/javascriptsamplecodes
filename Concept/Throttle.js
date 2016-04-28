// Allow callback to run at most 1 time per 100ms
window.addEventListener("resize", throttle(callback, 100));
// Allow callback to run on each resize event
window.addEventListener("resize", callback2);

function callback ()  { console.count("Throttled");     }
function callback2 () { console.count("Not Throttled"); }

function throttle (callback, limit) {
    var wait = false;                  // Initially, we're not waiting
    return function () {               // We return a throttled function
        if (!wait) {                   // If we're not waiting
            callback.call();           // Execute users function
            wait = true;               // Prevent future invocations
            setTimeout(function () {   // After a period of time
                wait = false;          // And allow future invocations
            }, limit);
        }
    }
}