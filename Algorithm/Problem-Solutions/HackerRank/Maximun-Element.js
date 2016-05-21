/**
 * Created by youngsug on 5/12/2016.
 */
/**
 * Created by youngsug on 5/11/2016.
 */

function processData(input) {
    //Enter your code here
    var inputArray = input.split('\n');
    var output=[];
    var testCase = parseInt(inputArray[0]);
    var actions;
    var myStack=[], max=0, current;

    function addToStack(n){
        myStack.push(n);
        if( n > max){
            max = n;
        }
    }
    function popFromStack(){
        current = myStack.pop();
        if(myStack.length==0){
            max = 0;
            return;
        }
        if(current == max){
            max = myStack[myStack.length-1];
            for(var i=0;i<myStack.length;i++){
                max = (max < myStack[i]) ? myStack[i] : max;
            }
        }
    }

    for(var i=1;i<=testCase;i++){
        actions = inputArray[i].split(' ');
        if(parseInt(actions[0])==1){
            addToStack(parseInt(actions[1]));
        }else if(parseInt(actions[0])==2){
            popFromStack();
        }else{
            if(max!=0){
                output.push(max) ;
            }

        }
    }
    console.log(output.join('\n'));
    //console.log(output);

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {

//var testinput ='10\n1 97\n2\n1 20\n2\n1 26\n1 20\n2\n3\n1 91\n3';
 //   var testinput ='10\n1 97\n2\n1 20\n2\n1 26\n1 20\n2\n3\n1 91\n3\n2';
 //   console.log(testinput);
 //   processData(testinput);
     _input += input;
     if(input.match(';')){                           // for testing on  windows
     console.log(_input);
     processData(_input.slice(0, _input.indexOf(';')));
     _input = '';
     }

});

process.stdin.on("end", function () {
    processData(_input);
});

