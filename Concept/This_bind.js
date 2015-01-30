
x = 9;
var module = {
    x: 81,
    getX: function() { return this.x; }
};

document.write('module.getX();  =>' + module.getX()  + '<br />');// 81

var getX = module.getX;

document.write('getX();  => ' + getX()  + ' //  because in this case, "this" refers to the global object <br />');


// Create a new function with 'this' bound to module
var boundGetX = getX.bind(module);

document.write('boundGetX(); => '+boundGetX() + '<br />'); // 81





