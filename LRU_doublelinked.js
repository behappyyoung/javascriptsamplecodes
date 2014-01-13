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
                    console.log(lastnode);
                    lastnode.prev.next = this._tail;
                    this._tail.prev = lastnode.prev;
                    delete eval('this.'+lastnodename);
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

var mydlink = new DoubleLinkedList(4);

console.log(mydlink._length);
mydlink.add('node1');
mydlink.add('node2');
mydlink.add('node3');
console.log(mydlink._head);
console.log(mydlink._tail);
console.log(mydlink._length);

