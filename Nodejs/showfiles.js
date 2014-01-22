var fs = require('fs');
fs.readdir('.', function (err, files) { // '/' denotes the root folder
  if (err) throw err;

   files.forEach( function (file) {
     fs.lstat(file, function(err, stats) {
       if (!err && stats.isDirectory()) { //conditing for identifying folders
           // $('ul#foldertree').append('<li class="folder">'+file+'</li>');
		console.log('dir -' + file);
       }
       else{
           // $('ul#foldertree').append('<li class="file">'+file+'</li>');
		console.log(file);
      }
     });
   });
});

