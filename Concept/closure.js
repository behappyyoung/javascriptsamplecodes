function foo() {
  var tmp = 3;
  return function () {
    return ++tmp;
  };
}
var bar = foo(); // bar is now a closure.

document.write(bar()+'<br />');

document.write(bar()+'<br />');



function foo2(x) {
  var tmp = 3;
  return function (y) {
    return x + y + (++tmp);
  };
}
var bar = foo2(2); // bar is now a closure.
var test = bar(10);

document.write(test+'<br />');

var test2 = bar(10);

document.write(test2+'<br />');