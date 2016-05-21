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
    var NKArray = [], N;                                // array of count of input numbers(N) and expected sum(K)
    var numberArray =[];
    for(var i=0; i<T; i++){
        NKArray[i] = lines.shift().split(' ').map(parse_fun);       // array of count of input numbers(N) and expected sum(K)
        N =NKArray[i][0];         // input numbers(N)
        numberArray[i] = lines.shift().split(' ').splice(0, N).map(parse_fun).sort(sortNumber);   // input numbers
        //numberArray[i] = lines.shift().split(' ').splice(0, N).map(parse_fun);   // input numbers
    }


    var getCloseExpectedSum = function(currentArray, expected){
console.log(currentArray);
        var length = currentArray.length;
        var bestExpect=0, currentExpect=  expected, currentValue, myexpect = 0, tempbest;
        var subExpect ;
        for(var j=0; j<length; j++) {

            for (var i = j; i < length; i++) {

                currentValue = currentArray[i];
                if(currentValue==currentArray[i-1]){
                    break;
                }else if(currentValue > currentExpect){
                    break;
                }

                subExpect = currentExpect - currentValue;
console.log(i + '/ current value : ' + currentValue + ' / sub :   ' + subExpect + ' / current Ex  ' + currentExpect + ' / ' + expected);

                if (subExpect > 0) {
                    myexpect = getCloseExpectedSum(currentArray, subExpect);
                    //console.log(bestExpect);
                    if (myexpect == subExpect) {
                        return  currentValue + myexpect;
                    } else if(myexpect < subExpect){
                        // update currentExpect
                        tempbest = currentValue + myexpect;
                        currentExpect = currentExpect - myexpect;
                    }
                } else if (subExpect == 0) {
                    tempbest = currentExpect;
                    break;
                }
            }

            bestExpect = (tempbest>bestExpect)? tempbest : bestExpect;
        }

        return bestExpect;
    };

    for(i=0; i<T; i++){
        console.log( getCloseExpectedSum(numberArray[i], NKArray[i][1]));
    }

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
var _input = "";
process.stdin.on("data", function (input) { _input += input; });
process.stdin.on("end", function () { processData(_input); });