/////// global , local scope test /////////////////////
var a = b = 3;

(function() {
    var a = b = 5;      // a : local,  b : global
})();

document.write(' a : '  + a + '<br />');
document.write(' b : ' + b+ '<br />');

/////////////// function scope access test ///////////////////////
function boo() {
    this.tmp = 3;                   // can access from outside
    var tmp2 = 3;                   // internal
    gtemp = 4;                      // global
    this.gettmp = function(){
        return ++(this.tmp);
    }
    this.gettmp2 = function(){
        return ++tmp2;
    }
    var gettmp3 = function(){    // internal
        return this.tmp;
    }
    this.getgtemp = function(){
        return ++gtemp;
    }
}
var bar = new boo();

document.write('bar.tmp ==> '+bar.tmp+'<br />');
document.write('bar.gettmp ==> ' + bar.gettmp+'<br />');
document.write('bar.gettmp() ==> '+bar.gettmp()+'<br />');


document.write('bar.tmp2 ==> '+bar.tmp2+'<br />');
document.write('bar.gettmp2 ==> ' + bar.gettmp2+'<br />');
document.write('bar.gettmp2() ==> '+bar.gettmp2()+'<br />');


document.write('bar.gettmp3 ==> ' + bar.gettmp3+'<br />');


document.write('gtemp ==> '+gtemp+'<br />');
document.write('bar.getgtemp ==> ' + bar.getgtemp+'<br />');
document.write('bar.getgtemp() ==> '+bar.getgtemp()+'<br />');


var myObject = {
    foo: "bar",
    func: function() {
        var self = this;
        console.log("outer func:  this.foo = " + this.foo);
        console.log("outer func:  self.foo = " + self.foo);
        (function() {
            console.log("inner func:  this.foo = " + this.foo);
            console.log("inner func:  self.foo = " + self.foo);
        }());
    }
};
myObject.func();