'use strict';



function processData(input) {
    var parse_fun = function (s) {
        return parseInt(s, 10);
    };

    var lines = input.split('\n');
    var NK = lines.shift().split(' ');                       // Testing Numbers and  difference
    var N = parseInt(NK.shift());
    var K = parseInt(NK.shift());
    var numberArray = lines.shift().split(' ').splice(0, N).map(parse_fun);
    var count = 0;

        for(var i=0; i<N-1; i++){
            for(var j=i+1; j<N; j++){
                if(Math.abs(numberArray[i]-numberArray[j]) == K){
                    count++;
                }
            }
        }
    console.log(count);
}

function processDatawithSort(input) {                   // faster & save time  if N is really Big
    var parse_fun = function (s) {
        return parseInt(s, 10);
    };

    var sortNumber = function(a, b){
        return a -b ;
    };

    var lines = input.split('\n');
    var NK = lines.shift().split(' ');                       // Testing Numbers and  difference
    var N = parseInt(NK.shift());
    var K = parseInt(NK.shift());
    var numberArray = lines.shift().split(' ').splice(0, N).map(parse_fun).sort(sortNumber);
    console.log(numberArray);
    var count = 0;
    var diff;
    for(var i=0; i<N-1; i++){
        for(var j=i+1; j<N; j++){
            diff = Math.abs(numberArray[i]-numberArray[j]);
            if( diff == K){
                count++;
            }else if(diff > K){
                break;
            }
        }
    }
    console.log(count);
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
var _input = "";
process.stdin.on("data", function (input) { _input += input; });
process.stdin.on("end", function () { processDatawithSort(_input); });