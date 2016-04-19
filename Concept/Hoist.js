
var maindiv = document.getElementById('div');
var textresult = '<br />';


var myvar = 'my value';

(function() {
    console.log(myvar); // my value
})();

(function() {
    var myvar = 'local value';
    console.log(myvar); // local value
})();

(function() {
    console.log(myvar); // undefined
    var myvar = 'local value';
})();

/* ================================== */
var varout = 3;
function Hoisttest() {
    textresult += 'varfoo : ' + varfoo+'<br />';
    try{
        textresult += 'varbar : ' + varbar+'<br />';  //ReferenceError:varbar is not defined
    }catch(err){
        textresult += ' varbar =>  ' + err+'<br />';
    }

    textresult += 'varout : ' + varout+'<br />';

    var varfoo = 3;
    varbar = 3;

    textresult += 'varbar : ' + varbar+'<br />';

    textresult += 'foo() : ' + foo+'<br />';
    try{
        foo(); // TypeError "foo is not a function"
    }catch(err){
        textresult += 'foo() => ' +  err+'<br />';
    }

    textresult += 'bar : ' + bar+'<br />';
    bar();  // "this will run!"
    var foo = function () { // function expression assigned to local variable 'foo'
        textresult +=  "this won't run!";
    };
    function bar() { // function declaration, given the name 'bar'
        textresult += "this will run!";
    }
}
Hoisttest();
maindiv.innerHTML = textresult;
