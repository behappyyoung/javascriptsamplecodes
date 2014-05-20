
function max(one, two){
    if(one>two){
        return one;
    }else{
        return two;
    }
}
function maxOfThree(one, two, three){
    var first = max(one, two);
    var second = max(first, three);
    return second;
}
function vowel(input){
    var filter = "aeiou";
    if(filter.search(input) > 0){
        return true;
    }else{
        return false;
    }
}
function translate(input){
    var newone = '';
    for(var i=0; i < input.length; i++){
        var char = input.charAt(i);
        if(vowel(char)||char==' '){
            newone = newone + char;
        }else{
            newone = newone + char +'o'+char;
        }
    }
    return newone;
}
function sum(one, two, three, four){
    var sum = parseInt(one) + parseInt(two) + parseInt(three) + parseInt(four);
    return sum;
}
function multiply(one, two, three, four){
    var multi = parseInt(one) * parseInt(two) * parseInt(three) * parseInt(four);
    return multi;
}
function reverse(one){
    var newone = '';
    for(var i=one.length-1; i >= 0; i--){
        var char = one.charAt(i);
        newone = newone + char;
    }
    return newone;
}
function translate2(input){
    var mappingstr = {"merry":"god", "christmas":"jul", "and":"och", "happy":"gott", "new":"nytt", "year":"år"};
    //  var mappingwords = eval('mappingstr.'+input);
    var mappingwords = mappingstr[input];
    return mappingwords;
}
function findLongest(input){
    var words = input.split(" ");
    var longest = words[0];
    for(var i=1; i < words.length; i++){
        if( longest.length < words[i].length){
            longest = words[i];
        }
    }
    return longest;
}
function filterLongWords(input, minlength){
    var words = input.split(" ");
    var filtered = '';
    for(var i=1; i < words.length; i++){
        if( minlength < words[i].length){
            filtered +=  words[i] + ' / ';
        }
    }
    return filtered;
}
function charFreq(input) {
    var freqobj = new Object();
    var thischar = '';
    for(var i=0;i<input.length; i++){
        thischar = input.charAt(i);
        if(freqobj[thischar] == undefined){
            freqobj[thischar] = 1;
        }else{
            freqobj[thischar] = parseInt(freqobj[thischar]) + 1;
        }
    }
    return freqobj;
}
////////////////////// showing functions ///////////////////////
function showmax(){
    var one = document.max.one.value;
    var two  = document.max.two.value;
    alert(max(one, two));

}

function showmaxofthree(){
    var one = document.maxofthree.one.value;
    var two  = document.maxofthree.two.value;
    var three  = document.maxofthree.three.value;
    alert(maxOfThree(one, two, three));
}

function showvowel(){
    var one = document.vowel.one.value;
    if(vowel(one)){
        alert('true');
    }else{
        alert('false');
    }
}

function showtranslate(){
    var one = document.translate.one.value;
    alert(translate(one));
}

function showsum(){
    var one = document.sum_and_multiply.one.value;
    var two  = document.sum_and_multiply.two.value;
    var three  = document.sum_and_multiply.three.value;
    var four  = document.sum_and_multiply.four.value;
    var sumresult = sum(one, two, three, four);
    alert(sumresult);
}

function showmultiply(){
    var one = document.sum_and_multiply.one.value;
    var two  = document.sum_and_multiply.two.value;
    var three  = document.sum_and_multiply.three.value;
    var four  = document.sum_and_multiply.four.value;
    var multiresult = multiply(one, two, three, four);
    alert(multiresult);
}

function showreverse(){
    var one = document.translate.one.value;
    alert(reverse(one));
}
function showtranslate2(){
    var one = document.translate2.one.value;
    var returnwords = translate2(one);
    alert(returnwords);
}
function showfindLongest(){
    var one = document.findLongest.one.value;
    var longest = findLongest(one);
    alert(longest);
}
function showfilterLongWords(){
    var one = document.findLongest.one.value;
    var minlength = document.findLongest.two.value;
    var filtered = filterLongWords(one, minlength);
    alert('longer than ' +  minlength + " - " + filtered );
}
function showcharFreq(){
    var one = document.charFreq.one.value;
    alert(JSON.stringify(charFreq(one), null, 2));
}



/**
 * Created by young on 5/20/14.
 */
