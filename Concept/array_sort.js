var myarray = ['aaa','ddd', 'bbb', 'ccc'];

document.write(myarray.sort()+'<br />');
document.write(myarray.reverse()+'<br />');


myarray = ['7', '8', '13', '50'];
document.write(myarray.sort()+'<br />');
document.write(myarray.reverse()+'<br />');

document.write(myarray.sort(function(a, b){return a -b;})+'<br />');
document.write(myarray.sort(function(a, b){return b -a;})+'<br />');

