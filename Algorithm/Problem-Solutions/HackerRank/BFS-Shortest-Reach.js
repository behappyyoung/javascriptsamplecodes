/**
 * Created by youngsug on 5/21/2016.
 */

function processData(input) {
    //Enter your code here
    var parse_fun = function (s) {
        return parseInt(s, 10);
    };

    function print() {  // A quick and dirty way to display output.
        for(arg in arguments){
            console.log(arguments[arg]);
        }
    }


    var lines = input.split('\n');
    var testCase = parseInt(lines.shift());
    //console.log(lines);

    while(lines.length>0){
        var VL = lines.shift().split(' ');
        var V = VL[0];
        var L = VL[1];
        var myGraph = new Graph();

        for(var i=0; i<L; i++){
            myGraph.add(lines.shift());
        }
        var startV = parseInt(lines.shift(), 10);
        console.log(myGraph, myGraph.vertices);
        //solve
        bfs(myGraph, startV);
    }

    function Graph() {
        var vertices = this.vertices = {};
        this.add = function(inputline){
            var input = inputline.split(' ').map(parse_fun);
            var vertex = input[0];
            var line = input[1];

            if(typeof vertices[vertex] === 'undefined'){
                vertices[vertex] = [line];

            }else{
                console.log('vertex', vertices[vertex]);
                vertices[vertex].push(line);
            }
        }
    }

    function bfs(graph, source) {
        var queue = [ { vertex: source, count: 0 } ],
            visited = { },
            tail = 0;
            visited[source]= true;
        while (tail < queue.length) {
            print('s' , queue, visited, tail);
            var cv = queue[tail].vertex,             // cv = current vertex ( start = source )
                count = queue[tail].count;         // Pop a vertex off the queue.
            tail++;
        print('n' , queue, cv, tail, graph.vertices[cv]);
            print('distance from ' + source + ' to ' + cv + ': ' + count);

            for(var i=0; i<graph.vertices[cv].length; i++){
     //           print(graph.vertices[cv][i]);
                if (!visited[cv]) {
                    visited[cv] = true;
                    queue.push({ vertex: cv, count: count + 1 });
                }
            }
            /*
            graph.vertices[cv].forEach(function (v) {
                print('v' , cv, v);
                if (!visited[v]) {
                    visited[v] = true;
                    queue.push({ vertex: v, count: count + 1 });
                }
            });
            */

        }
    }

    /*
    var index = 1;
    for (var i = 0; i < testCase; i++) {
        var N = parseInt(lines[index].split(' ')[0]);
        var M = parseInt(lines[index].split(' ')[1]);
        var graphInput = lines.slice(index + 1, M + index + 1);
        index += M + 1;
        var S = parseInt(lines[index]);
        index += 1;
        var graph = buildGraphFromInput(N, graphInput);
        console.log(graph);
      //  console.log(findShortestReach(graph, S));
        
    }


    function buildGraphFromInput(N, input) {
        var graph = { vertices: [] };

        for (var i = 0; i < N; i++) {
            graph.vertices.push({edges: [], visited: false, distance: 0});
        }
        for (var i = 0; i < input.length; i++) {
            var v1 = parseInt(input[i].split(' ')[0]);
            var v2 = parseInt(input[i].split(' ')[1]);
            graph.vertices[v1 - 1].edges.push(v2);
            graph.vertices[v2 - 1].edges.push(v1);
        }
        return graph;
    }

    function findShortestReach(graph, startNode) {
        var output = [];
        var queue = [];
        graph.vertices[startNode - 1].visited = true;
        queue.push(startNode);

        var item = null;
        while (item = queue.shift()) {
            var vertice = graph.vertices[item - 1];
            for (var i = 0; i < vertice.edges.length; i++) {
                if (!graph.vertices[vertice.edges[i] - 1].visited) {
                    queue.push(vertice.edges[i]);
                    graph.vertices[vertice.edges[i] - 1].visited = true;
                    graph.vertices[vertice.edges[i] - 1].distance = vertice.distance + 6;
                }
            }
        }

        for (var i = 0; i < graph.vertices.length; i++) {
            if (!graph.vertices[i].visited) {
                output.push(-1);
            } else if ((i + 1) !== startNode) {
                output.push(graph.vertices[i].distance);
            }
        }

        return output.join(' ');
    }
*/
}

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
    processData(_input);
});

