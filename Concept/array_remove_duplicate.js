/**
 * Created by young on 1/7/15.
 */


var dataArray = [ 'test','test2','test'];
document.write('dataArray => '+ dataArray + '<br />');

var uniqueArray = dataArray.filter(function(item, pos, self) {
    document.write('self.indexOf(item)+..+pos <br />');
    document.write(self.indexOf(item)+'..'+pos + '<br />');
    return self.indexOf(item) == pos;
});
document.write('uniqueArray =>'+ uniqueArray);


// use function with sort
function uniq(a) {
    return a.sort().filter(function(item, pos) {
        return !pos || item != a[pos - 1];
    })
}

function uniqObject(myA) {
    myA.sort(function(a,b) {return (a.username > b.username) ? 1 : ((b.username > a.username) ? -1 : 0);} );
    for(i=0;i< myA.length-1;i++){
        if(myA[i].username==myA[i+1].username){
            myA.splice(i, 1);
        }
    }
    return myA;
}
