'use strict';

function processData(input) {
    var parse_fun = function (s) {
        return parseInt(s, 10);
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
        return currentArray.length;
    };

    for(i=0; i<T; i++){
        console.log(getContSum(numberArray[i]));
    }
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
var _input = "";
process.stdin.on("data", function (input) { _input += input; });
process.stdin.on("end", function () { processDatawithSort(_input); });