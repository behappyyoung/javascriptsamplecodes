
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


for(var i=4;i<=30;i++){
    console.log(i + "==>" + getNumber(i));
}
// minSumMap display
console.log(minSumMap);
var minSumMapKeys = Object.keys(minSumMap);
minSumMapKeys.sort(function(a, b){ return a - b;});

for(var k=0; k<minSumMapKeys.length;k++){
    console.log( minSumMapKeys[k] + '=>'+ minSumMap[minSumMapKeys[k]]);
}
