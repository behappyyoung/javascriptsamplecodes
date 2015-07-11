/**
 * Created by young on 4/15/15.
 */

var maze = [];      // for maze


maze[0] = ['#','#','#','#','#','#','#','#','#','#','#','#'];
maze[1] = ['#','x','x','x','#','x','x','x','x','x','x','#'];
maze[2] = ['x','x','#','x','#','x','#','#','#','#','x','#'];
maze[3] = ['#','#','#','x','#','x','x','#','x','#','x','#'];
maze[4] = ['#','x','x','x','#','#','#','#','x','#','x','x'];
maze[5] = ['#','#','#','#','x','#','x','#','x','#','x','#'];
maze[6] = ['#','x','x','#','x','#','x','#','x','#','x','#'];
maze[7] = ['#','#','x','#','x','#','x','#','x','#','x','#'];
maze[8] = ['#','x','x','x','x','x','x','x','x','#','x','#'];
maze[9] = ['#','#','#','#','#','#','x','#','#','#','x','#'];
maze[10] = ['#','x','x','x','x','x','x','#','x','x','x','#'];
maze[11] = ['#','#','#','#','#','#','#','#','#','#','#','#'];


var width = maze[0].length, height=maze.length;                   // maze size
var startx = 0, starty=0;                                           // start position
var endx = width-1, endy = height-1;                            // end position

var pathmaze= [];          // for correct path

for(var i=0;i<height; i++){
    pathmaze[i] = new Array(width);
    for(var j=0; j<width;j++){
        pathmaze[i][j]= '0';
    }
}


var passed = [];  // check if already passed

for(var i=0;i<height; i++){
    passed[i] = new Array(width);
    for(var j=0; j<width;j++){
         passed[i][j]= false;
    }
}

function showMaze(currentmaze){
    var mazeText = '';
    for(var i=0;i<height; i++){
        for(var j=0; j<width;j++){
            mazeText += ' '+  currentmaze[i][j];
        }
        mazeText += '<br />'
    }
    return mazeText;
}


function solveMaze(x, y){
    if (x == endx && y == endy) {                                    // reached end
        console.log('end');
        pathmaze[y][x] = '*';
        return true;
    }
    if (maze[y][x] == 'x' || passed[y][x]) return false;            // blocked or passed before.

    passed[y][x] = true;

    if (x != 0)
        if(solveMaze(x-1, y)) {
            pathmaze[y][x] = '*';
            return true;
        }
    if (x != width - 1)
        if (solveMaze(x+1, y)) {
            pathmaze[y][x] = '*';
            return true;
        }
    if (y != 0)
        if (solveMaze(x, y-1)) {
            pathmaze[y][x] = '*';
            return true;
        }
    if (y != height- 1)
        if (solveMaze(x, y+1)) {
            pathmaze[y][x] = '*';
            return true;
        }
}


var resultText = ' Maze <br />';

resultText += showMaze(maze);

var findway = solveMaze(0,0);

resultText += '<br /> Result Maze : <br />';

resultText += showMaze(pathmaze);

document.getElementById('result').innerHTML = resultText;