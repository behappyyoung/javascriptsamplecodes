/* upto 32 bits */
var m1  = 0x55555555; //binary: 0101...
var m2  = 0x33333333; //binary: 00110011..
var m4  = 0x0f0f0f0f; //binary:  4 zeros,  4 ones ...
var m8  = 0x00ff00ff; //binary:  8 zeros,  8 ones ...
var m16 = 0x0000ffff; //binary: 16 zeros, 16 ones ...
var hff = 0xffffffff; //binary: all ones
var h01 = 0x01010101; //the sum of 256 to the power of 0,1,2,3...

var tbl16 = new Uint8Array(0xffff+1);
var tbl16_packed = new Uint8Array((0xffff>>>1)+1);


function popcount_1(x) {
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
    /* for 64 bit systems =========
    x = (x & m32) + ((x >> 32) & m32); //put count of each 64 bits into those 64 bits
    resultText += 'x = (x & m32 ) + ((x >>  1) & m32 ); => ' +  x.toString(2) + '<br />';
    ============== */
    return x;
}
var resultText = '/* upto  32 bits */<br /> var m1  = 0x55555555; //binary: .. ' + parseInt('0x55555555').toString(2)+
    '<br /> var m2  = 0x33333333; //binary: 00110011..' + parseInt('0x33333333').toString(2)+
    '<br /> var m4  = 0x0f0f0f0f; //binary:  4 zeros,  4 ones ...' + parseInt('0x0f0f0f0f').toString(2)+
    '<br />var m8  = 0x00ff00ff; //binary:  8 zeros,  8 ones ...' + parseInt('0x00ff00ff').toString(2)+
    '<br />var m16 = 0x0000ffff; //binary: 16 zeros, 16 ones ... '+ parseInt('0x0000ffff').toString(2)+ '<br /><br />';
var result = 0;
var testintArray = [5645646, 32, 1, 59445959, 2147483647, 1125899906842623];
for(i=0; i<testintArray.length; i++){
    resultText += 'test int : ' + testintArray[i] + ' == ' + testintArray[i].toString(2) + '<br /><br />';
    result = popcount_1(testintArray[i]);
    resultText += ' - Hamming Weight : ' + result + '<br /><br />';

}

document.getElementById('display').innerHTML = resultText;