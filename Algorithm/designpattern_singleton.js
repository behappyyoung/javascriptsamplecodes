/**
 * Created by young on 5/30/14.
 */

var mySingleton = (function () {
    var instance;
    function init(){             // private
        // Singleton
        // Private methods and variables
        var privateRandomNumber = Math.random();
        return {
            getRandomNumber: function() {
                return privateRandomNumber;
            }
        };
    };
    return {
        getInstance : function(){
            if ( !instance ) {
                instance = init();
            }
            return instance;

        }
    };

})();


// Usage:
var singleA = mySingleton.getInstance();
var singleB = mySingleton.getInstance();
var divtext = ' singleton <br />';
divtext += singleA.getRandomNumber() +' / '+singleB.getRandomNumber() ;


var notSingleton = function () {

     // Private methods and variables
     function privateMethod(){
            console.log( "I am private" );
      }
     var privateVariable = "Im also private";
     var privateRandomNumber = Math.random();
           // Public methods and variables
     this.publicMethod = function () {
                console.log( "The public can see me!" );
            },
     this.publicProperty = "I am also public",
     this.getRandomNumber = function() {
                return privateRandomNumber;
     }
};

var notsingle1 = new notSingleton();
var notsingle2 = new notSingleton();

divtext += '  <br /> Not singleton <br />';
divtext += notsingle1.getRandomNumber() +' / '+notsingle2.getRandomNumber() ;

document.getElementById('show').innerHTML=divtext ;
