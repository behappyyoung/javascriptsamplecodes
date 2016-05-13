/**
 * Created by youngsug on 5/12/2016.
 */
/**
 * Created by youngsug on 5/11/2016.
 */

function processData(input) {
    //Enter your code here
    var inputArray = input.split(' ');
    console.log(inputArray);
    var testCase = parseInt(inputArray[inputArray.length-1]);
    var output='', temp='';
    for(var i=1; i<=testCase;i++){
        for(var j=testCase-i;j<i;j++){
            temp += ' ';
        }
        for(var k=1;k<=i;k++){
            temp += '#';
        }
            output += temp;
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

