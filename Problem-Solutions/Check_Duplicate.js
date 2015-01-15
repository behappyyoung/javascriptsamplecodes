function checkDuplicates(arr) {
    var i, out=[], obj={};

    for (i=0;i<arr.length;i++) {
        if(obj[arr[i]]==0){
            return true;
        }
        obj[arr[i]]=0;
    }
    return false;
}

//////////////// display /////////////////////
var displayText = '<br /> ';
var myarr = ['ee', 'rr', 'tt', 'tt', 'yy'];
displayText += 'original : ' + myarr + '<br />';
var result = checkDuplicates(myarr);
displayText += 'result : ' + result + '<br />';
var myarr2 = [1, 4, 6, 88, 99];
displayText += 'original : ' + myarr2+ '<br />';
var result2 = checkDuplicates(myarr2);
displayText += 'result : ' + result2 + '<br />';
document.getElementById('display').innerHTML = displayText;
