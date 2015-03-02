/**
 * Created by young on 3/2/15.
 */

process.stdin.resume();
process.stdin.setEncoding('ascii');

var __input_stdin = "";

process.stdin.on('data', function (data) {
    __input_stdin += data;
});


process.stdin.on('end', function () {
    console.log(" \n ====== Current  Inputs :  ========== \n");
    console.log(__input_stdin);
    console.log(" \n ====== ================== ========== \n");
});
