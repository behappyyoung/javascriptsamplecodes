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
    var output=[];


    function checkBraces(bstr){
        var stackArray=[];
        var braceObj={
            '(':'',
            '[':'',
            '{':'',
            ')':'(',
            ']':'[',
            '}':'{'
        };
        for(var i=0;i<bstr.length;i++){
                if(braceObj[bstr.charAt(i)]===stackArray[stackArray.length-1]){    // opposite match with last
                    stackArray.pop();
                }else{
                    stackArray.push(bstr.charAt(i));                 // put in stack
                }
        }
        if(stackArray.length===0){
                return 'YES';
            }else{
                return 'NO';
        }
    }

    for(var i=1;i<=testCase;i++){
        output.push(checkBraces(inputArray[i]));
    }

    console.log(output.join('\n'));

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;

});

process.stdin.on("end", function () {
    processData(_input);
});

