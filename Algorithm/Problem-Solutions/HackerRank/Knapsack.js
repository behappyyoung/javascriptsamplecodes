'use strict';

function processData(input) {
    var parse_fun = function (s) {
        return parseInt(s, 10);
    };
    var sortNumber = function(a, b){
        return a -b ;
    };

    var lines = input.split('\n');
console.log(lines);
    var T = parseInt(lines.shift());                                            // Testing cases
    var NKArray = [], N;                                // array of count of input numbers(N) and expected sum(K)
    var totalSumArray=[];
    var testCases = [], caseInput, caseMax, numbers, caseArray =[];
    for(var i=0; i<T; i++){
        NKArray = lines.shift().split(' ').map(parse_fun);       // array of count of input numbers(N) and expected sum(K)
        caseInput = NKArray[0];
        caseMax = NKArray[1];
        numbers = lines.shift().split(' ').map(parse_fun).sort(sortNumber);   // input numbers
        
        caseArray.push(caseInput, caseMax,numbers);
        testCases.push(caseArray);
    }

    console.log(testCases);
    for(i = 0; i<testCases.length;i++){
        var testCase = testCases[i];
        caseInput = testCase[0];
        caseMax = testCase[1];
        numbers = testCase[2];
        var maxTable=[];
        for(var n=0; n<=numbers.length; n++){               // init
            maxTable[n] = [];
            for ( var m=0; m<=caseMax; m++)
                maxTable[n][m] = 0;
        }

        for(n=1; n<=numbers.length; n++){               // init
            
            for(m=1; m<=caseMax;m++) {
                if( n==0 || m==0){
                    maxTable[n][m] = 0;
                }else if(numbers[n-1] <= m){
                    maxTable[n][m] = Math.max(maxTable[n-1][m], numbers[n-1]+maxTable[n-1][m-numbers[n-1]]);
                }else{
                    maxTable[n][m] = maxTable[n-1][m];
                }
            }
        }
        console.log(testCase, testCase.length, caseMax );
        console.log(maxTable);
    }

//  for(i=0; i<T; i++){
//        console.log( getCloseExpectedSum(numberArray[i], NKArray[i][1]));
//    }

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
var _input = "";
process.stdin.on("data", function (input) { _input += input; });
process.stdin.on("end", function () { processData(_input); });