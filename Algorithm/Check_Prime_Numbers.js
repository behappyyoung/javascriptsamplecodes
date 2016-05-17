/**
 * Created by youngsug on 5/16/2016.
 */

function primes(x)
{
    var totalnum=[];
    if(x<2) return totalnum;
    if(x>=2){
        totalnum.push(2);
    }
    var isPrime = function(n){
        if(n<2) return false;
         for(var i=0;i<totalnum.length; i++){
            if( n % totalnum[i] === 0 ) return false;
        }
        return true;
    };
    for(var k=3;k<=x ; k=k+2){
        if(isPrime(k)) totalnum.push(k);
    }
    return totalnum;
}

var primeArr = primes(100);
console.log(primeArr, primeArr.length);

console.log ( 'type number : ');
process.stdin.resume();
process.stdin.setEncoding("ascii");
process.stdin.on("data", function (input) {
    var primeArr = primes(input);
    console.log(primeArr.length,  ' : ', primeArr.toString() );
});
