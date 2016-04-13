/////// This keyword test /////////////////////
var fullname = 'John Doe';
var obj = {
    fullname: 'Young Park',
    getFullname: function() {
            return this.fullname;
    }
};



var test = obj.getFullname;
var test2 = obj.getFullname.bind(obj);

document.write('obj.getFullname() =>' + obj.getFullname() + '<br />');
document.write('obj.fullname => ' + obj.fullname + '<br />');
document.write('var test = obj.getFullname;  <br /> test() => '+test() + '<br />');
document.write('var test2 = obj.getFullname.bind(obj); // bind to obj <br /> test2() => '+test2() + '<br />');