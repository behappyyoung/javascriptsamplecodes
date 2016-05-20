// loop
var loopFab = function (n) {
    var a = 0, b = 1, f = 1;
    if (n <= 2){
        return 1;
    } else{
        for(var i=2;i<=n;i++){
            f = a+b;
            a = b;
            b = f;
        }
        return f;
    }
};

// recursive
var myFab = function (n) {
    if (n <= 2){
        return 1;
    } else{
        return myFab(n - 1) + myFab(n - 2);
    }
};

// recursive improve - Memoization
var myFab2 = function (n) {
    var prev = {};
    var getFab = function(x) {
        if(prev[x]) return prev[x];
        if (x <= 2){
            prev[x] = 1;
        } else{
            prev[x] = getFab(x - 1) + getFab(x - 2);
        }
        return prev[x];
    };
    return getFab(n);
};


// Dynamic
var dpFab = function (n) {
    var fib = [];
    fib[0] = 0;
    fib[1] = 1;
    for (var i = 2; i < n + 1; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib[n];
};


if(typeof window !== 'undefined'){
    loopCount = recCount = memCount = dpCount = 0;
    document.getElementById('loop').getElementsByClassName( 'result' )[0].innerHTML= 'loopFab(30) : ' + loopFab(30) ;
    document.getElementById('recursive').getElementsByClassName( 'result' )[0].innerHTML= 'myFab(30) : ' + myFab(30);
    document.getElementById('improve').getElementsByClassName( 'result' )[0].innerHTML= 'myFab2(30) : ' + myFab2(30);
    document.getElementById('dynamic').getElementsByClassName( 'result' )[0].innerHTML= 'dpFab(30) : ' + dpFab(30);


}
loopCount = recCount = memCount = dpCount = 0;
console.log('loopFab(30) :' + loopFab(30));
console.log('myFab(30) :'+myFab(30) );
console.log('myFab2(30) :'+myFab2(30) );
console.log('dpFab(30) :'+dpFab(30) );

