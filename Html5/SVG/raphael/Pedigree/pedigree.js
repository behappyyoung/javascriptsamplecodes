
            // var JsonPed = [{id:'asn1', name: 'proband', father:'asn2', mother:'3', sex:'male', carrierStatus: 'affected'},
            //     {id:'asn2', name:'father', father:'4', sex:'male', carrierStatus: 'carrier'},
            //     {id:'3', name:'mother', father:'6', sex:'female', carrierStatus: 'carrier'},
            //     {id:'7', name: 'siblings', father:'asn2', mother:'3', sex:'female', carrierStatus: 'affected'},
            //     {id:'4', name:'grandfather',father:'5', sex:'male'},{id:'5', name:'grand grand father', sex:'male'}];
            var JsonPed = [{"sex":"male","id":"1234567891","name":"John Doe"},{"mother":"1234567892","sex":"female","id":"1234567898","name":"Jane Fox"},{"mother":"1234567892","sex":"female","id":"1234567896","name":"Jane Smith"},{"sex":"female","id":"1234567894","name":"Jane Smith"},{"mother":"1234567894","sex":"female","father":"1234567891","id":"1234567892","name":"Jane Doe"}];
            var updatedPed = [];
            var maxID  = 0;
            for( var i=0; i < JsonPed.length;i++){
                maxID = (JsonPed[i].id > maxID) ?JsonPed[i].id : maxID;
                if(typeof updatedPed[JsonPed[i].id] === 'undefined'){
                    updatedPed[JsonPed[i].id] = JsonPed[i];
                    updatedPed[JsonPed[i].id]['children'] = [];

                }else{
                    $.extend(updatedPed[JsonPed[i].id],  JsonPed[i]);
                }

                if(typeof updatedPed[JsonPed[i].father] === 'undefined') {
                    updatedPed[JsonPed[i].father] = {
                        id: JsonPed[i].father,
                        sex: 'male',
                        child: JsonPed[i].id,
                        children: [JsonPed[i].id],
                        carrierStatus: 'notknown'
                    };
                }else{
                    updatedPed[JsonPed[i].father]['children'].push(JsonPed[i].id)
                }

                if(typeof updatedPed[JsonPed[i].mother] === 'undefined') {
                    updatedPed[JsonPed[i].mother] = {
                        id: JsonPed[i].mother,
                        sex: 'female',
                        child: JsonPed[i].id,
                        children: [JsonPed[i].id],
                        carrierStatus: 'notknown'
                    };
                }else{
                    updatedPed[JsonPed[i].mother]['children'].push(JsonPed[i].id)
                }
            }

            maxID++;

            window.JsonPed = JsonPed;
            window.updatedPed = updatedPed;
            var paper, viewBox;

         window.onload = function() {


            /** Event handler for mouse wheel event.
                 */
                paper         = new Raphael(document.getElementById('paper'), 1000, 1000);
                viewBox = paper.setViewBox(0,0,paper.width,paper.height);
                var rSize = 20;                     // big size radius
                var sSize = 5;                      // small size  diameter
                var vLength = 100;                   // vertical line length
                var hLength = 100;                   // horizental line length
                var currentX, currentY;
                var viewStartX=0;
                var viewStartY=0;
                var tid;
                var current_pid, current_ped;
                var next_id = 100;
                var tempVar;
                var current_element;
                var paperLocations={};
                var newNodeType, cNodeType;
window.paperLocations = paperLocations;
                function hideLines(what){
                    var cElement = $('.'+what);
                    for(var i=0;i<cElement.length;i++){
                        var classes = cElement[i].getAttribute('class').split(' ');
                        if( classes[1] == 'display'){
                            paper.getById(classes[0]).attr('class', classes[0] + ' no-display '+what);
                        }

                    }
                }
                function removeShadow(id){
                    var temp;
                    temp = paper.getById(id+'-shadow-mainShadow');
                    if(temp != null ) temp.remove();
                    temp = paper.getById(id+'-shadow-topSelect');
                    if(temp != null ) temp.remove();
                    temp = paper.getById(id+'-shadow-topLine');
                    if(temp != null ) temp.remove();
                    temp = paper.getById(id+'-shadow-leftSelect');
                    if(temp != null ) temp.remove();
                    temp = paper.getById(id+'-shadow-leftLine');
                    if(temp != null ) temp.remove();
                }
                function showInfo(id){
                    hideLines('topselect');
                    hideLines('topline');
                    hideLines('leftline');
                    hideLines('leftselect');
                    hideLines('toptop');
                    hideLines('topvline');
                    hideLines('bottomselect');
                    hideLines('bottomline');
                    var toptop = paper.getById(id+'-shadow-topTop');
                    if( typeof toptop !== 'undefined' && toptop != null ){
                        paper.getById(id+'-shadow-topVline').attr('class', id + '-shadow-topVline display topvline');
                        toptop.attr('class', id + '-shadow-topTop display toptop');
                    }
                    paper.getById(id+'-shadow-topLine').attr('class', id + '-shadow-topLine display topline');
                    paper.getById(id+'-shadow-leftLine').attr('class', id + '-shadow-leftLine display leftline ');
                    paper.getById(id+'-shadow-topSelect').attr('class', id+'-shadow-topSelect display topselect');
                    paper.getById(id+'-shadow-leftSelect').attr('class', id + '-shadow-leftSelect display leftselect');
                    paper.getById(id+'-shadow-bottomLine').attr('class', id + '-shadow-bottomLine display bottomline ');
                    paper.getById(id+'-shadow-bottomSelect').attr('class', id+'-shadow-bottomSelect display bottomselect');

                }
                function nodeClick(id){
                    current_pid = id;
                    mousedown = false;
                    current_ped = updatedPed[id];
                    $('.info').css({display: 'block', left:currentX+20+'px', top:currentY});
                    // console.log('current_ped', current_ped, typeof current_ped);
                    var name = 'Name';
                    var sex = 'Gender';
                    if(typeof current_ped !== 'undefined'){
                        name = current_ped.name;
                        sex = current_ped.sex;
                    }
                    // $('.info .id').html(current_pid + ' / ' +  name + ' / ' + sex);
	                $('#personal #info_id').html(current_pid);
	                $('#personal #name').val(name);

                    $('input[name="carrier"]').prop('checked', false);

                    $('input[name="carrier"][value="'+ updatedPed[current_pid]['carrierStatus']+'"]').prop('checked', true);
                }
                function showDetails(id) {
                    var postionX = paper.getById(id).getBBox().x2;
                    var postionY = paper.getById(id).getBBox().y2;
                    $('#current_id').html(id + '/'+ postionX + '/'+ postionY+'/'+currentX+'/'+currentY);
                    $('.info').css({'display': 'block', 'left': currentX, 'top':currentY});
                }

                function createNewNode(sex){
                    current_ped = updatedPed[current_pid];
                    var cx = current_ped.px;
                    var cy = current_ped.py;
	                var newID = maxID++;
                    var siblings, pathString;
console.log('createnewnode', newNodeType, cNodeType);
                    if(newNodeType=='sibling'){
                        if(cNodeType == 'child'){
	                        updatedPed[newID]= {sex:sex, id:newID, carrierStatus:'unknown', children:[], father:current_ped.father, mother:current_ped.mother};
	                        updatedPed[current_ped.father].children.push(newID);
	                        updatedPed[current_ped.mother].children.push(newID);
                            addSiblings(newID);
                        }else{
                        	if(typeof current_ped.father === 'undefined'){
								createParents(current_pid);
	                        }
	                        updatedPed[newID]= {sex:sex, id:newID, carrierStatus:'unknown', children:[], father:current_ped.father, mother:current_ped.mother};
	                        updatedPed[current_ped.father].children.push(newID);
	                        updatedPed[current_ped.mother].children.push(newID);
	                        addSiblings(newID);
                        }
                    }else if(newNodeType=='child'){
                        // console.log('add child', newNodeType, cNodeType, current_pid);
                        if(cNodeType == 'child'){
                            var children = current_ped['children'];
                            if(children.length >0){
                                current_pid = children[children.length-1];
	                            current_ped = updatedPed[current_pid];      // last sibling
	                            updatedPed[newID]= {sex:sex, id:newID, carrierStatus:'unknown', children:[], father:current_ped.father, mother:current_ped.mother};
	                            updatedPed[current_ped.father].children.push(newID);
	                            updatedPed[current_ped.mother].children.push(newID);
                                addSiblings(newID);
                            }else{
                                addChild(sex);
                            }

                        }
                    }
                    myMenu.attr({'class':'no-display'});
                }
                function addSiblings(new_id, existing) {
                    var current_ped = updatedPed[current_pid];           // last sibling
	                if(existing){

	                }
	                var newSibling = updatedPed[new_id];

                    var siblings, pathString;
                    if(typeof current_ped.father !== 'undefined'){
                        siblings = updatedPed[current_ped.father]['children'];
                    }else if(typeof current_ped.mother !== 'undefined'){
                        siblings = updatedPed[current_ped.mother]['children'];
                    }else{
                        siblings = [];
                    }
console.log('add siblings', siblings);
                    var firstSibling = siblings[0];
                    var startPathx = paperLocations['c-'+firstSibling].px;
                    var startPathy = paperLocations['c-'+firstSibling].py+sSize;
	                var moveX =  hLength+rSize;
	                if(current_ped.children.length >0 ){

	                	if(current_ped.sex =='male'){
			                moveX =  -2*(hLength+rSize);
			                if(siblings.length == 2){
				                moveObjects(current_pid, 'right');
				                current_ped = updatedPed[current_pid];
			                }else{
				                current_ped = updatedPed[siblings[siblings.length-2]];
			                }
		                }else{
			                moveX =  2*(hLength+rSize);
			                if(siblings.length == 2){
				                moveObjects(current_pid, 'left');
				                current_ped = updatedPed[current_pid];
			                }else{
				                current_ped = updatedPed[siblings[siblings.length-2]];
			                }
		                }

	                }else{
		                if(siblings.length == 2){
			                moveNode(current_pid, '', -moveX, 0);
			                moveX += moveX;

		                }else{
			                current_ped = updatedPed[siblings[siblings.length-2]];
			                moveX += moveX;

		                }
	                }


	                var cx = current_ped.px;
	                var cy = current_ped.py;
					var newx = cx+moveX;
	                var newy = cy;
	                var temp = getObjectByPosition(newx, newy);
	                var temp2 = getObjectByPosition(cx + hLength+rSize, newy);
console.log(temp, temp2);
	                if(temp.length >0 ){
		                if(moveX > 0){
			                moveObjects(temp[0].id, 'right');
		                }else{
			                moveObjects(temp[0].id, 'left');
		                }
	                }else if(temp2.length>0){
		                if(moveX > 0){
			                moveObjects(temp2[0].id, 'right');
			                moveObjects(temp2[0].id, 'right');
		                }else{
			                moveObjects(temp2[0].id, 'left');
			                moveObjects(temp2[0].id, 'left');
		                }
	                }

                    if(newSibling.sex =='male'){
                        var newNode = paper.rect(cx+moveX-rSize, cy-rSize, 2*rSize, 2*rSize ).attr({fill:'white'});
                    }else{
                        var newNode = paper.circle(cx+moveX, cy, rSize).attr({fill:'white'});
                    }
                    newNode.id = new_id;
                    newNode.click(function () {
                        nodeClick(this.id);
                    });
                    var newNodeText = paper.text(cx+moveX, cy, ' ').attr({'font-size':16 });
                    newNodeText.id = newNode.id+'-text';
                    var newS = createShadow(cx+moveX, cy, newNode.id + '-S', true);
                    newS.id = newNode.id + '-S';
                    pathString = getPathString(startPathx, startPathy, cx+moveX, cy-rSize, true);
                    // console.log('pathstring', pathString);
                    var cPath = paper.path(pathString);
                    cPath.id = newNode.id+'-cPath';
                    cPath.toBack();
                    ///////////// add children to father, mother
                    // updatedPed[newNode.id]= {sex:sex, id:newID, carrierStatus:'unknown', children:[], father:current_ped.father, mother:current_ped.mother, px:cx+moveX, py:cy };
	                newSibling.px = cx+moveX;
	                newSibling.py = cy;

                }

                function addChild(sex, withid) {
                    current_ped = updatedPed[current_pid];
	                if(typeof withid !== 'undefined'){
	                	var newID = withid;
		                if(typeof updatedPed[newID].father === 'undefined' ){
			                createPedigree(current_ped.px-hLength-rSize, current_ped.py, sex, newID , null , 'none', current_ped.id);
		                }else if(typeof updatedPed[newID].mother === 'undefined'){
			                createPedigree(current_ped.px+hLength+rSize, current_ped.py, sex, newID , 'none', null, current_ped.id);
		                }else{
			                createPedigree(current_ped.px+hLength+rSize, current_ped.py, sex, newID , 'none', 'none', current_ped.id);
		                }
	                }else{
		                var newID = maxID++ ;
		                current_ped['children'].push(newID);
		                if(current_ped.sex =='male'){
			                createPedigree(current_ped.px+hLength+rSize, current_ped.py, sex, newID , 'none', null, current_ped.id);
			                updatedPed[newID]= {sex:sex, id:newID, carrierStatus:'unknown', children:[], father:current_pid };
		                }else if(current_ped.sex =='female'){
			                createPedigree(current_ped.px-hLength-rSize, current_ped.py, sex, newID , null , 'none', current_ped.id);
			                updatedPed[newID]= {sex:sex, id:newID, carrierStatus:'unknown', children:[], mother:current_pid };
		                }
	                }


                }

                function createParents(id) {
                    var idArray = id.split('-');
                    current_pid = idArray[0];
                    current_ped = updatedPed[current_pid];
	                createPedigree(current_ped.px, current_ped.py-vLength-rSize, 'none', current_pid);

                }
                var moveChildren = function (p_id) {

                }
                var moveObjects = function (obj_id, to_where) {
                    console.log('move obj', obj_id, to_where);
	                var cType;
	                var moveX = (to_where=='right') ? (vLength+rSize) : -(vLength+rSize);
	                var cPed = updatedPed[obj_id];
	                var temp = paper.getById(obj_id+'-S-mainShadow');
	                if(temp ==null){
		                temp = paper.getById(obj_id+'-FS-mainShadow');

		                if(temp ==null){
			                cType = 'MS';
			                //moveNode(cPed.children.id);
			                //movePedigree(cPed.children.id);
			                paper.getById('c-'+cPed.children[0]).translate(moveX, 0);
			                paperLocations['c-'+cPed.children[0]].px += moveX;
			                var firstChild = updatedPed[cPed.children[0]];


			                moveNode(obj_id, cType, moveX, 0);
			                moveNode(firstChild.father, 'FS', moveX, 0);
							for(var i=0; i<cPed.children.length;i++){
								moveNode(cPed.children[i], '', moveX, 0);
								//moveObjects(cPed.children[i],to_where);
							}


		                }else{
			                cType = 'FS';
			                paper.getById('c-'+cPed.children[0]).translate(moveX, 0);
			                paperLocations['c-'+cPed.children[0]].px += moveX;
			                var firstChild = updatedPed[cPed.children[0]];


			                moveNode(obj_id, cType, moveX, 0);
			                moveNode(firstChild.mother, 'MS', moveX, 0);
			                for(var i=0; i<cPed.children.length;i++){
				                moveNode(cPed.children[i], '', moveX, 0);
				               // moveObjects(cPed.children[i],to_where);
			                }
		                }
	                }else{
		                cType = 'S';
	                }
					return false;
                }
window.moveObjects = moveObjects;


                var moveNode = function(id, type, mx, my) {

	                paper.getById(id).translate(mx, my);
	                var current_ped = updatedPed[id];
	                var newx = current_ped.px + mx;
	                var newy = current_ped.py + my;

	                var temp = getObjectByPosition(newx, newy);
	                if(temp.length > 0){
	                	if(mx > 0){
			                moveObjects(temp[0].id, 'right');
		                }else{
			                moveObjects(temp[0].id, 'left');
		                }

	                }
	                if(type==''){
		                temp = paper.getById(id+'-S-mainShadow');
		                if(temp ==null){
			                temp = paper.getById(id+'-FS-mainShadow');
			                if(temp ==null){
				                type='MS';
			                }else{
				                type = 'FS';
			                }
		                }else{
		                	type = 'S';
		                }

	                 }

	                var toptop = paper.getById(id+'-'+type+'--shadow-topTop');
	                if( typeof toptop !== 'undefined' && toptop != null ){
                         toptop.translate(mx, my);
	                }

                     paper.getById(id+'-text').translate(mx, my);
                     paper.getById(id+'-'+type+'-mainShadow').translate(mx, my);
                     paper.getById(id+'-'+type+'-shadow-topLine').translate(mx, my);
                     paper.getById(id+'-'+type+'-shadow-leftLine').translate(mx, my);
                     paper.getById(id+'-'+type+'-shadow-topSelect').translate(mx, my);
                     paper.getById(id+'-'+type+'-shadow-leftSelect').translate(mx, my);
                     paper.getById(id+'-'+type+'-shadow-bottomLine').translate(mx, my);
                     paper.getById(id+'-'+type+'-shadow-bottomSelect').translate(mx, my);



	                var pathString;
	                if(type=='S'){
		                 if(typeof paperLocations['c-'+id] !== 'undefined'){
			                 pathString = getPathString(paperLocations['c-'+id].px, paperLocations['c-'+id].py+sSize, newx, current_ped.py+my-rSize, true);
		                 }else{
		                 	 var father = updatedPed[current_ped.father];
			                 var fchild = updatedPed[father.children[0]];
			                 pathString = getPathString(paperLocations['c-'+fchild.id].px, paperLocations['c-'+fchild.id].py+sSize, newx, current_ped.py+my-rSize, true);
		                 }

	                     paper.getById(id+'-cPath').attr('path', pathString);
                    }else if(type=='FS'){
                         var child = updatedPed[current_ped.children[0]];
		                pathString = getPathString(paperLocations['c-'+child.id].px-sSize, paperLocations['c-'+child.id].py, newx+rSize, current_ped.py+my, false);
		                paper.getById(child.id +'-fPath').attr('path', pathString);
		                temp = paper.getById(id+'-cPath');
		                if(temp != null){
			                pathString = getPathString(paperLocations['c-'+id].px, paperLocations['c-'+id].py+sSize, newx, current_ped.py+my-rSize, true);
			                paper.getById(id+'-cPath').attr('path', pathString);
		                }
                     }else if(type=='MS'){

                         var child = updatedPed[current_ped.children[0]];
		                pathString = getPathString(paperLocations['c-'+child.id].px+sSize, paperLocations['c-'+child.id].py, newx-rSize, current_ped.py+my, false);
                        paper.getById(child.id +'-mPath').attr('path', pathString);
		                temp = paper.getById(id+'-cPath');
		                if(temp != null){
			                pathString = getPathString(paperLocations['c-'+id].px, paperLocations['c-'+id].py+sSize, newx, current_ped.py+my-rSize, true);
			                paper.getById(id+'-cPath').attr('path', pathString);
		                }
                     }

	                current_ped.px = newx;
	                current_ped.py = newy;

             }
window.moveNode = moveNode;

                function showMenu(cx, cy, paperid) {
                    myMenu.transform(0, 0);// need reset
                    myMenu.attr({'class':'display'});
                    myMenu.translate(cx, cy);
                    myMenu.toFront();

                    tempVar = paperid.split('-');
                    current_pid = tempVar[0];
                    // console.log('showMenu', current_pid, paperid);
                    if(paperid.indexOf('-S-') >0 ){
                        cNodeType = 'child';
                        if(paperid.indexOf('-topSelect') >0 ){
                            newNodeType = 'sibling';
                        }else if(paperid.indexOf('-bottomSelect') >0 ){
                            newNodeType = 'child';
                        }
//                        createNewNode(current_pid);
                    }else{
                        cNodeType = 'parent';
                        if(paperid.indexOf('-topSelect') >0 ){
                            newNodeType = 'sibling';
                        }else if(paperid.indexOf('-bottomSelect') >0 ){
                            newNodeType = 'child';
                        }
                    }

                }

                function getMenuSet() {
                    var firstMenu = paper.rect(0, 0, 50, 50).attr({fill:'#ffffff', stroke:'#000000', 'stroke-width': '2'});
                    var firstNode = paper.rect(10, 10, 30, 30)
                        .mousedown(function (e) {
                            e.stopPropagation();
                            createNewNode('male');
                        })
                        .hover(function () {
                            this.attr({fill:'#00ff00'})
                        }, function () {
                            this.attr({fill:'none'});
                        }).attr({fill:'#ffffff', stroke:'#000000', 'stroke-width': '2'});
                    var secondMenu = paper.rect(52, 0, 50, 50).attr({fill:'#ffffff', stroke:'#000000', 'stroke-width': '2'});
                    var secondNode = paper.circle(76, 26, 15)
                         .mousedown(function (e) {
                            e.stopPropagation();
                            createNewNode('female');
                        })
                        .hover(function () {
                            this.attr({fill:'#00ff00'})
                        }, function () {
                            this.attr({fill:'none'});
                        }).attr({fill:'#ffffff', stroke:'#000000', 'stroke-width': '2'});
                    var menuSet = paper.set();
                    menuSet.push(
                            firstMenu,
                            secondMenu,
                            firstNode,
                            secondNode
                    )
                    return menuSet;
                }

                function getPathString(startx, starty, endx, endy, middle){
                    var line = '';
                    if(middle == true){
                        var midy = (endy-starty) / 2 + starty;
                        line = "M"+startx+","+starty+'L'+startx+','+midy+'M'+startx+','+midy+'L'+endx+','+midy+'M'+endx+','+midy+"L"+endx+","+endy;
                        //startm+'M'+sx+','+midy+'L'+(sx+moveX)+','+midy+'M'+(sx+moveX)+','+midy+'L'+(sx+moveX)+','+ey ) ;

                    }else{
                        line = "M"+startx+","+starty+"L"+endx+","+endy;
                    }

                    return line;
                }

                function createShadow(px, py, id, hasparent) {
                    var sSet = paper.set().data('id', id);

                    var mainShadow = paper.rect(px-2.5*rSize, py-2.5*rSize, 5*rSize, 5*rSize).attr({fill: '#008000', stroke:'none', "fill-opacity": "0"})
                    .hover(function () {
                        this.attr({fill: '#008000', "fill-opacity": "0.5"});
                        this.toBack();

                    }, function () {
                        this.attr({"fill-opacity": "0"});

                    })
                    .mouseover(function (e) {
                        showInfo(id);
                    });

                    mainShadow.id = id+'-mainShadow';
                    tid =  id+'-shadow-topLine';
                    var topLine = paper.path('M'+px+','+ (py-1.5*rSize)+'L'+ px+','+ (py-rSize)+'M'+ px+','+ (py-1.5*rSize)+'L'+ (px+1.5*rSize)+','+(py-1.5*rSize)+'M'+ (px+1.5*rSize)+','+(py-1.5*rSize)+'L'+ (px+1.5*rSize)+','+(py-rSize) )
                        .attr({fill: '#008000', stroke: '#008000','stroke-width': '2',  class:tid + ' no-display topline', id:tid});
                    topLine.id = tid;
                    tid = id+'-shadow-topSelect';
                    //var topSelect = paper.rect((px+1.5*rSize-sSize), (py-rSize), 2*sSize, 2*sSize ).transform("r45")
                    var topSelect = paper.circle(px+1.5*rSize, py-rSize+sSize, sSize)
                        .attr({fill: '#0000ff',stroke:'none', class: tid +' no-display topselect', 'data-tid':tid, id:tid})
                        .hover(function () {
                            this.attr({fill:'red'})
                        }, function () {
                            this.attr({fill:'blue'});
                        })
                        .click(function () {
                            mousedown = false;
                            showMenu(this.getBBox().x2, this.getBBox().y2, this.id);

                        });
                    topSelect.id = tid;


                    tid = id+'-shadow-leftLine';
                    var leftLine = paper.path('M'+(px-rSize)+','+py+'L'+(px-1.5*rSize)+','+py)
                        .attr({fill: '#008000', stroke: '#008000', 'stroke-width': '2', class:tid + ' no-display leftline'});
                    leftLine.id = tid;
                    tid = id+'-shadow-leftSelect';
                    //var leftSelect = paper.rect((px-1.5*rSize-sSize), (py-sSize), 2*sSize, 2*sSize).transform("r45")
                    var leftSelect = paper.circle(px-1.5*rSize-sSize, py, sSize)
                        .attr({fill: '#0000ff',stroke:'none', class:tid +  ' no-display leftselect'})
                        .click(function () {
                            // console.log(this, this.getBBox());

                            showMenu(this.getBBox().x2, this.getBBox().y2, this.id);
                        })
                        .hover(function () {
                            this.attr({fill:'red'})
                        }, function () {
                            this.attr({fill:'blue'});
                        });
                    leftSelect.id = tid;
                    mainShadow.toBack();
                    topSelect.toFront();
                    var bottomLine = paper.path('M'+px+','+ (py+1.5*rSize)+'L'+ px+','+ (py+rSize))
                    .attr({fill: '#008000', stroke: '#008000','stroke-width': '2',  class:tid + ' no-display  bottomline'});
                    bottomLine.id = id + '-shadow-bottomLine';
                    var bottomSelect = paper.circle(px, (py+1.5*rSize+sSize), sSize)
                        .attr({fill: '#0000ff',stroke:'none', class: tid +' no-display  bottomselect'})
                        .click(function () {
                            // console.log(this, this.getBBox());

                            showMenu(this.getBBox().x2, this.getBBox().y2, this.id);
                        })
                        .hover(function () {
                            this.attr({fill:'red'})
                        }, function () {
                            this.attr({fill:'blue'});
                        });
                    bottomSelect.id = id + '-shadow-bottomSelect';
                    sSet.push(
                            mainShadow,
                            topLine,
                            topSelect,
                            leftLine,
                            leftSelect,
                            bottomLine,
                            bottomSelect
                    )
                    if(! hasparent){
                        tid = id+'-shadow-topTop';
                        var topTop = paper.circle(px, (py-2*rSize), sSize)
                        .click(function () {
                            var check = paper.getElementByPoint(px-hLength-rSize, py-vLength-rSize);
                            createParents(id);
                        })
                        .hover(function () {
                            this.attr({fill:'red'})
                        }, function () {
                            this.attr({fill:'blue'});
                        })
                        .attr({fill: '#0000dd', stroke: 'none', class:tid + ' no-display toptop'});
                        topTop.id = tid;
                        tid = id+'-shadow-topVline';
                        var vline = paper.path('M'+(px)+','+(py-2*rSize)+'L'+(px)+','+(py-1.5*rSize))
                            .attr({stroke: '2', class:tid + ' no-display topvline'});
                        vline.id = tid;
                        sSet.push(topTop, vline);
                    }

                    return sSet;

                }

                function createPedigree(px, py, gen, id, f_id, m_id, base_id) {
                    var cped;
                    var fid = f_id;
                    var mid = m_id;
                    var fsid = fid + '-FS';
                    var msid = mid + '-MS';
	                var temp1, temp2;

                    if(typeof fid === 'undefined' || fid==null ){
                        fid = maxID++;
                        fsid = fid + '-FS';
                        updatedPed[fid] = {id:fid, sex:'male', child:id, carrierStatus:'notknown', children:[id]};
                        updatedPed[id]['father']=fid;
                    }
                    if(typeof mid === 'undefined' || mid==null){
                        mid = maxID++;
                        msid = mid + '-MS';
                        updatedPed[mid] = {id:mid, sex:'female', child:id, carrierStatus:'notknown', children:[id]};
                        updatedPed[id]['mother']=mid;
                    }
                    px = (typeof px === 'undefined') ? 500 : px;
                    py = (typeof py === 'undefined') ? 500 : py;

	                if(f_id!='none'){
	                    var leftX = px-hLength-rSize;
	                    temp1 = getObjectByPosition(leftX, py);
		                temp2 = getObjectByPosition(px, py);
	                    if( temp1.length <= 0 && temp2.length <= 0) {

	                    }else{
		                    var moveX = hLength + rSize;
		                    if(temp2.length>0){
			                    moveX +=  hLength + rSize;
		                    }
		                    px = px + moveX;
		                    leftX = px-hLength-rSize;
		                    if(m_id=='none'){
			                    moveNode(base_id, '', moveX, 0);
		                    }else{
			                    moveNode(id, '', moveX, 0);
		                    }

	                    }
	                }

	                if(m_id!='none') {
		                var rightX = px + hLength + rSize;

		                temp1 = getObjectByPosition(rightX, py);
		                temp2 = getObjectByPosition(px, py);
		                if (  temp1.length <= 0 && temp2.length <= 0) {

		                } else {
		                	var moveX = hLength + rSize;
			                if(temp2.length>0){
				                moveX +=  hLength + rSize;
			                }
			                px = px - moveX;
			                rightX = px + hLength + rSize;
			                if (f_id == 'none') {
				                moveNode(base_id, '', -(moveX), 0);
			                } else {
				                moveNode(id, '', -(moveX), 0);
			                }
		                }
	                }

                    // if(m_id=="none" ||typeof temp === 'undefined' || temp === null){
                    //
                    // }else{
                    //     console.log(temp);
                    // }

                    var pset = paper.set();
                    var centerP = paper.circle(px,py,sSize).attr({fill: 'red'})
                        .click(function () {mousedown = false;alert(this.id);})
                        .hover(function () {this.attr({"fill": "#E3E3E3"})}, function () {this.attr({"fill": "red"})});
                    centerP.id = 'c-'+id ;
                    paperLocations[centerP.id] ={};
                    paperLocations[centerP.id].px = px;
                    paperLocations[centerP.id].py = py;



                    if(f_id != "none"){
                        var leftS = createShadow(leftX, py, fsid);
                        leftS.id = fsid;
                        var leftP = paper.rect(leftX-rSize, py-rSize, 2*rSize, 2*rSize)
                        .click(function () {
                            nodeClick(this.id);
                        }).attr({fill:'white'});
                        leftP.id = fid;

                        var leftText = paper.text(leftX, py, ' ').attr({'font-size':16 });
                        leftText.id = fid+'-text';
                        if(typeof fid !== 'undefined' ){
                            cped = updatedPed[fid];
                            if(typeof cped !== 'undefined') {
                                if (cped.carrierStatus == 'affected') {
                                    leftP.attr({fill: 'yellow'});
                                    leftText.attr('text', ' ');
                                } else if (cped.carrierStatus == 'uncertain') {
                                    leftP.attr({fill: 'white'});
                                    leftText.attr('text', '?');
                                    leftText.toFront();
                                } else if (cped.carrierStatus == 'carrier') {
                                    leftP.attr({fill: 'white'});
                                    leftText.attr('text', 'O');
                                    leftText.toFront();
                                } else {
                                    leftP.attr({fill: 'white'});
                                    leftText.attr('text', ' ');
                                }
                            }
                        }
                        updatedPed[fid]['px']=leftX;
                        updatedPed[fid]['py']=py;
                    }

                    if(m_id!="none"){
                        var rightS = createShadow(rightX, py, msid);
                        rightS.id = msid;
                        var rightP = paper.circle(rightX,py, rSize).attr({"fill": "none"})
                        .click(function () {
//                            console.log('inner id', id, tid,  this, this.id, rightP.id);
                            nodeClick(this.id);
                        }).attr({'id':mid, 'fill':'white'});
                        rightP.id = mid;
                        var rightText = paper.text(rightX, py, ' ').attr({'font-size':16 });
                        rightText.id = mid+'-text';
                        if(typeof mid !== 'undefined' ){
                            cped = updatedPed[mid];
                            if(typeof cped !== 'undefined'){
                                if(cped.carrierStatus=='affected'){
                                    rightP.attr({fill: 'yellow'});
                                    rightText.attr('text', ' ');
                                }else if(cped.carrierStatus == 'uncertain'){
                                    rightP.attr({fill: 'white'});
                                    rightText.attr('text', '?');
                                    rightText.toFront();
                                }else if(cped.carrierStatus == 'carrier'){
                                    rightP.attr({fill: 'white'});
                                    rightText.attr('text', 'O');
                                    rightText.toFront();
                                }else{
                                    rightP.attr({fill: 'white'});
                                    rightText.attr('text', ' ');
                                }
                            }
                        }
                        updatedPed[mid]['px']=rightX;
                        updatedPed[mid]['py']=py;
                    }



                    var cPath = paper.path("M"+px+","+(py+sSize)+"L"+px+","+(py+vLength));
                    cPath.id = id+ '-cPath';
                    var fPath = paper.path("M"+(px-hLength)+","+py+"L"+(px-sSize)+","+py);
                    fPath.id = id+'-fPath';
                    var mPath = paper.path("M"+(px+sSize)+","+py+"L"+(px+hLength)+","+py);
                    mPath.id = id+'-mPath';
                    pset.push(
                            leftS,
                            rightS,
                            rightP,
                            centerP,
                            leftP,
                            fPath,
                            mPath,
                            cPath
                    );
                    if(gen=='none' || typeof gen ==='undefined'){

                        console.log('gender none == already draw ', id);
                        var temp = paper.getById(id+'-FS-shadow-topTop');
                        if(typeof temp !== 'undefined' && temp !== null ){
                            temp.remove();
                        }
                        var temp = paper.getById(id+'-FS-shadow-topVline');
                        if(typeof temp !== 'undefined' && temp !== null ){
                            temp.remove();
                        }
                        temp = paper.getById(id+'-MS-shadow-topTop');
                        if(typeof temp !== 'undefined' && temp !== null){
                            temp.remove();
                        }
                        var temp = paper.getById(id+'-MS-shadow-topVline');
                        if(typeof temp !== 'undefined' && temp !== null ){
                            temp.remove();
                        }

                    }else{
                        cped = updatedPed[id];
                        var bottomY = py+vLength+rSize;
                        var sid = id+'-S';
                        var hasParent = (typeof fid === 'undefined' && typeof mid === 'undefined') ? false : true;
                        var centerS = createShadow(px, bottomY, sid, hasParent);
                        centerS.id = sid;
                        if(gen=='male'){
                            var centerC = paper.rect(px-rSize, bottomY-rSize, 2*rSize, 2*rSize).attr({'id':sid, 'fill':'white'});

                        }else{
                            var centerC = paper.circle(px, bottomY, rSize).attr({'id':sid, 'fill':'white'});
                        }
                        centerC.click(function () {
                            nodeClick(this.id);
                        });
                        centerC.id = id ;
//                        centerC.toFront();
                        var centerText = paper.text(px, bottomY, ' ').attr({'font-size':16 });
                        centerText.id = id+'-text';
                        if(cped.carrierStatus=='affected'){
                                centerC.attr({fill: 'yellow'});
                            centerText.attr('text', ' ');
                        }else if(cped.carrierStatus == 'uncertain'){
                                centerC.attr({fill: 'white'});
                                centerText.attr('text', '?');
                                centerText.toFront();
                        }else if(cped.carrierStatus == 'carrier'){
                                centerC.attr({fill: 'white'});
                                centerText.attr('text', 'O');
                            centerText.toFront();
                        }else{
                                centerC.attr({fill: 'white'});
                            centerText.attr('text', ' ');
                        }

                        updatedPed[id]['px']=px;
                        updatedPed[id]['py']=bottomY;

                        pset.push( centerS, centerC, centerText);
                    }

                    return pset;
                }


            var viewBoxWidth  = paper.width;
            var viewBoxHeight = paper.height;
            var canvasID      = "#paper";
            var startX,startY;
            var mousedown     = false;
            var dX,dY;
//            var oX            = 0, oY = 0; //oWidth = viewBoxWidth, oHeight = viewBoxHeight;
//            var viewBox       = paper.setViewBox(0, 0, viewBoxWidth, viewBoxHeight);
//            viewBox.X         = 0;
//            viewBox.Y         = 0;
//             var vB            = paper.rect(viewStartX,viewStartY,viewBoxWidth,viewBoxHeight);
//             vB.attr({stroke: "#009", "stroke-width": 5});
            /** This is high-level function.
             * It must react to delta being more/less than zero.
             */
            function handle(delta) {
                vBHo = viewBoxHeight;
                vBWo = viewBoxWidth;
                if(delta < 0){
                    viewBoxWidth  *= 0.95;
                    viewBoxHeight *= 0.95;
                }else{
                    viewBoxWidth  *= 1.05;
                    viewBoxHeight *= 1.05;
                }
                /*
                 vB.attr({
                 x: viewBox.X,
                 y: viewBox.Y,
                 width: viewBoxWidth,
                 height: viewBoxHeight
                 });
                 */
                // console.log(viewStartX, viewBoxWidth, vBWo);
                viewStartX -= (viewBoxWidth - vBWo) / 2;
                viewStartY -= (viewBoxHeight - vBHo) / 2;
                paper.setViewBox(viewStartX,viewStartY,viewBoxWidth,viewBoxHeight);
            }

            function wheel(event){
                var delta = 0;
                if(!event){ /* For IE. */
                    event = window.event;
                }
                if(event.wheelDelta){ /* IE/Opera. */
                    delta = event.wheelDelta/120;
                } else if (event.detail) { /** Mozilla case. */
                    /** In Mozilla, sign of delta is different than in IE.
                     * Also, delta is multiple of 3.
                     */
                    delta = -event.detail/3;
                }
                /** If delta is nonzero, handle it.
                 * Basically, delta is now positive if wheel was scrolled up,
                 * and negative, if wheel was scrolled down.
                 */
                if(delta){
                    handle(delta);
                }
                /** Prevent default actions caused by mouse wheel.
                 * That might be ugly, but we handle scrolls somehow
                 * anyway, so don't bother here..
                 */
                if(event.preventDefault){
                    event.preventDefault();
                }
                event.returnValue = false;
            }
            /** Initialization code.
             * If you use your own event management code, change it as required.
             */
            if (window.addEventListener)
                /** DOMMouseScroll is for mozilla. */
                //window.addEventListener('DOMMouseScroll', wheel, false);
                document.getElementById('paper').addEventListener('DOMMouseScroll', wheel, false);
            /** IE/Opera. */
            //window.onmousewheel = document.onmousewheel = wheel;
            document.getElementById('paper').onmousewheel = wheel;
            //Pan
            $(canvasID).mousedown(function(e){
                currentX = e.pageX; currentY = e.pageY;
                // console.log('mouse down', mousedown, this, currentX, currentY);

                $('.info').css('display', 'none');
                myMenu.attr({'class':'no-display'});
                if (paper.getElementByPoint( e.pageX, e.pageY ) !== null){

                    return;
                }

                mousedown = true;
                startX = e.pageX;
                startY = e.pageY;
            });
            $(canvasID).mousemove(function(e){
                if (mousedown === false) {currentX = e.pageX; currentY = e.pageY; return;}
                dX  = startX - e.pageX;
                dY  = startY - e.pageY;
                x   = viewBoxWidth / paper.width;
                y   = viewBoxHeight / paper.height;
                dX *= x;
                dY *= y;
                //alert(viewBoxWidth +" "+ paper.width );
                // console.log( viewStartX , dX );
                paper.setViewBox(viewStartX + dX, viewStartY + dY, viewBoxWidth, viewBoxHeight);
            });
            $(canvasID).mouseup(function(e){
                if ( mousedown === false ) return;
                viewBox.X += dX;
                viewBox.Y += dY;
                mousedown = false;
            });

            $('.zoom-out').on('click', function () {
                handle(10);
            });
             $('.zoom-in').on('click', function () {
                 handle(-10);
             });
             var myMenu = getMenuSet();
             myMenu.attr({'class':'no-display'});



             var getObjectByPosition = function(posx, posy){
                 // return jQuery.map(updatedPed, function(obj){
                 //     if(typeof obj !== 'undefined'){
                 //         if(obj.px===posx && obj.py ===posy )
                 //             return obj;
                 //     }
                 //
                 // });
	             for (obj in updatedPed) {
	             	if(obj !== 'undefined'){
		                if (updatedPed[obj].px == posx && updatedPed[obj].py == posy) {
			                return obj;
		                }
	                }

	             }
	             return '';
             }
window.getObjectByPosition = getObjectByPosition;

             var total_ped = 0;

             // with updatedPed

	         function getChildren(id) {
		         var children = [];
		         jQuery.map(JsonPed, function(obj){if(obj.father===id || obj.mother=== id) children.push(obj); });
		         return children;
	         }
	         function getSiblings(fid, mid) {
		             var siblings = [];
		             jQuery.map(JsonPed, function(obj){if(obj.father===fid && obj.mother===mid) siblings.push(obj); });
		             return siblings;
		         }
	         function findBottomChild(obj) {
		         jQuery.map(JsonPed, function(obj){if(typeof obj.father !=='undefined' && typeof obj.mother !== 'undefined') children.push(obj); });

	         }

	         var drawed={};
             function setUpPed(obj, posx, posy, childDraw) {
	             drawed[obj.id] = true;
	             console.log('drawed', drawed, obj.id);
                 total_ped++;
                 var gen = (childDraw)? obj.sex : 'none';
                 obj[obj.id+'-ped'] = createPedigree(posx, posy, gen, obj.id, obj.father, obj.mother);
                 // console.log(obj, obj.id, obj.father, obj.mother);

                 if(typeof obj.father !== 'undefined'){
                     var father = updatedPed[obj.father];
                     if(typeof father !== 'undefined'){
                         if(typeof father.father !== 'undefined' || typeof father.mother !== 'undefined'){
	                         if( ! drawed[father.id] ) {
		                         setUpPed(father, posx - rSize - hLength, posy - rSize - vLength, false);
	                         }
                         }
                     }
                 }
                 if(typeof obj.mother !== 'undefined'){
                     var mother = updatedPed[obj.mother];
                     if(typeof mother !== 'undefined') {
                         if (typeof mother.father !== 'undefined' || typeof mother.mother !== 'undefined') {
	                         if( ! drawed[mother.id] ) {
		                         setUpPed(mother, posx + rSize + hLength, posy - rSize - vLength, false);
	                         }
                         }
                     }
                 }

	             if(typeof obj.father !== 'undefined' && typeof obj.mother !== 'undefined') {
		             var siblings = getSiblings(obj.father, obj.mother);
		             current_pid = obj.id;
		             for(var i=1;i<siblings.length;i++){
		             	if( ! drawed[siblings[i].id] ){
			                addSiblings( siblings[i].id );
			                drawed[siblings[i].id] = true;
			                console.log('drawed siblings', drawed, obj.id);
		                }

		             }
	             }

	             var children = getChildren(obj.id);
	             console.log('children', children);
	             if(children.length >0 ){
	             	current_pid = obj.id;
		             addChild(children[0].sex, children[0].id);
		             var child_father = updatedPed[children[0].id].father;
		             var child_mother = updatedPed[children[0].id].mother;

		             current_pid =  children[0].id;
	             	for(var i=1; i<children.length;i++){
						if(typeof updatedPed[children[i].id].father === 'undefined'){
							updatedPed[children[i].id].father = child_father;
						}else if(typeof updatedPed[children[i].id].mother === 'undefined'){
							updatedPed[children[i].id].mother = child_mother;
						}
						updatedPed[child_father].children.push(children[i].id);
		                updatedPed[child_mother].children.push(children[i].id);
		                addSiblings(children[i].id, true); // need to fix this Young
	                }
	             	if( ! drawed[children[0].id] ){
		                //setUpPed(children[0]);
		                //console.log(children[0].id, 'draw');
		             }
	             }


             }

             setUpPed(JsonPed[JsonPed.length-1], 500, 600, true);
             if(total_ped>5){
                 handle(10);
             }
             $('#tabs').tabs();
             $('.info').mousedown(function (e) {
                 e.stopPropagation();
                 // console.log('info click', this);

             })
             $('input[name="carrier"]').on('click', function(){
                 if(this.value == 'affected'){
                     paper.getById(current_pid).attr({fill: 'yellow'});
                     paper.getById(current_pid+'-text').attr('text', ' ');
                 }else if(this.value == 'uncertain'){
                     paper.getById(current_pid).attr({fill: 'white'});
                     paper.getById(current_pid+'-text').attr('text', '?');
                 }else if(this.value == 'carrier'){
                     paper.getById(current_pid).attr({fill: 'white'});
                     paper.getById(current_pid+'-text').attr('text', 'O');
                 }else{
                     paper.getById(current_pid).attr({fill: 'white'});
                     paper.getById(current_pid+'-text').attr('text', ' ');
                 }
                 updatedPed[current_pid]['carrierStatus'] = this.value;
             });
        };

