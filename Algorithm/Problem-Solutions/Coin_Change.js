/**
 * Created by youngsug on 5/20/2016.
 */

var coins = [1, 5, 10, 25];
var totalSum = 100;


// recursive with Memoization
var makeChange = function(sum, cp){
    var saved=[];
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

//dynamic programming

console.log('ways to make change = ' + makeChange(totalSum, coins.length-1));