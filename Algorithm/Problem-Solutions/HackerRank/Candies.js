/**
 * Created by youngsug on 5/11/2016.
 */
function processData(input) {
    //Enter your code here
    var inputArray = input.split('\n');
console.log(inputArray);


    var Nstudents = parseInt(inputArray[0].trim());
    /*
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
     */
var candies =[];
candies[0]=1;
candies[1] = 1;
    for(var i=2; i <= Nstudents; i++){
        if(  parseInt(inputArray[i].trim()) >  parseInt(inputArray[i-1].trim()) ){
            candies[i] = candies[i-1] + 1;
        }else{
            candies[i] = 1;
            for( var j=i; j>1; j-- ){
                if(  parseInt(inputArray[i-1].trim()) >  parseInt(inputArray[i].trim()) ){
                    if(candies[j-1] > candies[j]){
                        break;
                    }else{
                        candies[i-1]++;
                    }
                }else
                    break;
                }
        }

    }

    var sum=0;
    for(i = 1;i <= Nstudents; i++){
        sum += candies[i];
    }
    console.log( sum);

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {

    _input += input;
//    var testinput ='3\n1\n2\n2\n1\n';
//    processData(testinput);

});

process.stdin.on("end", function () {
    processData(_input);
});

