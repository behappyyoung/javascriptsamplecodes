var fs = require('fs');
var indent = 0;
var showFiles = function(currentPath){
    indent++;
    fs.readdir(currentPath, function (err, files) { // '/' denotes the root folder
        if (err) throw err;
        files.forEach( function (file) {
            fs.lstat(file, function(err, stats) {
                if (!err && stats.isDirectory()) { //conditing for identifying folders
                    for(var i=0; i<indent;i++){
                        console.log(indent);
                    }
                    console.log(" \t dir -" + file);
                    showFiles(file);
                    indent--;
                }
                else{
                    console.log(indent);
                    console.log(file);
                }
            });
        });
    });
};

//showFiles('.');

var indent = 0;

var fs = require('fs');
var traverseFileSystem = function (currentPath) {
    indent++;
    if(indent>2) return;
    console.log("\n"+currentPath);
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
        var currentFile = currentPath + '/' + files[i];
        var stats = fs.statSync(currentFile);
        if (stats.isFile()) {
            console.log(currentFile);
        }
        else if (stats.isDirectory()) {
            traverseFileSystem(currentFile);
            indent--;
        }
    }
};
traverseFileSystem('.');
