/**
 * Created by young on 3/3/15.
 */
function processData(input) {
    //Enter your code here
    var inputArray = input.split('\n');
    var length = inputArray[0].trim();
    if(length < 1 ||length > 100 ){
        console.log('error - N should be 1=< and <=100');
        return;
    }
    var mask32 = 0xFFFFFFFF;
    var result, curint;


    for(var i=1; i<=length; i++){
        curint =inputArray[i].trim();
        if((curint < 0)||(curint > mask32)){
            console.log('error : integer should be 0 =<  and < ' + mask32);
            return;
        }
        result =  ( mask32 ^ curint)>>>0 ;                  // make unsigned integer...
        //result = ( (curint * -1)-1 ) >>> 0;           // same result
        console.log( (result).toString());
    }

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