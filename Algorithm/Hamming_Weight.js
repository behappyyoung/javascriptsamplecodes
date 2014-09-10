

var hff = 0xffffffff; //binary: all ones
var h01 = 0x01010101; //the sum of 256 to the power of 0,1,2,3...

var tbl16 = new Uint8Array(0xffff+1);
var tbl16_packed = new Uint8Array((0xffff>>>1)+1);

/* upto 32 bits */
function popcount_32(x) {
    resultText += ' popcount === <br />';
    var m1  = 0x55555555; //binary: 0101...
    var m2  = 0x33333333; //binary: 00110011..
    var m4  = 0x0f0f0f0f; //binary:  4 zeros,  4 ones ...
    var m8  = 0x00ff00ff; //binary:  8 zeros,  8 ones ...
    var m16 = 0x0000ffff; //binary: 16 zeros, 16 ones ...
    x = (x & m1 ) + ((x >>  1) & m1 ); //put count of each  2 bits into those  2 bits
    resultText += 'x = (x & m1 ) + ((x >>  1) & m1 ); => ' +  x.toString(2) + '<br />';
    x = (x & m2 ) + ((x >>  2) & m2 ); //put count of each  4 bits into those  4 bits
    resultText += 'x = (x & m2 ) + ((x >>  1) & m2 ); => ' +  x.toString(2) + '<br />';
    x = (x & m4 ) + ((x >>  4) & m4 ); //put count of each  8 bits into those  8 bits
    resultText += 'x = (x & m4 ) + ((x >>  1) & m4 ); => ' +  x.toString(2) + '<br />';
    x = (x & m8 ) + ((x >>  8) & m8 ); //put count of each 16 bits into those 16 bits
    resultText += 'x = (x & m8 ) + ((x >>  1) & m8 ); => ' +  x.toString(2) + '<br />';
    x = (x & m16) + ((x >> 16) & m16); //put count of each 32 bits into those 32 bits
    resultText += 'x = (x & m16 ) + ((x >>  1) & m16 ); => ' +  x.toString(2) + '<br />';
    return x;
}

/* remove 1's  each time and count  */
function shiftroop(x){
    resultText += ' shiftroop [ remove 1 and count ] ===  <br />';
    var count;
    for (count=1; x; count++){
        x &= x-1;
        resultText += ' count : ' + count +' - x : '+ x.toString(2) +'<br />';
    }

    return count;
}

/* 64 bits not working with javascript ...
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators */
function popcount_64(x) {
    var m1  = 0x5555555555555555; //binary: 0101...
    var m2  = 0x3333333333333333; //binary: 00110011..
    var m4  = 0x0f0f0f0f0f0f0f0f; //binary:  4 zeros,  4 ones ...
    var m8  = 0x00ff00ff00ff00ff; //binary:  8 zeros,  8 ones ...
    var m16 = 0x0000ffff0000ffff; //binary: 16 zeros, 16 ones ...
    var m32 = 0x00000000ffffffff; //binary: 32 zeros, 32 ones ....
    x = (x & m1 ) + ((x >>  1) & m1 ); //put count of each  2 bits into those  2 bits
    resultText += 'x = (x & m1 ) + ((x >>  1) & m1 ); => ' +  x.toString(2) + '<br />';
    x = (x & m2 ) + ((x >>  2) & m2 ); //put count of each  4 bits into those  4 bits
    resultText += 'x = (x & m2 ) + ((x >>  1) & m2 ); => ' +  x.toString(2) + '<br />';
    x = (x & m4 ) + ((x >>  4) & m4 ); //put count of each  8 bits into those  8 bits
    resultText += 'x = (x & m4 ) + ((x >>  1) & m4 ); => ' +  x.toString(2) + '<br />';
    x = (x & m8 ) + ((x >>  8) & m8 ); //put count of each 16 bits into those 16 bits
    resultText += 'x = (x & m8 ) + ((x >>  1) & m8 ); => ' +  x.toString(2) + '<br />';
    x = (x & m16) + ((x >> 16) & m16); //put count of each 32 bits into those 32 bits
    resultText += 'x = (x & m16 ) + ((x >>  1) & m16 ); => ' +  x.toString(2) + '<br />';
    x = (x & m32) + ((x >> 32) & m32); //put count of each 64 bits into those 64 bits
    resultText += 'x = (x & m32 ) + ((x >>  1) & m32 ); => ' +  x.toString(2) + '<br />';
    return x;
}


function popcount_8(x) {
    var m1  = 0x55555555; //binary: 0101...
    var m2  = 0x33333333; //binary: 00110011..
    var m4  = 0x0f0f0f0f; //binary:  4 zeros,  4 ones ...
    x = (x & m1 ) + ((x >>  1) & m1 ); //put count of each  2 bits into those  2 bits
    x = (x & m2 ) + ((x >>  2) & m2 ); //put count of each  4 bits into those  4 bits
    x = (x & m4 ) + ((x >>  4) & m4 ); //put count of each  8 bits into those  8 bits
    return x;
}


var resultText = '<br /><br />';

var result = 0;
var testintArray = [1 , 32, 55 ,5645646, 59445959, 2147483647, 68719476735];

for(var i=0; i<testintArray.length; i++){
    resultText += 'test int : ' + testintArray[i] + ' == ' + testintArray[i].toString(2) + '<br /><br />';
    if(testintArray[i] > 2147483647){
        result = shiftroop(testintArray[i]);
    }else{
        result = shiftroop(testintArray[i]);
        result = popcount_32(testintArray[i]);
    }
    resultText += ' - Hamming Weight : ' + result + '<br /><br />';
}


var testString = 'Young Park';
resultText += ' Test String  : ' + testString + '<br />';
var total = 0;
for(var i=0; i<testString.length; i++){
    resultText += 'test character : ' + testString.charAt(i) + ' == ' + testString.charCodeAt(i) + ' [ ' + parseInt(testString.charCodeAt(i)).toString(2)+ ' ] ';
    result = popcount_8( testString.charCodeAt(i));
    resultText += ' - Hamming Weight : ' + result + '<br />';
    total += result;

}

resultText += '  => total Hamming Weight : ' + total ;


document.getElementById('display').innerHTML = resultText;