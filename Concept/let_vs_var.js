function LetvsVar() {
    //letYoung is *not* visible out here

    for( let letYoung = 0; letYoung < 5; letYoung++ ) {
        //letYoung is only visible in here (and in the for() parentheses)
        document.write('<br />in for - letYoung : ' + letYoung);
    };

    for( var varYoung = 0; varYoung < 5; varYoung++ ) {
        //varYoung visible in here
        document.write('<br />in for - letYoung : '+ varYoung);
    };

    //letYoung is *not* visible out here
    //varYoung visible in here

    try{
        document.write('<br />out for - letYoung : ' + letYoung);
    }
    catch(e){
        document.write('<br /> error : '+ e.message);
    }

    try{
        document.write('<br />out for - varYoung :' +  varYoung);
    }
    catch(e){
        document.write('<br /> error : ' + e.message);
    }

};

LetvsVar();
