/**
 * Created by youngsug on 5/11/2016.
 */

function processData(input) {
    //Enter your code here
    var inputArray = input.split('\n');
    console.log(inputArray);
    var testCase = parseInt(inputArray[0]);
    var output = '\n', cNumbersize, cNumbers, curXor, totalXor;
    function getXor(arr){
        var cXor = arr[0];
        var tXor = cXor;
        for(var i=1; i<arr.length; i++){
            cXor = cXor^arr[i];
            tXor = cXor^tXor;
        }
        return tXor;
    }
    for(var t=1; t<=testCase;t++){
        cNumbersize = inputArray[2*t-1];
        cNumbers = inputArray[2*t].split(' ');
        curXor = getXor(cNumbers);
        totalXor= curXor;
        for(var i=1; i<cNumbersize;i++) {
            curXor = getXor(cNumbers.slice(i));
            totalXor = totalXor^curXor;
        }
        output += totalXor + '\n';
    }

    console.log(output);

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;

    if(input.match(';')){
        console.log(_input);
        processData(_input.slice(0, _input.indexOf(';')));
        _input = '';
    }

});

process.stdin.on("end", function () {
    processData(_input);
});

