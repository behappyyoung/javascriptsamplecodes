/**
 * Created by youngsug on 5/16/2016.
 */


function isPrime(n){
    if(n<2) return false;
    if(n%2 ===0) return false;
    var limit = Math.round(Math.sqrt(n)); //

    for (var i = 3; i <= limit; i= i+2) {
        if (n%i == 0) { // If we find one, we know it's not a prime
            return false;
        }
    }
    return true;
}


function countPrime(n){
    if(n<2) return 0;
    var primes = 1;
    for (var i=3; i<=n; i=i+2){
        if(isPrime(i))primes++;
    }
    return primes;
}

for(var i=2; i<=100; i++){
    console.log(i , isPrime(i));
}
console.log(countPrime(100));





function primes(x)
{
    var totalnum=[];
    if(x<2) return totalnum;
    if(x ==2){
        totalnum.push(2);
        return totalnum;
    };
    var isPrime = function(n){
        if(n<2) return false;
        var limit = Math.floor(Math.sqrt(n));
         for(var i=0;i<totalnum.length; i++){
            if(limit%i === 0 ) return false;
        };
        return true;
    };

    totalnum.push(2);

    for(var k=3;k<=x ; k=k+2){
        if(isPrime(k)) totalnum.push(k);
    }

    return totalnum;


}

