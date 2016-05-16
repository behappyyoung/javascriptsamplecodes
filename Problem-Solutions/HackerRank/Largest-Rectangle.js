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
    var max = 0, current;
    var testCase = parseInt(inputArray[0]);
    var building = inputArray[1].split(' ');

    function findMax(start){
        var max = 0, current, maxh = building[start];
        for(var i=start; i<testCase;i++){
            maxh = (maxh > building[i])? building[i]: maxh;
            current =maxh*(i-start+1);
            max = (current>max)? current: max;
            console.log(start, building[i], maxh, max, i);
        }
        return max;
    }

    for(var b=0; b<testCase;b++){
        current = findMax(b);
        max = (current>max)? current: max;
    }


    console.log(max);

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {

    //var testinput ='9\n1 2 3 4 7 4 5 3 3';
    var testinput = '10\n8979 4570 6436 5083 7780 3269 5400 7579 2324 2116';
    console.log(testinput);
    processData(testinput);
    /*
    _input += input;
    if(input.match(';')){                           // for testing on  windows
        console.log(_input);
        processData(_input.slice(0, _input.indexOf(';')));
        _input = '';
    }
*/
});

process.stdin.on("end", function () {
    processData(_input);
});

