var processText ='';
var processCount = 0;
function  quickSort(arr, left, right) {
    var i = left;
    var j = right;
    var swapl, swapr;
    pivotidx = (left + right) / 2;
    var pivotval = parseInt(arr[pivotidx.toFixed()]);
    processText += '<br /> ' + arr.toString() +' / left : right  => '+left +' : '+ right+' /  pivot : ' + pivotval + '<br />';
    /* partition */
    while (i <= j) {
        while (parseInt(arr[i]) < pivotval)
            i++;
        while (parseInt(arr[j]) > pivotval)
            j--;
        if (i <= j) {                   // swap
            swapl = arr[i];
            swapr = arr[j];
            arr[i] = swapr;
            arr[j] = swapl;
            i++;
            j--;
            processText += '<br /> '+(processCount++)+' swap l, r  :   ' + swapl +  ' ... ' + swapr + ' /  new array => ' + arr.toString() + '<br />';
        }
    }

    /* recursion */
    if (left < j){
        quickSort(arr, left, j);
    }
    if (i < right){
        quickSort(arr, i, right);
    }
    return arr;
}


window.onload = function(){

var inputarray = [3, 2, 11,5,6,7,8,9,1,4,10 ];
var resultText = 'input Array : '+ inputarray.toString();
var resultarray =  quickSort(inputarray, 0, inputarray.length -1);

resultText += '<br /> sorted Array : '+ resultarray;
processText = '<br /> process :  <br />' + processText;
document.getElementById('result').innerHTML = resultText + processText;
};
