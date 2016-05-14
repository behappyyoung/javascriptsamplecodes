/**
 * Created by youngsug on 5/13/2016.
 */

var a ={one:'one',two: 'two'};


console.log(a); //{ one: 'one', two: 'two' }
console.log(Object.keys(a)); // ["one", "two"]
console.log(Object.getOwnPropertyNames(a)); // ["one", "two"]

Object.defineProperties(a, {
    one: {enumerable: true},
    two: {enumerable: false}
});

console.log(a);//{ one: 'one' }
console.log(Object.keys(a)); // ["one"]
console.log(Object.getOwnPropertyNames(a)); // ["one", "two"]


