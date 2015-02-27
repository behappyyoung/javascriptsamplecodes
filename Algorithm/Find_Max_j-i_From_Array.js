/**
 * Created by young on 2/27/15.
 */


function firstSolution(myArray){
    var step=0;
    var max = 0;
    for(var i=0; i< myArray.length-1; i++){
        for(var j=myArray.length-1; j > i ; j--){
            var inmax = myArray[j]-myArray[i];
            max = (max < inmax)? inmax : max;
            printText += ++step + '/' + myArray[j] +'-' +myArray[i] +' :'+max + '<br />';
        }
    }
    return max;
}

function secondSolution(myArray){

    var length = myArray.length;
    var max= 0, step=0;
    //create min array
    var MinArray=[];
    MinArray[0] = myArray[0];
    for(var i=1; i<length; i++){
        MinArray[i] = (myArray[i] < MinArray[i-1])? myArray[i] : MinArray[i-1];
        printText += ++step + ' / ';
    }

    //create max array
    var MaxArray=[];

    MaxArray[length-1] = myArray[length-1];
    for(var j= length-2; j >= 0 ; j--){
        MaxArray[j] = (myArray[j] > MaxArray[j+1])? myArray[j] : MaxArray[j+1];
        printText += ++step + '/ ';
    }

    for(i=0; i<length; i++){
        var inmax = MaxArray[i]-MinArray[i];
        max = (max < inmax)? inmax : max;
        printText += ++step + '/ ';
    }

    printText += '<br /> MinArray : '+ MinArray.toString() +' /  MaxArray : ' + MaxArray.toString()+ '<br />';

    return max;

}

var testArray = [4, 50, 10, 30, 7, 8, 1, 44, 9, 15, 20];
var printText=' Test Array : [ ' + testArray.toString() + ' ]<br /> steps : <br />';
var result = firstSolution(testArray);

document.getElementById('solution1').innerHTML = printText + ' result : ' + result;

printText=' Test Array : [ ' + testArray.toString() + ' ]<br /> steps : <br />';
result = secondSolution(testArray);

document.getElementById('solution2').innerHTML = printText + ' result : ' + result;