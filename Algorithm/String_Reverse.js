/**
 * Created by young on 2/27/15.
 */
//with array.reverse function
function reverse(s){
    return s.split("").reverse().join("");
}
// without array function
function myReverse(s){
    var news='';
    for(var i= s.length - 1; i>=0;i--){
        console.log(i);
        news += s.charAt(i);
    }
    return news;
}

var testString = 'my test string';
var returnString = reverse(testString);
var returnString2 = myReverse(testString);

document.getElementById('display').innerHTML = testString + '/' + returnString + '/' + returnString2;