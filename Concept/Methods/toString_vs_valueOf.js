var x = {
    toString: function () { return "foo"; },
    valueOf: function () { return 42; }
};

console.log(x);
console.log(x.toString());
console.log(x.valueOf());

console.log("x=" + x); // "x=42"
console.log(x + "=x"); // "42=x"
console.log(x + "1"); // 421
console.log(x + 1); // 43
console.log(["x=", x].join("")); // "x=foo"

var y = ['a', 'b', 'c'];

console.log(y, typeof y);
console.log('y'+y);
console.log(typeof y.toString(),  y.toString());
console.log('ystring' + y.toString());
console.log(typeof y.valueOf(), y.valueOf());
console.log('yvalue'+ y.valueOf());