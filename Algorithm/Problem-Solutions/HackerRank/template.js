/**
 * Created by youngsug on 5/11/2016.
 */

function processData(input) {
    //Enter your code here
    var lines = input.split('\n');
    var testCase = parseInt(lines[0]);




/* output to text for comparison
    var fs = require('fs');
    var stream = fs.createWriteStream("my_file.txt");
    stream.once('open', function(fd) {
        stream.write(output.toString()+'\n');
        stream.end();
    });
*/
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    var testinput ='';
});

process.stdin.on("end", function () {
    processData(_input);
});

