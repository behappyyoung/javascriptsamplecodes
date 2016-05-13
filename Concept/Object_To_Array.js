var myobject ={ // array-like collection
    length: 4,
    '0': 'zero',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    'test':'test'
};


var myarray = Array.prototype.slice.call(myobject); // returns myobject as a true array: ["zero", "one", "two", "three"]
var myarray2 = Array.prototype.slice.call(myobject, 1) ;// returns ["one", "two", "three"]
var myarray3 = [].slice.call(myobject); // returns myobject as a true array: ["zero", "one", "two", "three"]

// every thing to array
var myarray4 = Object.keys(myobject).map(function (key) {return myobject[key]}); // returns ["zero", "one", "two", "three", 4, "test"]



console.log(myarray, myarray2, myarray3, myarray4);