function boo() {
    this.tmp = 3;
    var tmp2 = 3;
    this.gettmp = function(){
        return ++(this.tmp);
    }
    this.gettmp2 = function(){
        return ++tmp2;
    }

}
var bar = new boo();

document.write(bar.tmp+'<br />');
document.write(bar.gettmp()+'<br />');


document.write(bar.tmp2+'<br />');
document.write(bar.gettmp2()+'<br />');

document.write(bar.tmp+'<br />');
document.write(bar.gettmp()+'<br />');


document.write(bar.tmp2+'<br />');
document.write(bar.gettmp2()+'<br />');
