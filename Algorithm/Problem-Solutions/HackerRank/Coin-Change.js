/**
 * Created by youngsug on 5/11/2016.
 */


function processData(input) {
    //Enter your code here
    var sortNumber = function(a, b){
        return a -b ;
    };
    var inputArray = input.split('\n');
    var totalSum = parseInt(inputArray[0]);
    var coins = inputArray[1].trim().split(' ').sort(sortNumber);       //  coin array
    var saved={};

    var makeChange = function(sum, cp){
        if(saved[sum+'/'+cp]){
            return saved[sum+'/'+cp];
        }
        if(sum==0)return 1;
        if(cp<0)return 0;
        var ways = 0;
        var next_cp;
        next_cp = cp - 1;
        var currentCoin = coins[cp];
        for( var i=0; i*currentCoin<= sum; i++ ){
            ways += makeChange(sum-(i*currentCoin), next_cp);
        }
        saved[sum+'/'+cp] = ways;
        return ways;
    }

    console.log(makeChange(totalSum, coins.length-1));
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
