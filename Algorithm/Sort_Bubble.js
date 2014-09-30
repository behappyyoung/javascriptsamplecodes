/**
 * Bubble sort algorithm.
 */

var processText ='';
var processCount = 1;

function showArray(preArray, ci, cj){
    var arrayString = preArray.toString();
    console.log(arrayString + ci + cj);
    arrayString = arrayString.replace(ci, '<span style="color:blue;font-weight: bold;">'+ci+'</span>');
    arrayString = arrayString.replace(cj, '<span style="color:red;font-weight: bold;">'+cj+'</span>');
    console.log(arrayString);
    window.arrayString = arrayString;
    return arrayString;
}
function bubbleSort(preArray){
    var length = preArray.length;
    var i, sw;
    var swapped = true;
    while(swapped){
        swapped = false;
        for(i=1; i<length; i++){
            if(preArray[i-1]>preArray[i]){
                sw = preArray[i];
                preArray[i] = preArray[i-1];
                preArray[i-1] = sw;
                swapped = true;
                processText += '<br /> step '+(processCount++)+' - SWAP  :   ' + preArray[i-1] +  ' ... ' + preArray[i] + ' /  new array => ' + showArray(preArray, preArray[i-1], preArray[i]) + '<br />';
            }else{
                processText += '<br /> step '+(processCount++)+' - no swap  :   ' + preArray[i-1] +  ' ... ' + preArray[i] + ' /  array => ' + showArray(preArray, preArray[i-1], preArray[i]) + '<br />';
            }
        }
        length--;
    }
    return preArray;
}

window.onload = function(){
    var inputarray = [3, 2, 11,5,6,7,8,9,1,4,10 ];
    var resultText = 'input Array : '+ inputarray.toString();
    var resultarray =  bubbleSort(inputarray);

    resultText += '<br /> sorted Array : '+ resultarray;
    processText = '<br /> process :  <br />' + processText;
    document.getElementById('result').innerHTML = resultText + processText;
};
