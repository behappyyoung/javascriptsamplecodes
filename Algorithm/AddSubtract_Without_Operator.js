/**
 * Created by youngsug on 5/14/2016.
 */
myAdd = function(a , b){
    if(b===0) return a;
    var sum = a^b;
    var carry = (a&b)<<1;
    return myAdd(sum, carry);
}

console.log('myAdd(5, 5) =>' + myAdd(5, 5));
console.log('myAdd(7, 3) =>' + myAdd(7, 3));
console.log('myAdd(555, 555) =>' + myAdd(555, 555));
console.log('myAdd(337, 99) =>' + myAdd(337, 99));
console.log('myAdd(5, -5) =>' + myAdd(5, -5));
console.log('myAdd(-7, 3) =>' + myAdd(-7, 3));
console.log('myAdd(555, -555) =>' + myAdd(555, -555));
console.log('myAdd(337, -99) =>' + myAdd(337, -99));


mySub = function(a , b){
    if(b===0) return a;
    var sub = a^b;
    var borrow = ((~a)&b)<<1;
    return mySub(sub, borrow);
}

console.log('mySub(5, 5) =>' + mySub(5, 5));
console.log('mySub(7, 3) =>' + mySub(7, 3));
console.log('mySub(555, 555) =>' + mySub(555, 555));
console.log('mySub(337, 99) =>' + mySub(337, 99));
console.log('mySub(5, -5) =>' + mySub(5, -5));
console.log('mySub(-7, 3) =>' + mySub(-7, 3));
console.log('mySub(555, -555) =>' + mySub(555, -555));
console.log('mySub(337, -99) =>' + mySub(337, -99));

