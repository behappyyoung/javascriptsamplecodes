function calcInput(current){
   var stdin = process.stdin, stdout = process.stdout;
   var myarray = current;
 
   stdin.resume();
   stdin.setEncoding('utf8');
   stdout.write('>');
   stdin.once('data', function(data){
     var input = data.toString().trim();

     if(input=='q'){
         var outtext = (myarray.length==1) ? 'Result : ' : ' Remaining number in stack : ';
         stdout.write(outtext + myarray.toString() + '\n goodbye \n' );
         process.exit();
      }else if(/^([0-9]+)$/.test(input)){
               myarray.push(input);
               stdout.write(input+'\n');
               calcInput(myarray);
      }else if(/[+-/*]/.test(input)){
           if(myarray.length < 2){
             stdout.write('need more numbers before operand \n');
             calcInput(myarray);
           }else{
              var last = myarray.pop();
	      if((input=='/')&&(last==0)){
                 stdout.write('cannot calculate \n');
                 myarray.push(last);
		 calcInput(myarray);
	      }else{
                var slast = myarray.pop();
                var result = eval(slast+ input + last);
                stdout.write(result + '\n');
                myarray.push(result);
                calcInput(myarray);
              }
           }
       }else{
          stdout.write('wrong input \n');
          calcInput(myarray);
       }
    });
}

var myarray = new Array();
calcInput(myarray);
