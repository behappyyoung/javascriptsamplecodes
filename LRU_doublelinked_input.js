/**
 * Created by young on 1/11/14.
 */

function DoubleLinkedList(maxsize) {

    var node = function(id){
            this.name=id,
            this.next= null,
            this.prev= null
    };

    this.maxsize = maxsize;
    this._length = 0;
    this._head = new node('head');
    this._tail = new node('tail');

    this.add = function (newitem){
        //create a new item object, place data in
        var ctype = eval('typeof (this.'+newitem+')');
        if(ctype == "undefined"){

            eval( 'this.'+newitem+' = new node("'+newitem+'");' );
            var current = eval('this.'+newitem);
            //special case: no items in the list yet
            if (this._length === 0) {
                current.next = this._tail;
                current.prev = this._head;
                this._head.next = current;
                this._tail.prev = current;
                this._length++;
            }else{

                if(this._length >= this.maxsize){
                        var lastnode = this._tail.prev;
                         var lastnodename = this._tail.prev.name;
               //console.log(lastnode);
                        lastnode.prev.next = this._tail;
                        this._tail.prev = lastnode.prev;
                        console.log(    'delete this.'+lastnodename );
                        eval('delete this.'+lastnodename);
                }else{
                    this._length++;
                }
                    this._head.next.prev = current;
                    current.next = this._head.next;
                    current.prev = this._head;
                    this._head.next = current;
            }

        }else{
            var current  = eval('this.'+newitem);
             current.prev.next = current.next;
             current.next.prev = current.prev;
             this._head.next.prev = current;
             current.next = this._head.next;
             current.prev = this._head;
             this._head.next = current;
        }



    };


}


var maxsize = process.argv.splice(2)[0];
var mydlink = new DoubleLinkedList(maxsize);

function showList(currentlist){

    var nextitem = currentlist._head;
    var listtext = '';

    while(( nextitem != null)&&( nextitem != 'undefined')){
        listtext += nextitem.name;
        nextitem = nextitem.next;
    }
    return listtext;
}

(function processLRU(){

    var stdin = process.stdin, stdout = process.stdout;
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.once('data', function(data){
        var input = data.toString().trim();

        if(input=='q'){
            stdout.write( '\n goodbye \n' );
            process.exit();
        }else if(/^([0-9]+)$/.test(input)){
            mydlink.add('node'+input);
            stdout.write( 'maxsize = '+ maxsize + 'currentsize = ' + mydlink._length +' current list = '+ showList(mydlink) + '\n');
            processLRU();
        }else{
            stdout.write( 'wrong input \n');
            processLRU();
        }
    });

})();



function calcInput(current){
    var stdin = process.stdin, stdout = process.stdout;
    var myarray = current;

    stdin.resume();
    stdin.setEncoding('utf8');
    stdout.write('>');
    stdin.once('data', function(data){
        var input = data.toString().trim();

        if(input=='q'){
            var outtext = (myarray.length==1) ? 'Result : ' : ' Remaining number in stack : ';
            stdout.write(outtext + myarray.toString() + '\n goodbye \n' );
            process.exit();
        }else if(/^([0-9]+)$/.test(input)){
            myarray.push(input);
            stdout.write(input+'\n');
            calcInput(myarray);
        }else if(/[+-/*]/.test(input)){
            if(myarray.length < 2){
                stdout.write('need more numbers before operand \n');
                calcInput(myarray);
            }else{
                var last = myarray.pop();
                if((input=='/')&&(last==0)){
                    stdout.write('cannot calculate \n');
                    myarray.push(last);
                    calcInput(myarray);
                }else{
                    var slast = myarray.pop();
                    var result = eval(slast+ input + last);
                    stdout.write(result + '\n');
                    myarray.push(result);
                    calcInput(myarray);
                }
            }
        }else{
            stdout.write('wrong input \n');
            calcInput(myarray);
        }
    });
}

