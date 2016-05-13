'use strict';

function processData(input) {
    var parse_fun = function (s) {
        return parseInt(s, 10);
    };
    var sortNumber = function(a, b){
        return a -b ;
    };

    var lines = input.split('\n');
    var T = parseInt(lines.shift());                                            // Testing cases
    var NArray = [];                 // array of count of input numbers
    var numberArray =[];
    for(var i=0; i<T; i++){
        NArray[i] = parseInt(lines.shift());                                           // count of input numbers
        numberArray[i] = lines.shift().split(' ').splice(0, NArray[i]).map(parse_fun);   // input numbers
    }

    var getContSum = function(currentArray){
        var length = currentArray.length;
        var max = currentArray[0];
        var cursum = 0;
        for(var i=0; i<length;i++){
            cursum = currentArray[i];
            max = (cursum>max)? cursum : max;
            if(cursum > 0){
                for(var j = i+1; j<length;j++){
                    cursum += currentArray[j];
                    if(cursum<0) break;
                    max = (cursum>max)? cursum : max;
                }
            }
        }
        return max;
    };

    var getNonContSumwithSort = function(currentArray){
        var length = currentArray.length;
        currentArray.sort(sortNumber);
        var max = currentArray[length-1];
        for(var i=length-2; i >=0;i--){
            if(currentArray[i]>0){
                max += currentArray[i];
            }
        }
        return max;
    };

    for(i=0; i<T; i++){
        console.log( getContSum(numberArray[i]) + ' ' + getNonContSumwithSort(numberArray[i]));
    }
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
var _input = "";
process.stdin.on("data", function (input) { _input += input; });
process.stdin.on("end", function () { processData(_input); });