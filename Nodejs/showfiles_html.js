/**
 * Created by young on 1/21/14.
 */
var window = require('jsdom').createWindow();
window.document = require('jsdom').jsdom();
var $ = require('jquery')(window);
//var jQuery = require('jquery').create(window);
var http = require('http');
fs = require('fs');

function readFile(){
    fs.readdir('.', function (err, files) { // '/' denotes the root folder
        if (err) throw err;

        files.forEach( function (file) {
            fs.lstat(file, function(err, stats) {
                if (!err && stats.isDirectory()) { //conditing for identifying folders

                    $('ul#foldertree').append('<li class="folder">'+file+'</li>');
                    console.log(file + $("ul#foldertree").text());
                }
                else{

                    $('ul#foldertree').append('<li class="file">'+file+'</li>');
                    console.log(file + $("ul#foldertree").text());
                }
            });
        });
    });

}
http.createServer(function(req, res){
    fs.readFile('showfiles.html',function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        console.log(data);
        res.write(data);

        res.end();
    });
    fs.readdir('.', function (err, files) { // '/' denotes the root folder
        if (err) throw err;

        files.forEach( function (file) {

            console.log(file + $("ul#foldertree").text());
            fs.lstat(file, function(err, stats) {
                if (!err && stats.isDirectory()) { //conditing for identifying folders

                    $('body').append(file);


                }
                else{

                    $('body').append(file);

                }
            });
        });
    });


}).listen(8000);