/**
 * from linked list  : find kth item from last
 */

function myLinkedList() {
    this._head = null;

    this.add= function (data){
        var node = {
            data: data,
            next: null
        };
        if (this._length === 0) {
            this._head = node;
        } else {
            //replace the head node
            node.next = this._head;
            this._head = node;
        }
    };

    this.showList =function(){
        var showText = ' => ';
        var current = this._head;
        while(current!=null){
            showText +=  current.data + '  ->  ' ;
            current = current.next;
        }
        return showText;
    };

    this.findKthFromLast_withArray = function(k){
        var newArray = new Array(k);
        var current = this._head;
        var i = 0;
        while(current!=null){
            newArray[i] = current.data;
            i++;
            current = current.next;
            if(i>=k){i=0}
        }
        return newArray[i];
    };

    this.findKthFromLast_withTwoPointer = function(k){
        var i = 0;
        var j = 0;
        var current = this._head;
        var kforward = this._head;
        while((kforward!=null)&&(j<k)){
            kforward = kforward.next;
            j++;
        }
        while(kforward !=null){
            kforward = kforward.next;
            current = current.next;
        }
        return current.data;
    }
}

var mylink = new myLinkedList();

var divText = '';
mylink.add('6th');
mylink.add('5th');
mylink.add('4th');
mylink.add('third');
mylink.add('second');
mylink.add('first');
divText += ' --- From List : ' + mylink.showList() + '<br />';
divText += '  With Circular Array <br />';
divText += ' --- 4th item from last : ' + mylink.findKthFromLast_withArray(4) + '<br />';
divText += ' --- 5th item from last : ' + mylink.findKthFromLast_withArray(5) + '<br />';
divText += '  With  Two Pointers <br />';
divText += ' --- 4th item from last : ' + mylink.findKthFromLast_withTwoPointer(4) + '<br />';
divText += ' --- 5th item from last : ' + mylink.findKthFromLast_withTwoPointer(5) + '<br />';

document.getElementById('display').innerHTML = divText;
