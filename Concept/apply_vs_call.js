function theFunction(div, name, profession) {
    document.getElementById(div).innerHTML= this;
    document.getElementById(div+"1").innerHTML= "   = > My name is " + name + " and I am a " + profession + ".";
}
theFunction("div1", "John", "fireman");
theFunction.apply("apply function ", ["div2", "Susan", "school teacher"]);
theFunction.call("call function ", "div3", "Claude", "mathematician");
