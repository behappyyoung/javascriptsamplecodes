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
function dpChange(sum, cArr) {

        var wTable = [];    //  set up  solution array   [sum][Coin(arr)]
        for(var i=0; i<=sum; i++){
            wTable[i] = [];
        }
        for ( i=0; i<cArr.length; i++)
            wTable[0][i] = 1;

        // Fill rest of the table enteries in bottom up manner
        var prev, withoutCorrent;
        for (i = 1; i <= sum; i++)                      // loop 1 - sum                 i  = sub sum
        {
            for (var j = 0; j < cArr.length; j++)       // loop 0 - CoinArray length -1  j = coin array index
            {
                // Count of solutions including cArr[j]
                //prev = (i >= cArr[j] )? wTable[i - cArr[j]][j]: 0;

                // Count of solutions excluding cArr[j]
                //withoutCorrent = (j >= 1)? wTable[i][j-1]: 0;
                // total count
                //wTable[i][j] = prev + withoutCorrent;
                if(i==0 || j==0){
                    wTable[i][j] = 1;
                }else{
                    wTable[i][j] =  wTable[i][j-1] +  (i < cArr[j] ? 0 : wTable[i-cArr[j]][j]);
                }

                if(i<=15){
                //    console.log(i, j, prev, withoutCorrent, wTable[i][j]);
                }

            }
        }
        return wTable[sum][cArr.length-1];



}

console.log('ways to make change = ' + makeChange(totalSum, coins.length-1));
console.log('ways to make change  ( dynamic ) = ' + dpChange(totalSum, coins));