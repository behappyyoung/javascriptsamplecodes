/**
 * Created by young on 5/27/14.
 */

function DoublyLinkedList() {
    this._length = 0;
    this._head = null;
    this._tail = null;

    this.add= function (data){

        //create a new item object, place data in
        var node = {
            data: data,
            next: null,
            prev: null
        };

        //special case: no items in the list yet
        if (this._length === 0) {
            this._head = node;
            this._tail = node;
        } else {
            //attach to the tail node
            this._tail.next = node;
            node.prev = this._tail;
            this._tail = node;
        }

        //don't forget to update the count
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

                /*
                 * If there's only one item in the list and you remove it,
                 * then this._head will be null. In that case, you should
                 * also set this._tail to be null to effectively destroy
                 * the list. Otherwise, set the previous pointer on the
                 * new this._head to be null.
                 */
                if (!this._head){
                    this._tail = null;
                } else {
                    this._head.prev = null;
                }

                //special case: removing last item
            } else if (index === this._length -1){
                current = this._tail;
                this._tail = current.prev;
                this._tail.next = null;
            } else {

                //find the right location
                while(i++ < index){
                    current = current.next;
                }

                //skip over the item to remove
                current.prev.next = current.next;
            }

            //decrement the length
            this._length--;

            //return the value
            return current.data;

        } else {
            return null;
        }

    };

    //more methods here
}

var mydlink = new DoublyLinkedList();


var div = document.getElementById('display');
div.innerHTML += 'start length : ' + mydlink._length + '<br />';

mydlink.add('first');
div.innerHTML += 'add first - length: ' + mydlink._length + '<br />';

mydlink.add('second');
div.innerHTML += 'add second - length: ' + mydlink._length + '<br />';

mydlink.add('third');
div.innerHTML += 'add third - length: ' + mydlink._length + '<br />';

div.innerHTML += 'head  : ' + mydlink._head.data + '<br />';
div.innerHTML += 'head  : ' + mydlink._tail.data + '<br />';

div.innerHTML += 'head . next  : ' + mydlink._head.next.data + '<br />';

mydlink.remove(1);

div.innerHTML += 'remove (1)   : <br />';

div.innerHTML += 'head . next  : ' + mydlink._head.next.data + '<br />';