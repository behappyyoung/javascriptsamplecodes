document.getElementById('myDiv').addEventListener('click', function(e) {
	window.print();

}, false);



document.getElementById('printDiv').addEventListener('click', function(e) {
	
	
// 	 var mywindow = window.open('', 'my div', 'height=595,width=842');	// A4 size
// 	 var str = this.innerHTML;
// 		 mywindow.document.write('<html><head>');
//         mywindow.document.write('<style>@page{ size: auto;   margin: 0mm;  }');
//     mywindow.document.write('html    {        background-color: #FFFFFF;   margin: 0px; }');
//     mywindow.document.write(' body        {background-color:#FFFFFF;   margin: 0px;  }');
//     	mywindow.document.write('div#printDiv{    height: 50px;  width: 300px;');
//             mywindow.document.write('background-color: #808000;padding:50px; }</style>');

//         mywindow.document.write('</head><body >');
//         mywindow.document.write(str);
//         console.log(str);
//         mywindow.document.write(encodeURI(str));
//         mywindow.document.write('</body></html>');
// //        mywindow.document.close(); // necessary for IE >= 10
// //        mywindow.focus(); // necessary for IE >= 10

//         mywindow.print();
// //        mywindow.close();

        var title = document.title;
        var divElements = document.getElementById('printDiv').innerHTML;
        var printWindow = window.open("", "_blank", 'height=595,width=842');
        //open the window
        printWindow.document.open();
        //write the html to the new window, link to css file
        printWindow.document.write('<html><head><title>' + title + '</title><link rel="stylesheet" type="text/css" href="/print.css"></head><body><div id="printingDiv">');
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