function HanoiTower(){

    var steptext='';
    this.stepcount='';
    this.totaldisk;
    this.startpeg;
    this.endpeg;

    this.addStep = function(disk, start, end){
        this.stepcount++;
        steptext += 'step '+ this.stepcount +' - '+disk+' from '+start+' to '+end+"<br />";
    }

    this.getDiskInput = function(diskinput){
        this.totaldisk = diskinput;
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

function showStep(){
    hanoi = new HanoiTower();
    var disk = document.getElementById("totaldisk").value;
    if(disk > 1){
        hanoi.getDiskInput(disk);
        hanoi.moveDisks(hanoi.totaldisk, 'Source', 'Destination', 'Spare');
        var steptext = hanoi.getSteps();
        document.getElementById("stepdiv").innerHTML = steptext;
    }else{
        document.getElementById("stepdiv").innerHTML = "HANOI TOWER";
    }


}
/**
 * Created by young on 5/20/14.
 */
