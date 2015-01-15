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


