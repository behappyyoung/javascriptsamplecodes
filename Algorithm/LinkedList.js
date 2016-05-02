/**
 * Created by young on 5/27/14.
 * linked list implementation
 */

function myLinkedList() {
    this._length = 0;
    this._head = null;

    this.add= function (data){
        //create a new item object, place data in
        var node = {
            data: data,
            next: null
        };
        //special case: no items in the list yet
        if (this._length === 0) {
            this._head = node;
        } else {
            //replace the head node
            node.next = this._head;
            this._head = node;
        }
        //update the count
        this._length++;
    };

    this.removeIndex= function(index){
        //check for out-of-bounds values
        if (index > -1 && index < this._length){
            var current = this._head,
                i = 0;
            //special case: removing first item
            if (index === 0){
                this._head = current.next;
            } else {
                //find the right location
                while(i++ < index-1){
                    current = current.next;
                }
                //skip over the item to remove
                current.next = current.next.next;
            }
            //decrement the length
            this._length--;
            //return the value
            return current.data;
        } else {
            return null;
        }
    };

    this.delete = function(data){
        if(this._head == null ) return new Error('no data');
        var current = this._head;
        if( current.data == data){     // head == data
            this._head = current.next;
            this._length--;
        }
        while(current.next !=null){
            if(current.next.data == data){
                current.next = current.next.next;
                this._length--;
            }
            current = current.next;
        }

    }

    this.showList =function(){
        var showText = '   ';
        var current = this._head;
        while(current!=null){
            showText +=  current.data + '  ->  ' ;
            current = current.next;
        }
        return showText;
    }
}

var mylink = new myLinkedList();

var divText = ' <br /> ------------------------------- <br />';
divText += 'start length : ' + mylink._length +  ' --- List : ' + mylink.showList() + '<br />';
console.log('init', mylink);
mylink.add('first');
console.log('mylink.add("first")', mylink);
divText += 'add first [mylink.add("first") ] <br /> length: ' + mylink._length + ' --- List : ' + mylink.showList() + '<br />';
mylink.add('second');
console.log('mylink.add("second")', mylink);
divText += 'add second [mylink.add("second") ]<br /> length: ' + mylink._length + ' --- List : ' + mylink.showList() + '<br />';
mylink.add('third');
console.log('mylink.add("third")', mylink);
divText += 'add third  [mylink.add("third") ]<br /> length: ' + mylink._length + ' --- List : ' + mylink.showList() + '<br />';
divText += 'head =>  : ' + mylink._head.data + '<br />';
divText += 'head . next  => : ' + mylink._head.next.data + '<br />';
mylink.removeIndex(1);
console.log('mylink.removeIndex(1);', mylink);

divText += 'removeIndex(index) [mylink.removeIndex(1)]   :  --- List : ' + mylink.showList() + '<br />';
divText += 'head =>  : ' + mylink._head.data + '<br />';
divText += 'head . next  => : ' + mylink._head.next.data + '<br />';

mylink.add('forth');
console.log('mylink.add("forth")', mylink);
mylink.delete('third');
console.log('mylink.delete("third"");' , mylink);
mylink.add('fifth');
console.log('mylink.add("fifth")', JSON.stringify(mylink));

if (typeof window !== 'undefined') {
    document.getElementById('display').innerHTML = divText;
}