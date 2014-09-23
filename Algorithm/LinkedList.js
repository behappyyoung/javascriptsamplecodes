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

    this.remove= function(index){
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

    this.showList =function(){
        var showText = ' => ';
        var current = this._head;
        while(current!=null){
            showText +=  current.data + '  ->  ' ;
            current = current.next;
        }
        return showText+ "<== ";
    }
}

var mylink = new myLinkedList();
var divText = '';
divText += 'start length : ' + mylink._length +  ' --- List : ' + mylink.showList() + '<br />';
mylink.add('first');
divText += 'add first [mylink.add("first") ]- length: ' + mylink._length + ' --- List : ' + mylink.showList() + '<br />';
mylink.add('second');
divText += 'add second [mylink.add("second") ]- length: ' + mylink._length + ' --- List : ' + mylink.showList() + '<br />';
mylink.add('third');
divText += 'add third  [mylink.add("third") ]- length: ' + mylink._length + ' --- List : ' + mylink.showList() + '<br />';
divText += 'head =>  : ' + mylink._head.data + '<br />';
divText += 'head . next  => : ' + mylink._head.next.data + '<br />';
mylink.remove(1);
divText += 'remove(index) [mylink.remove(1)]   :  --- List : ' + mylink.showList() + '<br />';
divText += 'head =>  : ' + mylink._head.data + '<br />';
divText += 'head . next  => : ' + mylink._head.next.data + '<br />';

document.getElementById('display').innerHTML = divText;
