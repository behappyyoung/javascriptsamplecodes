/**
 * Created by youngsug on 5/21/2016.
 */


function Graph() {
    var vertices = this.vertices = {};    // Key = vertex, value = array of neighbors.

    this.addEdge = function (u, v) {
        if (vertices[u] === undefined) {  // Add the edge u -> v.
            vertices[u] = [];
        }
        vertices[u].push(v);
        if (vertices[v] === undefined) {  // Also add the edge v -> u so as
            vertices[v] = [];               // to implement an undirected graph.
        }                                  // For a directed graph, delete
        vertices[v].push(u);              // these four lines.
    };

    return this;
}
function bfs(graph, source) {
    var queue = [ { vertex: source, count: 0 } ],
        visited = { source: true },
        tail = 0;
    while (tail < queue.length) {
        print('s' , queue, visited, tail);
        var cv = queue[tail].vertex,             // cv = current vertex ( start = source )
            count = queue[tail].count;         // Pop a vertex off the queue.
        tail++;
//        print('n' , queue, cv, tail);
        print('distance from ' + source + ' to ' + cv + ': ' + count);
        graph.vertices[cv].forEach(function (v) {
print('v' , cv, v);
            if (!visited[v]) {
                visited[v] = true;
                queue.push({ vertex: v, count: count + 1 });
            }
        });

    }
}

function shortestPath(graph, source, target) {
    if (source == target) {   // Delete these four lines if
        print(source);          // you want to look for a cycle
        return;                 // when the source is equal to
    }                         // the target.
    var queue = [ source ],
        visited = { source: true },
        predecessor = {},
        tail = 0;
    while (tail < queue.length) {
        var u = queue[tail++],  // Pop a vertex off the queue.
            vertices = graph.vertices[u];
        for (var i = 0; i < vertices.length; ++i) {
            var v = vertices[i];
            if (visited[v]) {
                continue;
            }
            visited[v] = true;
            if (v === target) {   // Check if the path is complete.
                var path = [ v ];   // If so, backtrack through the path.
                while (u !== source) {
                    u = predecessor[u];
                    path.push(u);
                }
                path.reverse();
                print(path.join(' -> '));
                return;
            }
            predecessor[v] = u;
            queue.push(v);
        }
    }
    print('there is no path from ' + source + ' to ' + target);
}

function print() {  // A quick and dirty way to display output.
    for(arg in arguments){
        console.log(arguments[arg]);
    }
}

var graph = new Graph();
graph.addEdge('A', 'B');
graph.addEdge('B', 'C');
graph.addEdge('B', 'E');
graph.addEdge('C', 'D');
graph.addEdge('C', 'E');
graph.addEdge('C', 'G');
graph.addEdge('D', 'E');
graph.addEdge('E', 'F');
print(graph);
bfs(graph, 'A');
print();
shortestPath(graph, 'B', 'G');
print();
shortestPath(graph, 'G', 'A');
shortestPath(graph, 'A', 'F');
