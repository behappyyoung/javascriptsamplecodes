/**
 * Created by young on 1/21/14.
 */
var jsdom = require('jsdom').jsdom();
var window = jsdom.parentWindow;
var $ = require('jquery')(window);
var http = require('http');
fs = require('fs');

function readFile(){
    fs.readdir('.', function (err, files) { // '/' denotes the root folder
        if (err) throw err;

        files.forEach( function (file) {
            fs.lstat(file, function(err, stats) {
                if (!err && stats.isDirectory()) { //conditing for identifying folders

                    $('ul#foldertree').append('<li class="folder">'+file+'</li>');
                    console.log($("ul#foldertree").text());
                }
                else{

                    $('ul#foldertree').append('<li class="file">'+file+'</li>');
                    console.log($("ul#foldertree").text());
                }
            });
        });
    });

}
http.createServer(function(req, res){
    fs.readFile('showfiles.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        readFile();
        res.end();
    });
}).listen(8000);