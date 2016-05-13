/**
 * Created by youngsug on 5/11/2016.
 */
function processData(input) {
    //Enter your code here
    var inputArray = input.split('\n');
console.log(inputArray);
    var Nstudents = parseInt(inputArray[0]);
    var cRating, preRating=0, nextRating;
    var tCandies=0, cCandy=1, preCandy=1;
    var myText='';
    for(var i = 1; i<=Nstudents; i++){
        cRating = parseInt(inputArray[i].trim());
        nextRating = isNaN(inputArray[i+1])? cRating : inputArray[i+1] ;
        if(preRating >0 && preRating < cRating){
            cCandy = preCandy + 1;
        }else if(nextRating < cRating){
                cCandy = 2;
        }else{
                cCandy = 1;
        }
        preRating = inputArray[i];
        preCandy = cCandy;
        tCandies += cCandy;
        console.log(cRating, preRating,nextRating, cCandy, preCandy, tCandies);
        myText += cRating + ','+ preRating + ','+ nextRating+ ','+ cCandy+ ','+ preCandy+ ','+ tCandies + '\n';
    }

    console.log(tCandies);
    var fs = require('fs');
    var stream = fs.createWriteStream("my_file.txt");
    stream.once('open', function(fd) {
        stream.write(tCandies.toString()+'\n');
        stream.write(myText);
        stream.end();
    });
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;

    if(input.match(';')){
        processData(_input);
        _input = '';
    }

});

process.stdin.on("end", function () {
    processData(_input);
});

