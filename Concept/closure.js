

function foo() {
  var tmp = 3;
  return function () {
    return ++tmp;
  };
}
var bar = foo(); // bar is now a closure.

document.write('bar : ' + bar+'<br />');
document.write('bar() : ' +bar()+'<br />');
document.write('bar() : ' +bar()+'<br />');



function foo2(x) {
  var tmp = 3;
  return function (y) {
    return x + y + (++tmp);
  };
}
var bar2 = foo2(2); // bar is now a closure.


document.write('bar2 : ' +bar2+'<br />');
document.write('bar2(10) : ' +bar2(10)+'<br />');
document.write('bar2(10) : ' +bar2(10)+'<br />');