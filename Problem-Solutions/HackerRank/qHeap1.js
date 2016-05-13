/**
 * Created by youngsug on 5/12/2016.
 */
/**
 * Created by youngsug on 5/11/2016.
 */

function processData(input) {
    //Enter your code here
    var inputArray = input.split('\n');
    var output='';
    var testCase = parseInt(inputArray[0]);
    var actions;
    var myHeap=[];

    function swap(i, j){             // swap;
        var temp;
        temp = myHeap[i];
        myHeap[i] = myHeap[j];
        myHeap[j] = temp;

    }
    function bubble(i){
        var pi = Math.floor(i/2);  // parent's index
        if(myHeap[i] < myHeap[pi]){
            swap(i, pi);
            bubble(pi);
        }
    }
    function bubble_down(i){
        var ci = (myHeap[i*2] < myHeap[i*2 +1]) ? i*2: i*2 +1;  // child index
        if(myHeap[ci]<myHeap[i]){
            swap(ci, i);
            bubble_down(ci)
        }
    }
    function addHeap(n){
        myHeap.push(n);
        bubble(myHeap.length-1);
    }
    function deleteFromHeap(n) {

        for(var i=0;i<myHeap.length;i++){
            if(myHeap[i]==n){
                myHeap[i] = myHeap[myHeap.length-1];
                myHeap.pop();
                bubble_down(i);
                return;
            }
        }
    }
    function getMin(){

       var min=myHeap[0];
       myHeap[0] = myHeap[myHeap.length-1];
       bubble_down(0);
       return min;
    }

    function peakMin(){
        return myHeap[0];
    }
    for(var i=1;i<=testCase;i++){
        actions = inputArray[i].split(' ');
        if(parseInt(actions[0])==1){
            //myHeap.push(parseInt(actions[1]));
            addHeap(parseInt(actions[1]));
        }else if(parseInt(actions[0])==2){
            deleteFromHeap(parseInt(actions[1]));
        }else{
            output += peakMin()+'\n';
        }
    }
    
    console.log(output);

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
    if(input){                           // for testing on  windows
        //var testinput='5\n1 4\n1 9\n3\n2 4\n3\n';
        var testinput ='21\n1 1000000000\n1 100000000\n1 10000000\n1 1000000\n3\n1 100000\n3\n1 10000\n3\n1 1000\n3\n2 1000\n3\n2 1000000000\n3\n1 -100000\n3\n2 100000000\n3\n2 10000000\n3';
        console.log(testinput);
        processData(testinput);
        /*

        if(input.match(';')){                           // for testing on  windows
         var testinput='5\n1 4\n1 9\n3\n2 4\n3\n';
         processData(testinput);
        console.log(_input);
        processData(_input.slice(0, _input.indexOf(';')));
        _input = '';*/
    }
});

process.stdin.on("end", function () {
    processData(_input);
});

