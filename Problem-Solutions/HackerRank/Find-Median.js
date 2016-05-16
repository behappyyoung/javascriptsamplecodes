/**
 * Created by youngsug on 5/12/2016.
 */

function processData(input) {
    //Enter your code here
    var inputArray = input.split('\n');
    //console.log(inputArray);
    var testCase = parseInt(inputArray[0]);
    var output=[], median=0;
    var minHeap = function(){
        this.myHeap = [];
        this.getSize = function(){
            return this.myHeap.length;
        };
        this.swap = function(i, j){             // swap;
            var temp;
            temp = this.myHeap[i];
            this.myHeap[i] = this.myHeap[j];
            this.myHeap[j] = temp;

        };
        this.bubble = function(i){
            var pi = Math.floor(i/2);  // parent's index
            if(this.myHeap[i] < this.myHeap[pi]){
                this.swap(i, pi);
                this.bubble(pi);
            }
        };
        this.bubble_down = function(i){
            var ci = (this.myHeap[i*2+1] > this.myHeap[i*2 +2]) ? i*2+2: i*2+1;  // child index choose small one

            if(this.myHeap[ci]<this.myHeap[i]){
                this.swap(ci, i);
                this.bubble_down(ci)
            }
        };
        this.addHeap = function(n){
            this.myHeap.push(n);
            this.bubble(this.myHeap.length-1);
        };
        this.peakMin = function(){
            return this.myHeap[0];
        }
        this.getMin = function(){
            this.swap(0, this.myHeap.length-1);
            var min= this.myHeap.pop();
            this.bubble_down(0);
            return min;
        }
    };
    var maxHeap = function(){
        this.myHeap = [];
        this.getSize = function(){
            return this.myHeap.length;
        };
        this.swap = function(i, j){             // swap;
            var temp;
            temp = this.myHeap[i];
            this.myHeap[i] = this.myHeap[j];
            this.myHeap[j] = temp;

        };
        this.bubble = function(i){
            var pi = Math.floor(i/2);  // parent's index
            if(this.myHeap[i] > this.myHeap[pi]){
                this.swap(i, pi);
                this.bubble(pi);
            }
        };
        this.bubble_down = function(i){
            var ci;
            if(i===0){
                ci = (this.myHeap[1] < this.myHeap[2]) ? 2:1;
            }
            else{
                ci = (this.myHeap[i*2] < this.myHeap[i*2 +1]) ? i*2+1: i*2;  // child index choose big one
            }

            if(this.myHeap[ci]>this.myHeap[i]){
                this.swap(ci, i);
                this.bubble_down(ci)
            }
        };
        this.addHeap = function(n){
            this.myHeap.push(n);
            this.bubble(this.myHeap.length-1);
        };
        this.peakMax = function(){
            return this.myHeap[0];
        };
        this.getMax = function(){
            this.swap(0, this.myHeap.length-1);
            var max=this.myHeap.pop();
            this.bubble_down(0);
            return max;
        }
    };
    var minNode = new minHeap();           // keep it default -
    var maxNode = new maxHeap();
    var current,  smallmax, bigmin;
    current = parseInt(inputArray[1]);
    maxNode.addHeap(current);
    median = current;
    output.push(median.toFixed(1));
    for(var i=2; i<=testCase;i++) {
        current = parseInt(inputArray[i]);
    /*    if (maxNode.getSize() > minNode.getSize()){
            median = maxNode.peakMax();
        }else{
            median =( maxNode.peakMax() + minNode.peakMin() )/2;
        }
*/

        if( current < median ){
            //prev = maxNode.getMax();
            maxNode.addHeap(current);
            if (maxNode.getSize() == minNode.getSize()+1) {
                median = maxNode.peakMax();
            }else if (maxNode.getSize() > minNode.getSize()+1) {
                smallmax = maxNode.getMax();
                minNode.addHeap(smallmax);
                bigmin = smallmax;
                smallmax= maxNode.peakMax();
                median = (bigmin + smallmax)/2;
            }
        }else{
            minNode.addHeap(current);
            if(maxNode.getSize() == minNode.getSize()) {
                median = ( maxNode.peakMax() + minNode.peakMin() ) / 2;

            }else if (maxNode.getSize() < minNode.getSize()) {
                bigmin= minNode.getMin();
                maxNode.addHeap(bigmin);
                median = bigmin;
            }
        }

        console.log(i, current , maxNode , minNode, median );
         output.push(median.toFixed(1));
    }


    
    console.log(output.join('\n'));

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {

    var testinput ='10\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10';
    processData(testinput);

//    _input += input;

});

process.stdin.on("end", function () {
    processData(_input);
});

