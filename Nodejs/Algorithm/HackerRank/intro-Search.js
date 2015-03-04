function processData(input) {
    //Enter your code here
    var parse_fun = function (s) { return parseInt(s, 10); };
    var inputArray = input.split('\n');
    var V = parseInt(inputArray[0]);
    var length = parseInt(inputArray[1].trim());       // size of array
    var ar = inputArray[2].trim().split(' ').map(parse_fun);

    if (length != ar.length) {
        console.log('error - length does not match with input Array size  : ' + length);
        return;
    }

    function findV(start, current, end) {
        var newcurrent;
        //console.log(start + '/'+ end + '/' + current + '/' +  ar[current] + '=='+ V);
        if (ar[current] == V) {
            return current;
        }else if(ar[current] > V){
            if(current==1){
                if(ar[0] == V){
                    return 0;
                }else{
                    return 'error - no interger';
                }
            }
            newcurrent = Math.floor( (parseInt(start)+parseInt(current)) / 2);
            return findV(start, newcurrent, current);

        }else if(ar[current] < V){
            if(current==(end-1)){
                if(ar[end] == V){
                    return end;
                }else{
                    return 'error - no interger';
                }
            }
            newcurrent = Math.floor( (parseInt(end)+parseInt(current)) / 2);
            return findV(current, newcurrent, end);
        }
    }

    var current = Math.floor( length/ 2);
    var result = findV(0, current, length-1);
    console.log(result);

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

