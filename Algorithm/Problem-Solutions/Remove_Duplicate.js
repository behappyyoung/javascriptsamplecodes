function removeDuplicates(arr) {
    var i, out=[], obj={};

    for (i=0;i<arr.length;i++) {
        obj[arr[i]]=0;
    }
    for (i in obj) {
        out.push(i);
    }
    return out;
}

//////////////// display /////////////////////
var displayText = '<br /> ';
var myarr = ['ee', 'rr', 'tt', 'tt', 'yy'];
displayText += 'original : ' + myarr + '<br />';
var result = removeDuplicates(myarr);
displayText += 'result : ' + result + '<br />';
var myarr2 = [1, 4, 6, 88, 99, 6, 6, 4];
displayText += 'original : ' + myarr2+ '<br />';
var result2 = removeDuplicates(myarr2);
displayText += 'result : ' + result2 + '<br />';
document.getElementById('display').innerHTML = displayText;
