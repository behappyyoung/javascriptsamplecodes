function swapNumber(a, b){
    console.log('before swap: ','a: ', a, 'b: ', b);
    b = b -a;
    a = a+ b;
    b = a-b;
    console.log('after swap: ','a: ', a, 'b: ', b);
    return a+','+b; // for testing
}

function swapNumber2(a, b){
    console.log("a: " + a + " and b: " + b);
    a = a ^ b;
    b = a ^ b;
    a = a ^ b;
    console.log("a: " + a + " and b: " + b);
    return a+','+b; // for testing
}


console.log('swapNumber(a, b);'  );
swapNumber(2, 3);

console.log('swapNumber2(a, b);'  );
swapNumber(2, 3);


