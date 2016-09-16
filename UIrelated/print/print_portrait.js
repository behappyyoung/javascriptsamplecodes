document.getElementById('myDiv').addEventListener('click', function(e) {
	window.print();

}, false);



document.getElementById('printDiv').addEventListener('click', function(e) {
	

        var title = document.title;
        var divElements = document.getElementById('printDiv').innerHTML;
        var printWindow = window.open("", "_blank", 'height=595,width=842');
        //open the window
        printWindow.document.open();
        //write the html to the new window, link to css file
        printWindow.document.write('<html><head><title>' + title + '</title><link rel="stylesheet" type="text/css" href="/print_portrait.css?v1"></head><body><div id="printingDiv">');
        printWindow.document.write(divElements);
        printWindow.document.write('</div></body></html>');
        printWindow.document.close();
        printWindow.focus();
        //The Timeout is ONLY to make Safari work, but it still works with FF, IE & Chrome.
     setTimeout(function() {
             printWindow.print();
             printWindow.close();
         }, 100);

}, false);