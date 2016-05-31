
// To find min number of squares to match number
// noprotect
var getNumber = function(n){
    this.minSumMap = {};
    function getMinSquareSum(n){
        if(typeof minSumMap[n] !== 'undefined'){
            return minSumMap[n];
        }
        if(n<=3){
            minSumMap[n] = n;
            return n;
        }

        var minSum = n; // initial - max number of squares ( 1+1+..)
        var tempSquare;
        for(var i=1;i<=n;i++){
            tempSquare = i *i;

            if(tempSquare > n){
                break;
            }else{
                minSum = Math.min(minSum, 1+ getMinSquareSum(n-tempSquare));
                minSumMap[n] = minSum;
            }
        }
        return minSum;
    }

    return getMinSquareSum(n);
};


function getMinSquareSum_DP(sum){
    //var min = new Array(sum+1);                            //
    //min.fill(0);
    var min = Array.from(Array(sum+1).keys());
    for(var s =1; s<=sum ; s++){
        for(var n =1; n*n<=s ; n++) {
            console.log(s, n, min[s]);
            min[s] = ( min[s] > 0) ? Math.min(min[s], min[s - n * n] + 1) : min[s - n * n] + 1;
        }
    }
    return min[sum];
}

console.log( "9 dp ==>" + getMinSquareSum_DP(9));

for(var i=4;i<=40;i++){
    //console.log(i + "   recursion ==>" + getNumber(i) +" dp ==>" + getMinSquareSum_DP(i));
}

// minSumMap display
/*
console.log(minSumMap);
var minSumMapKeys = Object.keys(minSumMap);
minSumMapKeys.sort(function(a, b){ return a - b;});

for(var k=0; k<minSumMapKeys.length;k++){
    console.log( minSumMapKeys[k] + '=>'+ minSumMap[minSumMapKeys[k]]);
}
*/