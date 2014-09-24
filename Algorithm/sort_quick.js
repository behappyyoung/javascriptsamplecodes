/**
 * Quick sort algorithm.
 */

var processText ='';
var processCount = 0;

function bubbleSort(){


}

window.onload = function(){
    var inputarray = [3, 2, 11,5,6,7,8,9,1,4,10 ];
    var resultText = 'input Array : '+ inputarray.toString();
    var resultarray =  bubbleSort(inputarray);

    resultText += '<br /> sorted Array : '+ resultarray;
    processText = '<br /> process :  <br />' + processText;
    document.getElementById('result').innerHTML = resultText + processText;
};
