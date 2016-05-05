var maindiv = document.getElementById('div');
var testvar = 'out';
var testobj = { testvar : 'objvar'};

function theFunction(message1, message2, message3) {
    var testvar = 'in';
    var newdiv = document.createElement('div');
    var innerhtml = '<br /> object : '+ this +' - this.testvar : '+this.testvar+' - testvar : '+testvar+' <br /> '+ '  - message : ' +message1 +message2+message3+ '<br />' ;
    newdiv.innerHTML = innerhtml;
    maindiv.appendChild(newdiv);
}

theFunction("1", "John", "fireman");
theFunction.apply("apply function ", ["2", "Susan", "school teacher"]);   //
theFunction.call("call function ", "3", "Claude", "mathematician");      //

theFunction.apply('', ["4", "John4", "school teacher"]);
theFunction.apply(testobj, ["5", "John5", "school teacher"]);
theFunction.apply(null, ["6", "John6", "school teacher"]);
theFunction.apply(undefined, ["7", "John7", "school teacher"]);
theFunction.apply(this, ["8", "John8", "school teacher"]);