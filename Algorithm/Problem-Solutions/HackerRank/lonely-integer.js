/**
 * Created by young on 3/3/15.
 */
function processDataWithArray(input) {
    //Enter your code here
    var inputArray = input.split('\n');
    var length = inputArray[0];
    if(length % 2 == 0 ){
        console.log('error - N should be odd number , got : ' + length);
        return;
    }else if(length < 0 ||length >= 100 ){
        {console.log('error - N should be 1<= and 100')}
        return;
    }

    var integerArray = inputArray[1].split(' ');
    if(length != integerArray.length){
        console.log('error - N does not match with input numbers  : ' + length);
        return;
    }
    var tempArray = [];
    var curInt;
    for(var i=0; i< length; i++){
        curInt = integerArray[i];
        if(curInt < 0 ||curInt > 100 ){console.log('error - Intergers should be 0<= and <= 100')}
        if(tempArray.indexOf(curInt) >=0 ){ // exist in temp Array
            tempArray.splice(tempArray.indexOf(curInt), 1); // remove from Array
        }else{                          // not exist in temp Array
            tempArray.push(curInt);
        }
    }

    if(tempArray.length > 1){
        console.log('error - There are more than one single number ');
        console.log(tempArray);
    }else{
        console.log(tempArray[0]);
    }

}

function processData(input) {
    //Enter your code here
    var inputArray = input.split('\n');
    var length = inputArray[0];
    if(length % 2 == 0 ){
        console.log('error - N should be odd number , got : ' + length);
        return;
    }else if(length < 0 ||length >= 100 ){
        {console.log('error - N should be 1<= and 100')}
        return;
    }

    var integerArray = inputArray[1].split(' ');
    if(length != integerArray.length){
        console.log('error - N does not match with input numbers, N : ' + length + ' input numbers : ' + integerArray.length);
        return;
    }

    var tempObject = {};
    var curInt;
    for(var i=0; i< length; i++){
        curInt = integerArray[i];
        if(curInt < 0 ||curInt > 100 ){console.log('error - Intergers should be 0<= and <= 100')}
        if(tempObject[curInt]){ // exist in temp Object
            delete tempObject[curInt];
        }else{                          // not exist in temp Array
            tempObject[curInt] = curInt;
        }
    }
    if(Object.keys(tempObject).length > 1){
        console.log('error - There are more than one single number ');
        console.log(Object.keys(tempObject));
    }else{
        console.log(Object.keys(tempObject)[0]);
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
