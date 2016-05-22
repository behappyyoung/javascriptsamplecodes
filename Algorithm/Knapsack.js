/**
 * Created by youngsug on 5/22/2016.
 */

function knapsack(MW, wt, val){           // max weight, weight array , value array, number of items
    var sack=[];
    for(var i=0; i<=val.length; i++){
        sack[i] = [];
        for ( var j=0; j<=MW; j++)
            sack[i][j] = 0;
    }

    for(var v=1; v<=val.length;v++){
        for(var w=1; w<=MW; w++){
            if ( i == 0 || w == 0){
                sack[v][w]=0;
            }
            if(wt[v-1] <= w){
                sack[v][w] = Math.max(val[v-1] + sack[v-1][w - wt[v-1]], sack[v-1][w]);
            }else{
                sack[v][w] = sack[v-1][w];
            }
        }

    }
    return sack;

}

var test = knapsack(5, [3, 5, 6], [3,2,6]);
console.log(test, test[3][5]);
test = knapsack(5, [3, 2, 4, 1], [100, 20, 60 , 40]);
console.log(test, test[4][5]);

test = knapsack(8, [3, 2, 4, 1], [100, 20, 60 , 40]);
console.log(test, test[4][8]);