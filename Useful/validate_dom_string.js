function validate(input_html){
  var dom_arr = [];
  var current_dom = '';
  var prev_dom = '';
  var current_str = '';
  var dom_start = true;
  var open_dom = false;

  
  for(var i=0;i<input_html.length;i++){
      if(input_html[i]=='<'){
          dom_start = true;

          if(input_html[i+1] == '/'){
               open_dom = false;            
          }else{

            open_dom = true;
          }
          
        
      }else if(input_html[i]=='>'){
        if(!dom_start){
          return {result: false, message: 'not correct'};
        }
        current_dom += '>';
        if(open_dom){
          dom_arr.push(current_dom);
          current_dom = '';  
          dom_start = false; 
        }else{
          if(dom_arr.length ==0 ){

            return {result: false, message: 'no open dom'};
          }
          prev_dom = dom_arr.pop();
          if(prev_dom.slice(1)!=current_dom.slice(2)){
               console.log('compare',dom_arr, prev_dom, current_dom, prev_dom.slice(1), current_dom.slice(2));
              return {result: false, message: 'close dom and open dom does not match'};
          }else{
            console.log('compare',dom_arr, prev_dom, current_dom, prev_dom.slice(1), current_dom.slice(2));
          }
          dom_start = false;
          current_dom = '';
        }
        
        
      }
      
      if(dom_start){
        current_dom += input_html[i];
      }
      
  }
  if(dom_arr.length ==0 ){
    return {result: true, message: 'dom html is correct'};
  }else{
    return {result: false, message: 'no close dom'};
  }
  
}

 jQuery(document).ready(function() {

     
var test_html = $('#test-html').html().trim();
var input_html = '<div>input html </div>nn<p></p>';
var test_text = $('#test-html').text().trim();

console.log(test_html, test_html[1]);
console.log(input_html);
$('#result').html(validate(test_html).message);
console.log(validate(input_html));


  
});



