/**
 * Created by youngsug on 5/18/2016.
 */

function processData(input) {
    //Enter your code here
    var inputArray = input.split('\n');
    console.log(inputArray);
    var testCase = parseInt(inputArray[0]);

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
        this.add = function(n){
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

    var times = new minHeap();
    var ariveTime, processTime, realWating;
    var timeObj={}
    for(var i=1;i<=testCase; i++){
        ariveTime =  parseInt(inputArray[i].split(' ')[0]);
        processTime =  parseInt(inputArray[i].split(' ')[1]) ;
        timeObj[ariveTime] = processTime;
    }

    console.log(timeO);
    for(ariveTime in timeObj){
        times.add(timeObj[ariveTime]);
    }
    console.log(times.myHeap);
    var currentWait=0, prev=0, totalWait=0, pastwaiting=0;
    for(i=0;i<testCase;i++){
        pastwaiting = (i-1 )? i-1 : 0;
        currentWait = times.getMin() + prev - pastwaiting ;
        prev = currentWait;
        totalWait += currentWait;
    }

    console.log(times.myHeap);
    console.log(parseInt(totalWait/testCase));

}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {

  //  var testinput ='3\n0 3\n1 9\n2 6\n';

    _input += input;
    processData(_input);
});

process.stdin.on("end", function () {
    processData(_input);
});

