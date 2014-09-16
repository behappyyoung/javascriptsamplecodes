/**
 * Created by young on 5/27/14.
 */

function LinkedList() {
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
            //attach to the tail node
            node.next = this._head.next;
            this._head.next = node;
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

                /*                 */
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

    this.showList =function(){
        var showText = ' => ';
        var current = this._head;
        while(current!=null){
            showText +=  ' <- ' + current.data + '  ->  ' ;
            current = current.next;
        }
        return showText+ "<== ";
    }
}

var mydlink = new DoublyLinkedList();


var div = document.getElementById('display');
div.innerHTML += 'start length : ' + mydlink._length +  ' ---' + mydlink.showList() + '<br />';

mydlink.add('first');
div.innerHTML += 'add first [mydlink.add("first") ]- length: ' + mydlink._length + ' ---' + mydlink.showList() + '<br />';

mydlink.add('second');
div.innerHTML += 'add second [mydlink.add("second") ]- length: ' + mydlink._length + ' ---' + mydlink.showList() + '<br />';

mydlink.add('third');
div.innerHTML += 'add third  [mydlink.add("third") ]- length: ' + mydlink._length + ' ---' + mydlink.showList() + '<br />';

div.innerHTML += 'head =>  : ' + mydlink._head.data + '<br />';
div.innerHTML += 'tail =>  : ' + mydlink._tail.data + '<br />';

div.innerHTML += 'head . next  => : ' + mydlink._head.next.data + '<br />';

mydlink.remove(1);

div.innerHTML += 'remove(index) [mydlink.remove(1)]   :  ---' + mydlink.showList() + '<br />';

div.innerHTML += 'head =>  : ' + mydlink._head.data + '<br />';
div.innerHTML += 'head . next  => : ' + mydlink._head.next.data + '<br />';
div.innerHTML += 'tail =>  : ' + mydlink._tail.data + '<br />';