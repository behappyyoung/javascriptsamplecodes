/////// This keyword test /////////////////////
var fullname = 'John Doe';
var obj = {
    fullname: 'Young Park',
    prop: {
        fullname: 'in prop young',
        getFullname: function() {
            return this.fullname;
        }
    }
};



var test = obj.prop.getFullname;
var test2 = obj.prop.getFullname.bind(obj);

document.write('obj.prop.getFullname() =>' + obj.prop.getFullname() + '<br />');
document.write('obj.fullname => ' + obj.fullname + '<br />');
document.write('var test = obj.prop.getFullname;  <br /> test() => '+test() + '<br />');
document.write('var test2 = obj.prop.getFullname.bind(obj); // bind to obj <br /> test2() => '+test2() + '<br />');