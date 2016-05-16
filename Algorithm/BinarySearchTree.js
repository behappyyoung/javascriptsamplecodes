/**
 * Created by youngsug on 5/15/2016.
 */
var Node = function(data) {
    this.value = data;
    this.left = null;
    this.right = null;
    return this;
};

function BinarySearchTree() {
    this._root = null;
}


BinarySearchTree.prototype.add =  function(value){
    //create a new item object, place data in
    var node = new Node(value);

    //used to traverse the structure current;

    //special case: no items in the tree yet
    if (this._root === null){
        this._root = node;
    } else {
        var current = this._root;

        while(true){
            //if the new value is less than this node's value, go left
            if (value < current.value){
                //if there's no left, then the new node belongs there
                if (current.left === null){
                    current.left = node;
                    break;
                } else {
                    current = current.left;
                }
                //if the new value is greater than this node's value, go right
            } else if (value > current.value){
                //if there's no right, then the new node belongs there
                if (current.right === null){
                    current.right = node;
                    break;
                } else {
                    current = current.right;
                }
                //if the new value is equal to the current one, just ignore
            } else {
                break;
            }
        }
    }
};

BinarySearchTree.prototype.contains = function(value){
    var found       = false,
        current     = this._root

    //make sure there's a node to search
    while(!found && current){
        //if the value is less than the current node's, go left
        if (value < current.value){
            current = current.left;
            //if the value is greater than the current node's, go right
        } else if (value > current.value){
            current = current.right;
            //values are equal, found it!
        } else {
            found = true;
        }
    }
    //only proceed if the node was found
    return found;
};

BinarySearchTree.prototype.traverse = function(process, order){

    //helper function
    function inOrder(node){                 // sort - default
        if (node){
            //traverse the left subtree
            if (node.left !== null){
                inOrder(node.left);
            }
            //call the process method on this node
            process.call(this, node);
            //traverse the right subtree
            if (node.right !== null){
                inOrder(node.right);
            }
        }
    }
    function preOrder(node){
        if (node){
            //call the process method on this node
            process.call(this, node);
            //traverse the left subtree
            if (node.left !== null){
                preOrder(node.left);
            }
            //traverse the right subtree
            if (node.right !== null){
                preOrder(node.right);
            }
        }
    }
    function postOrder(node){
        if (node){
            //traverse the left subtree
            if (node.right !== null){
                postOrder(node.right);
            }
            //call the process method on this node
            process.call(this, node);
            //traverse the right subtree
            if (node.left !== null){
                postOrder(node.left);
            }
        }
    }
    //start with the root
    if(order =='pre') {
        preOrder(this._root);
    }else if(order =='post'){
        postOrder(this._root);
    }else{
        inOrder(this._root);
    }
};

BinarySearchTree.prototype.size = function(order){
    var length = 0;

    this.traverse(function(node){
        length++;
    }, order);

    return length;
};
BinarySearchTree.prototype.toArray = function(order){
    var result = [];

    this.traverse(function(node){
        result.push(node.value);
    }, order);

    return result;
};