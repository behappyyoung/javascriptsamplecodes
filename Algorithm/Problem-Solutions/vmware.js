/**
 * Created by youngsug on 5/12/2016.
 */
/**
 * Created by youngsug on 5/11/2016.
 */

function processData(input) {
    //Enter your code here
    var inputArray = input.split('\n');
    console.log(inputArray);
    var testCase = parseInt(inputArray[0]);

    
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

