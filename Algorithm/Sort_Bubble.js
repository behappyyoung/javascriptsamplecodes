/**
 * Bubble sort algorithm.
 */

var processText ='';
var processCount = 0;

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
                processText += '<br /> step '+(processCount++)+' - swap  :   ' + preArray[i-1] +  ' ... ' + preArray[i] + ' /  new array => ' + preArray + '<br />';
            }else{
                processText += '<br /> step '+(processCount++)+' - no swap  :   ' + preArray[i-1] +  ' ... ' + preArray[i] + ' /  array => ' + preArray + '<br />';
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
