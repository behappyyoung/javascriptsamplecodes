'use strict';



function processData(input) {
    var parse_fun = function (s) { return parseInt(s, 10); };

    var lines = input.split('\n');
console.log(lines);
    var T = parse_fun(lines.shift());                       // Testing case
    var data = lines.splice(0, T).map(parse_fun);           // ignore more than T and do parseInt

    function findHeight(cycle){
        if(cycle==0){
            return 1;
        }else if(cycle==1){
            return 2;
        }else{
            if(cycle % 2 == 1){  // spring
                return findHeight(cycle-1) *2;
            }else{
                return findHeight(cycle-1) +1;
            }
        }
    }

    for(var i=0; i < T; i++){
       console.log(findHeight(data[i]));
    }


}

process.stdin.resume();
process.stdin.setEncoding("ascii");
var _input = "";
process.stdin.on("data", function (input) { _input += input; });
process.stdin.on("end", function () { processData(_input); });