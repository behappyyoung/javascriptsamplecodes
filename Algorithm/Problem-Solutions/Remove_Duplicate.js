function removeDuplicates(arr) {
    var i,
        len=arr.length,
        out=[],
        obj={};

    for (i=0;i<len;i++) {
        obj[arr[i]]=0;
    }
    for (i in obj) {
        out.push(i);
    }
    return out;
}

var displayText = '<br /> ';
var myarr = ['ee', 'rr', 'tt', 'tt', 'yy'];
displayText += 'original : ' + myarr.toString() + '<br />';
var result = removeDuplicates(myarr);
displayText += 'result : ' + result.toString() + '<br />';
var myarr2 = [1, 4, 6, 88, 99, 6, 6, 4];
displayText += 'original : ' + myarr2.toString() + '<br />';
var result2 = removeDuplicates(myarr2);
displayText += 'result : ' + result2.toString() + '<br />';
document.getElementById('display').innerHTML = displayText;
