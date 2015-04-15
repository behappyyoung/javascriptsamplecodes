/**
 * Created by young on 4/15/15.
 */

function myf() {
    // static variable f.count
    myf.count = ++myf.count || 1;      // f.count is undefined at first
    //arguments.callee.count = ++arguments.callee.count || 1;      // Same as above
    this.count = ++this.count || 1;      // function variable
    var pcount = pcount || 1;      // private variable
}


// adding new method
myf.prototype.showCount = function(){
    console.log(myf.count);
};

// create static method
myf.showCount = function(){
    console.log(myf.count);
};

var displayText ='';

myf(); // Call No 1

displayText += 'myf() => myf.count : ' + myf.count + '<br />';

myf(); // Call No 2
displayText += 'myf() => myf.count : ' + myf.count + '<br />';

myf.showCount();

//displayText += 'myf.showCount() : ' + myf.showCount() + '<br />';

var x = new myf();

displayText += ' x.count : ' + x.count + '<br />';

displayText += ' myf.count : ' + myf.count + '<br />';


x.showCount();

displayText += ' x.pcount : ' + x.pcount + '<br />';
displayText += ' my.pcount : ' + myf.pcount + '<br />';

document.getElementById('display').innerHTML = displayText;
