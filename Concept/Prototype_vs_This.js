/**
 * Created by youngsug on 5/15/2016.
 */
function ClassPro() {}
ClassPro.prototype.calc = function (a, b) {
    return a + b;
};

function ClassThis () {
    this.calc = function (a, b) {
        return a + b;
    };
}



var ins1 = new ClassPro(),
    ins2 = new ClassPro();

var ins3 = new ClassThis(),
    ins4 = new ClassThis();


console.log(ins1.calc(1,1), ins2.calc(1,1)); // -> 2, 2
console.log(ins3.calc(1,1), ins4.calc(1,1)); // -> 2, 2

// Change the prototype method
ClassPro.prototype.calc = function () {
    var args = Array.prototype.slice.apply(arguments),
        res = 0, c;
    c = args.shift();
    while (c){
        res += parseInt(c);
        c = args.shift();
    }
    return res;
};
// cannot change calc it is adding same function.. need to create new function.
ClassThis.prototype.calc = function () {
    var args = Array.prototype.slice.apply(arguments),
        res = 0, c;
    c = args.shift();
    while (c){
        res += parseInt(c);
        c = args.shift();
    }
    return res;
};
//console.log(ClassThis);     //
//console.log(ClassThis.prototype.calc);     //

ClassThis.prototype.calc2 = function () {
    var args = Array.prototype.slice.apply(arguments),
        res = 0, c;
    c = args.shift();
    while (c){
        res += parseInt(c);
        c = args.shift();
    }
    return res;
};
//console.log(ClassPro.prototype);

console.log(ins1.calc(1,1,1), ins2.calc(1,1,1));            // updated function ->3, 3
console.log(ins3.calc(1,1,1), ins4.calc(1,1,1));            // original ->2, 2
console.log(ins3.calc2(1,1,1), ins4.calc2(1,1,1));          // new function -> 3, 3