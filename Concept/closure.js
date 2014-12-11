

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

function multiple(x) {
    return function(y) {
        return y * x;
    };
}

var mul10 = multiple(10);
var mul5 = multiple(5);
var mul100 = multiple(100);


document.write('mul5(10) : ' +mul5(10)+'<br />');
document.write('mul10(10) : ' +mul10(10)+'<br />');
document.write('mul100(10) : ' +mul100(10)+'<br />');

