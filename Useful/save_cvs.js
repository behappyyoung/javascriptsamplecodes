
  var exportTableToCSV = function($table) {
                    //------------------------------------------------------------
                // Helper Functions 
                //------------------------------------------------------------
                // Format the output so it has the appropriate delimiters
                function formatRows(rows){
                    return rows.get().join(tmpRowDelim)
                        .split(tmpRowDelim).join(rowDelim)
                        .split(tmpColDelim).join(colDelim);
                }
                // Grab and format a row from the table
                function grabRow(i,row){
                     
                    var $row = $(row);
                    //for some reason $cols = $row.find('td') || $row.find('th') won't work...
                    var $cols = $row.find('td'); 
                    if(!$cols.length) $cols = $row.find('th');  

                    return $cols.map(grabCol)
                                .get().join(tmpColDelim);
                }
                // Grab and format a column from the table 
                function grabCol(j,col){
                    var $col = $(col),
                        $text = $col.text();

                    return $text.replace('"', '""'); // escape double quotes

                }

                var $headers = $table.find('tr:has(th)')
                    ,$rows = $table.find('tr:has(td)')

                    // Temporary delimiter characters unlikely to be typed by keyboard
                    // This is to avoid accidentally splitting the actual contents
                    ,tmpColDelim = String.fromCharCode(11) // vertical tab character
                    ,tmpRowDelim = String.fromCharCode(0) // null character

                    // actual delimiter characters for CSV format
                    ,colDelim = '","'
                    ,rowDelim = '"\r\n"';

                    // Grab text from table into CSV formatted string
                    var csv = '"';
                    csv += formatRows($headers.map(grabRow));
                    csv += rowDelim;
                    csv += formatRows($rows.map(grabRow)) + '"';
                return csv;
            }

     

     var save_div = function(){
        var divElements = $('.for-print').html();
         var date = new Date;
         var title = $('.sub-title').text() + date.toLocaleDateString();
        dom_parser = new DOMParser().parseFromString(divElements, 'text/html');

        // documentElement always represents the root node
        window.dom_parser = dom_parser;        
        table = dom_parser.documentElement.childNodes[1].childNodes[0];
         
        var csvContent = "data:text/csv;charset=utf-8,";
        csvContent += exportTableToCSV( $('.for-print table'));
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", title + ".csv");
        document.body.appendChild(link); // Required for FF

       link.click();
    }

  var exportTableToCSV_withdiv = function($table) {
      //------------------------------------------------------------
      // Helper Functions
      //------------------------------------------------------------
      // Format the output so it has the appropriate delimiters
      function formatRows(rows){

          var r = rows.get();
          console.log('before rows', rows, r);

          for(var i=0;i<rows.length;i++){
              // console.log(rows[i], typeof rows[i]);
              if(rows[i]==''){
                  // console.log(typeof rows[i], 'what?');
                  rows.splice(i, 1);
              }else{
                  console.log('no')
              }

          }
          for(var i=0;i<r.length;i++){
              // console.log(rows[i], typeof rows[i]);
              if(r[i]==''){
                  // console.log(typeof rows[i], 'what 2?');
                  r.splice(i, 1);
              }else{
                  console.log('no')
              }

          }
          console.log('after rows', rows, r);
          return r.join(tmpRowDelim).split(tmpRowDelim).join(rowDelim).split(tmpColDelim).join(colDelim);
          // return rows.get().join(tmpRowDelim).split(tmpRowDelim).join(rowDelim).split(tmpColDelim).join(colDelim);
      }
      // Grab and format a row from the table
      function grabRow(i,row){

          var $row = $(row);
          //for some reason $cols = $row.find('td') || $row.find('th') won't work...
          if($row.hasClass("ng-hide") || $row.hasClass("print-exclude") || $row.hasClass("hide")){
              return null;
          }
          var $cols = $row.find('td');
          if(!$cols.length) $cols = $row.find('th');

          var columnText = $cols.map(grabCol).get().join(tmpColDelim);
          // console.log('columnText', columnText);
          // return $cols.map(grabCol).get().join(tmpColDelim);
          return columnText
      }
      // Grab and format a column from the table
      function grabCol(j,col){
          var $col = $(col),
              $text = $col.text();
          // console.log('in td text',$col,  $text, $col.html(),  $text.replace(/\s+/g, '\n') );
          if($col.hasClass("ng-hide") || $col.hasClass("print-exclude") || $col.hasClass("hide")){
              return '';
          }
          if($col.hasClass("single-line")){
              $text = $text.replace('"', '').replace(/\s+/g, ' ');
          }
          if($col.hasClass("multi-line")){
              $text = $text.replace(/\s+/g, '\n');
          }
          // $text = $text.replace(' ', '');
          return $text.replace('"', '""'); // escape double quotes

      }

      var $headers = $table.find('tr:has(th)')
          ,$rows = $table.find('tr:has(td)')

          // Temporary delimiter characters unlikely to be typed by keyboard
          // This is to avoid accidentally splitting the actual contents
          ,tmpColDelim = String.fromCharCode(11) // vertical tab character
          ,tmpRowDelim = String.fromCharCode(0) // null character

          // actual delimiter characters for CSV format
          ,colDelim = '","'
          ,rowDelim = '"\r\n"';

      // Grab text from table into CSV formatted string
      var csv = '"';
      csv += formatRows($headers.map(grabRow));
      csv += rowDelim;
      csv += formatRows($rows.map(grabRow)) + '"';
      // return 'test';
      return csv;


  }

  var save_div_new = function(needClass=false, addclass=" "){
      var divElements = $('.for-save').html();
      var date = new Date;
      if($('.print-title'+addclass).text() == ''){
          var title = $('.sub-title'+addclass).text().trim() + date.toLocaleDateString();
      }else{
          var title = $('.print-title'+addclass).text().trim()+ date.toLocaleDateString();
      }

      dom_parser = new DOMParser().parseFromString(divElements, 'text/html');

      // documentElement always represents the root node
      window.dom_parser = dom_parser;
      table = dom_parser.documentElement.childNodes[1].childNodes[0];

      var csvContent = "data:text/csv;charset=utf-8,";
      items = $('.print-items'+addclass);
      for(var i=0;i<items.length;i++){
          console.log($(items[i]).text(), $(items[i]).hasClass("print-exclude"));
          if($(items[i]).hasClass("ng-hide") || $(items[i]).hasClass("print-exclude")){
              continue;
          }else{
              csvContent += $(items[i]).text() + "\r\n"
          }

      }
      csvContent += "\r\n"
      // console.log('before', csvContent);
      if(needClass){
          csvContent += exportTableToCSV_withdiv( $('.for-save table'+addclass));
      }else{
          csvContent += exportTableToCSV_withdiv( $('.for-save table'));
      }
      // console.log('after', csvContent);
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", title + ".csv");
      document.body.appendChild(link); // Required for FF

      link.click();
  }
