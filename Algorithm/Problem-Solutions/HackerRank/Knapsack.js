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
    var testCases = [], caseInput, caseMax, numbers;
    while(lines.length >0){
        var  caseArray =[];
        NKArray = lines.shift().split(' ').map(parse_fun);       // array of count of input numbers(N) and expected sum(K)
        caseInput = NKArray[0];
        caseMax = NKArray[1];
        numbers = lines.shift().split(' ').map(parse_fun).sort(sortNumber);   // input numbers
        
        caseArray.push(caseInput, caseMax,numbers);
        testCases.push(caseArray);
    }

    //console.log('testcases' , testCases);
    var output=[];
    function removeDuplicates(arr) {
        var i, out=[], obj={};

        for (i=0;i<arr.length;i++) {
            obj[arr[i]]=0;
        }
        for (i in obj) {
            out.push(i);
        }
        return out;
    }

    for(var i = 0; i<testCases.length;i++){
        var testCase = testCases[i];
        caseInput = testCase[0];
        caseMax = testCase[1];
        //numbers = removeDuplicates(testCase[2]);
        numbers = testCase[2];
        var maxTable = new Array(caseMax+1);
        maxTable.fill(0);
        //var min = Array.from(Array(sum+1).keys());
        for(var s =1; s<=caseMax ; s++){
            for(var n =1; n<=numbers.length ; n++) {
             //   console.log(s, n, numbers[n-1], maxTable[s], numbers[n-1] );
                if(numbers[n-1] <=s){
                    maxTable[s] = Math.max(maxTable[s], maxTable[s -  numbers[n-1]] +  numbers[n-1]);
                }

            }
        }

    //    console.log(testCase, testCase.length, caseMax );
        console.log(maxTable);
        output.push(maxTable[caseMax]);
    }

    console.log(output.join('\n'));
//  for(i=0; i<T; i++){
//        console.log( getCloseExpectedSum(numberArray[i], NKArray[i][1]));
//    }

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
var _input = "";
process.stdin.on("data", function (input) { _input += input; });
process.stdin.on("end", function () { processData(_input); });