function HanoiTower(){
    
    var steptext='';
    this.stepcount='';
    this.totaldisk;
    this.startpeg;
    this.endpeg;
    this.SourceArray = new Array();
    this.DestinationArray = new Array();
    this.SpareArray = new Array();
        
    this.addStep = function(disk, start, end){
        this.stepcount++;
        steptext += '<div style="clear:both;padding:10px;">step '+ this.stepcount +' - '+disk+' from '+start+' to '+end+"</div>  ";
      
        eval("this."+start+"Array.pop();");
        eval("this."+end+"Array.push(disk);");
           steptext += this.makeGraph();
     
        
    }
 
    this.makeGraph = function(){
        var graphText = '<div style="clear:both;"><div style="float:left;color:red;">';
      
        for(i=(this.totaldisk-1); i>=0; i--){
            
           if(this.SourceArray[i]!=undefined){
            for(j=0; j<this.SourceArray[i]; j++){
               graphText += 'M';  
            }
           }else{
                graphText += '  ';
           }
            graphText += '<br />';
        }
         graphText += '<div style="width:150px;float:left;color:blue;"> Source </div> <br />';
        graphText += '</div><div  style="float:left;color:red;">';
        
      for(i=(this.totaldisk-1); i>=0; i--){
            
             if(this.DestinationArray[i]!=undefined){
            for(j=0; j<this.DestinationArray[i]; j++){
               graphText += 'M';  
            }
           }else{
                graphText += '  ';
           }
            graphText += '<br />';
        }
        graphText += '<div style="width:150px;float:left;color:blue;"> Destination </div> <br />';
        graphText += '</div><div style="float:left;color:red;">';
        
       for(i=(this.totaldisk-1); i>=0; i--){
           
           if(this.SpareArray[i]!=undefined){
            for(j=0; j<this.SpareArray[i]; j++){
               graphText += 'M';  
            }
           }else{
                graphText += '  ';
           }
            graphText += '<br />';
        }
        graphText += '<div style="width:150px;float:left;color:blue;">Spare </div>';
        graphText += '</div></div><br />';
        
        return graphText;
        
        
    }
    
    this.getDiskInput = function(diskinput){
        this.totaldisk = diskinput;
        for(var i = diskinput; i > 0 ; i--){
            this.SourceArray.push(i);
        }
          steptext += this.makeGraph();
    }
       
    this.moveDisks = function(disk, source, dest, spare){
        if(disk==1){  
            this.addStep(disk, source, dest);
        }else{
          this.moveDisks(disk-1, source, spare, dest);
            this.addStep(disk, source, dest);
          this.moveDisks(disk-1, spare, dest, source);
        }
    }
    
    
       
    this.printSteps =  function(){
        document.write( steptext);
    }
   
    this.getSteps =  function(){
       return  steptext;
    }
}
