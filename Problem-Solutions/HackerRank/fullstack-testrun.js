/**
 * Created by youngsug on 5/11/2016.
 */
function processData(input) {
    //Enter your code here

    var inputArray = input.trim().split(' ');
    var newArray=[];

//    console.log(inputArray);
    newArray.push(parseInt(inputArray[0])+1);
    for (var i=1; i<inputArray.length; i++){
           newArray.push(inputArray[i-1]*inputArray[i] + 1);
    }

    console.log(newArray.join(' '));
    return newArray.join(' ');

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
    console.log(input);
    if(input == '\n'){
        processData(_input);
        _input = '';
    }
});

process.stdin.on("end", function () {
    processData(_input);
});