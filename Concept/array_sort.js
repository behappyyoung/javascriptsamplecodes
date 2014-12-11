var myarray = ['aaa','ddd', 'bbb', 'ccc'];

document.write(' <br />====  orginal array : ' + myarray+'==== <br />');
document.write('myarray.sort() : '+myarray.sort()+'<br />');
document.write('myarray.reverse() : '+ myarray.reverse()+'<br />');


myarray = ['8', '7', '22', '13', '50'];
document.write('<br />==== orginal array  : ' + myarray+'==== <br />');
document.write('myarray.sort() : '+myarray.sort()+'   <==  wrong <br />');
document.write('myarray.reverse() : '+ myarray.reverse()+' <== wrong  <br />');


document.write('myarray.sort(function(a, b){return a -b;})  : ' + myarray.sort(function(a, b){return a -b;})+'<br />');
document.write('myarray.sort(function(a, b){return b -a;}) : ' + myarray.sort(function(a, b){return b -a;})+'<br />');



myarray = ['8', '7', '22', '13', '50'];
document.write('<br />==== orginal array  : ' + myarray+' ==== <br />');
document.write('myarray.sort(function(a, b){return a -b;})  :  process  <br />');
document.write(myarray.sort(function(a, b){
    document.write( "comparing " + a + ",  " + b +'<br />');
    document.write( a- b +'<br />');
    return a -b;
})+'<br />');


/* object sort */
//objs.sort(function(a,b) {return (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0);} );


