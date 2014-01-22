var http = require("http");
var fs = require('fs');
var fileText = '--';
var filesize = 0;
function readFile(){

    fs.readdir('.', function (err, files) { // '/' denotes the root folder
        if (err) throw err;

        files.forEach( function (file) {


            fs.lstat(file, function(err, stats) {

                if (!err && stats.isDirectory()) { //conditing for identifying folders
                    fileText += 'dir = ' + file + "\n" ;
                }
                else{
                    fileText += 'file = ' + file + "\n";
                }
            });
        });
    });


}

function onRequest(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});

    fileText += 'start';
    var myText = readFile();
    fileText += 'end';
    response.write(fileText);
    response.end();

}

http.createServer(onRequest).listen(8888);




