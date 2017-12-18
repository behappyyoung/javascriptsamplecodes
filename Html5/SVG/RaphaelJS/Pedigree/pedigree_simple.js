
            var JsonPed = 
  {
    "sex":"female",
    "id":"1234567891",
    "name":"John Doe Proband",
    "carrierStatus": "",
    "mother":  {
      "sex":"female",
      "id":"mother1",
      "name":"Jane Fox",
      "carrierStatus": "carrier",
      "father": {
        "sex":"male",
        "id":"mother father",
        "name":"father father Fox",
        "carrierStatus": "uncertain",
        },
    },
    "father":  {
      "sex":"male",
      "id":"father1",
      "name":"john father Fox",
      "carrierStatus": "uncertain",
      "father": {
        "sex":"male",
        "id":"father11",
        "name":"father father Fox",
        "carrierStatus": "uncertain",
        },
    },
    "sons":  [{
      "sex":"male",
      "id":"son1",
      "name":"jonn son Fox",
      "carrierStatus": ""
    },{
      "sex":"male",
      "id":"son2",
      "name":"jonn son Fox",
      "carrierStatus": ""
    }],
    "daughters":[{
      "sex":"female",
      "id":"daughter1",
      "name":"jonn son Fox",
      "carrierStatus": ""
    }],
    "siblings":[
      {
        "sex":"male",
        "id":"sibling1",
        "name":"Jane Fox",
        "carrierStatus": ""
      },
      {
        "sex":"female",
        "id":"sibling2",
        "name":"Jane Fox",
        "carrierStatus": ""
      }
    ]
  };
 
            // var JsonPed = [{"sex":"male","id":"1234567891","name":"John Doe"},{"mother":"1234567892","sex":"female","id":"1234567898","name":"Jane Fox"},{"mother":"1234567892","sex":"female","id":"1234567896","name":"Jane Smith"},{"sex":"female","id":"1234567894","name":"Jane Smith"},{"mother":"1234567894","sex":"female","father":"1234567891","id":"1234567892","name":"Jane Doe"}];
            var updatedPed = [];
            var maxID  = 0;
            var drawed = {};
            var total_ped = 0;
            var paper, viewBox;
        

        window.onload = function() {
            $('#tabs').tabs();

            /** Event handler for mouse wheel event.
                 */
                paper         = new Raphael(document.getElementById('paper'), 1000, 1000);
                viewBox = paper.setViewBox(0,0,paper.width,paper.height);
                var rSize = 20;                     // big size radius
                var sSize = 5;                      // small size  diameter
                var vLength = 150;                   // vertical line length
                var hLength = 100;                   // horizental line length
                var currentX, currentY;
                var viewStartX=0;
                var viewStartY=0;
                var tid;
                var current_pid, current_ped;
                var next_id = 100;
                var tempVar, tempPed, temp_father, temp_mother;
                var current_element;
                var paperLocations={};
                var newNodeType, cNodeType;

                function nodeClick(obj){
                    console.log(obj);
                    // return false;
                    mousedown = false;
                    current_ped = obj;
                    $('.info').css({display: 'block', left:obj.px+200+'px', top:obj.py+100+'px'});
                    // console.log('current_ped', current_ped, typeof current_ped);
                    // var name = 'Name';
                    // var sex = 'Gender';
                    // if(typeof current_ped !== 'undefined'){
                    //     name = current_ped.name;
                    //     sex = current_ped.sex;
                    // }
                    // $('.info .id').html(current_pid + ' / ' +  name + ' / ' + sex);
                    $('#personal #info_id').html(obj.id);
                    $('#personal #name').val(obj.name);

                    $('input[name="carrier"]').prop('checked', false);

                    $('input[name="carrier"][value="'+ obj['carrierStatus']+'"]').prop('checked', true);
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
            var myMenu = getMenuSet();
            myMenu.attr({'class':'no-display'});

                function createNewNode(sex){
                    // current_ped = updatedPed[current_pid];
                    console.log(current_ped);
                    return false;
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

            function moveObjects(cPed, to_where) {
                    console.log('move obj', cPed, to_where);
                    var cType;
                    var moveX = (to_where=='right') ? (vLength+rSize) : -(vLength+rSize);
                    // var cPed = updatedPed[obj_id];
                    var temp = paper.getById(cPed.id+'-S-mainShadow');
                    if(temp ==null){
                        temp = paper.getById(cPed.id+'-FS-mainShadow');

                        if(temp ==null){
                            cType = 'MS';

                            // paper.getById('c-'+cPed.children[0]).translate(moveX, 0);
                            // paperLocations['c-'+cPed.children[0]].px += moveX;
                            // var firstChild = updatedPed[cPed.children[0]];


                            // moveNode(obj_id, cType, moveX, 0);
                            // moveNode(firstChild.father, 'FS', moveX, 0);
                            // for(var i=0; i<cPed.children.length;i++){
                                // moveNode(cPed.children[i], '', moveX, 0);
                                //moveObjects(cPed.children[i],to_where);
                            // }


                        }else{
                            // cType = 'FS';
                            // paper.getById('c-'+cPed.children[0]).translate(moveX, 0);
                            // paperLocations['c-'+cPed.children[0]].px += moveX;
                            // var firstChild = updatedPed[cPed.children[0]];


                            // moveNode(obj_id, cType, moveX, 0);
                            // moveNode(firstChild.mother, 'MS', moveX, 0);
                            // for(var i=0; i<cPed.children.length;i++){
                            //     moveNode(cPed.children[i], '', moveX, 0);
                            //    // moveObjects(cPed.children[i],to_where);
                            // }
                        }
                    }else{
                        cType = 'S';
                    }
                    return false;
                }           
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

                    }else{
                        cNodeType = 'parent';
                        if(paperid.indexOf('-topSelect') >0 ){
                            newNodeType = 'sibling';
                        }else if(paperid.indexOf('-bottomSelect') >0 ){
                            newNodeType = 'child';
                        }
                    }

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
                        console.log('shadow', id);
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
                             console.log(this, this.getBBox());
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
                    // if(! hasparent){
                    //     tid = id+'-shadow-topTop';
                    //     var topTop = paper.circle(px, (py-2*rSize), sSize)
                    //     .click(function () {
                    //         var check = paper.getElementByPoint(px-hLength-rSize, py-vLength-rSize);
                    //         createParents(id);
                    //     })
                    //     .hover(function () {
                    //         this.attr({fill:'red'})
                    //     }, function () {
                    //         this.attr({fill:'blue'});
                    //     })
                    //     .attr({fill: '#0000dd', stroke: 'none', class:tid + ' no-display toptop'});
                    //     topTop.id = tid;
                    //     tid = id+'-shadow-topVline';
                    //     var vline = paper.path('M'+(px)+','+(py-2*rSize)+'L'+(px)+','+(py-1.5*rSize))
                    //         .attr({stroke: '2', class:tid + ' no-display topvline'});
                    //     vline.id = tid;
                    //     sSet.push(topTop, vline);
                    // }

                    return sSet;

                }

                function getObjectByPosition(posx, posy){
                 for (obj in updatedPed) {
                    if(obj !== 'undefined'){
                        if (updatedPed[obj].px == posx && updatedPed[obj].py == posy) {
                            return obj;
                        }
                    }

                 }
                 return '';
                }
                function getPathString(startx, starty, endx, endy, middle){
                    var line = '';
                    if(middle == true){
                        // var midy = (endy-starty) / 2 + starty;
                        line = "M"+startx+","+starty+'L'+endx+','+starty+'M'+endx+','+starty+"L"+endx+","+endy;
                        //startm+'M'+sx+','+midy+'L'+(sx+moveX)+','+midy+'M'+(sx+moveX)+','+midy+'L'+(sx+moveX)+','+ey ) ;

                    }else{
                        line = "M"+startx+","+starty+"L"+endx+","+endy;
                    }

                    return line;
                }
            function addSiblings(newSibling, current_ped, to_where='left') {

                    var pathString;

console.log('add sibling', newSibling, current_ped, 'paperLocations', paperLocations);
                    var firstSibling = current_ped.id;
                    var startPathx = current_ped.px;
                    var startPathy = current_ped.py-vLength/2-rSize-sSize;
                    var moveX = (to_where=='left') ? -(hLength+rSize) : hLength+rSize;

                    // if(current_ped.sex =='male'){
                    //         moveX =  -2*(hLength+rSize);
                    //         if(newSibling.length == 2){
                    //             moveObjects(current_ped, 'right');
                    //             // current_ped = updatedPed[current_pid];
                    //         }else{
                    //             // current_ped = updatedPed[siblings[siblings.length-2]];
                    //         }
                    // }else{
                    //         moveX =  2*(hLength+rSize);
                    //         if(newSibling.length == 2){
                    //             moveObjects(current_ped, 'left');
                    //             // current_ped = updatedPed[current_pid];
                    //         }else{
                    //             // current_ped = updatedPed[siblings[siblings.length-2]];
                    //         }
                    // }




                    var cx = current_ped.px;
                    var cy = current_ped.py;
                    // var newx = cx+moveX;
                    // var newy = cy;
                    // var temp = getObjectByPosition(newx, newy);
                    // var temp2 = getObjectByPosition(cx + hLength+rSize, newy);

                    // if(temp.length >0 ){
                    //     if(moveX > 0){
                    //         moveObjects(temp[0].id, 'right');
                    //     }else{
                    //         moveObjects(temp[0].id, 'left');
                    //     }
                    // }else if(temp2.length>0){
                    //     if(moveX > 0){
                    //         moveObjects(temp2[0].id, 'right');
                    //         moveObjects(temp2[0].id, 'right');
                    //     }else{
                    //         moveObjects(temp2[0].id, 'left');
                    //         moveObjects(temp2[0].id, 'left');
                    //     }
                    // }

                    if(newSibling.sex =='male'){
                        var newNode = paper.rect(cx+moveX-rSize, cy-rSize, 2*rSize, 2*rSize ).attr({fill:'white'});
                    }else{
                        var newNode = paper.circle(cx+moveX, cy, rSize).attr({fill:'white'});
                    }
                    newNode.id = newSibling.id;
                    newNode.click(function () {
                        nodeClick(newSibling);
                    });
                    var newNodeText = paper.text(cx+moveX, cy, ' ').attr({'font-size':16 });
                    newNodeText.id = newNode.id+'-text';
                    var newS = createShadow(cx+moveX, cy, newNode.id, true);
                    newS.id = newNode.id + '-S';

                    pathString = getPathString(startPathx, startPathy, cx+moveX, cy-rSize, true);
                    console.log('pathstring', pathString);
                    var cPath = paper.path(pathString);
                    cPath.id = newNode.id+'-cPath';
                    cPath.toBack();
                    ///////////// add children to father, mother
                    // updatedPed[newNode.id]= {sex:sex, id:newID, carrierStatus:'unknown', children:[], father:current_ped.father, mother:current_ped.mother, px:cx+moveX, py:cy };
                    newSibling.px = cx+moveX;
                    newSibling.py = cy;

                }
            function createPedigree(px, py, gen, obj, father=null, mother=null, draw_self=false) {
                var cped;
                var id = obj.id;
                // var father = obj.father;
                // var mother = obj.mother;
                var spouse = obj.spouse;
                var sons = obj.sons;
                var daughters = obj.daughters;
                var siblings = obj.siblings;

                var fid = (father)? father.id : null;
                var mid = (mother)? mother.id : null;
                var fsid = fid + '-FS';
                var msid = mid + '-MS';
                var temp1, temp2;

                if(typeof fid === 'undefined' || fid==null ){
                        fid = maxID++;
                        fsid = fid + '-FS';
     
                    }
                if(typeof mid === 'undefined' || mid==null){
                        mid = maxID++;
                        msid = mid + '-MS';
 
                    }

                if(father){
                        // father = (father)? father: {};
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
                        var leftS = createShadow(leftX, py, father.id);
                        leftS.id = fsid;
                        var leftP = paper.rect(leftX-rSize, py-rSize, 2*rSize, 2*rSize)
                        .click(function () {
                            nodeClick(father);
                        }).attr({fill:'white'});
                        leftP.id = fid;

                        var leftText = paper.text(leftX, py, ' ').attr({'font-size':16 });
                        leftText.id = fid+'-text';
       
                                if (father.carrierStatus == 'affected') {
                                    leftP.attr({fill: 'yellow'});
                                    leftText.attr('text', ' ');
                                } else if (father.carrierStatus == 'uncertain') {
                                    leftP.attr({fill: 'white'});
                                    leftText.attr('text', '?');
                                    leftText.toFront();
                                } else if (father.carrierStatus == 'carrier') {
                                    leftP.attr({fill: 'white'});
                                    leftText.attr('text', 'O');
                                    leftText.toFront();
                                } else {
                                    leftP.attr({fill: 'white'});
                                    leftText.attr('text', ' ');
                                }
     
                        // updatedPed[fid]['px']=leftX;
                        // updatedPed[fid]['py']=py;
                        father.px = leftX;
                        father.py = py;
                        father.drawed = true;
                        var parent_parent = false;

                        if(father.father || father.mother){

                            if(father.father){
                                temp_father = father.father;
                            }else{

                                temp_father = {
                                      "sex":"male",
                                      "id":"father father",
                                      "name":" ---- ",
                                      "carrierStatus": ""
                                        };
                             
                            }
                            if(father.mother){
                                temp_mother = father.mother;
                            }else{

                                temp_mother = {
                                      "sex":"female",
                                      "id":"father mother",
                                      "name":" ---- ",
                                      "carrierStatus": ""
                                        };
                             
                            }

                            createPedigree(father.px, father.py-rSize-vLength, 'male', father, temp_father, temp_mother, false);
                            parent_parent = true;
                        }

                }
                var mv_length = hLength;
                if(mother) {
                        
                        if(parent_parent){
                            mv_length = 2*hLength + rSize;
                            var rightX = px + 2*hLength + 2*rSize;
                        }else{
                            var rightX = px + hLength + rSize;    
                        }

                        

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
                        var rightS = createShadow(rightX, py, mother.id);
                        rightS.id = msid;
                        var rightP = paper.circle(rightX,py, rSize).attr({"fill": "none"})
                        .click(function () {
//                            console.log('inner id', id, tid,  this, this.id, rightP.id);
                            nodeClick(mother);
                        }).attr({'id':mid, 'fill':'white'});
                        rightP.id = mid;
                        var rightText = paper.text(rightX, py, ' ').attr({'font-size':16 });
                        rightText.id = mid+'-text';

                                if(mother.carrierStatus=='affected'){
                                    rightP.attr({fill: 'yellow'});
                                    rightText.attr('text', ' ');
                                }else if(mother.carrierStatus == 'uncertain'){
                                    rightP.attr({fill: 'white'});
                                    rightText.attr('text', '?');
                                    rightText.toFront();
                                }else if(mother.carrierStatus == 'carrier'){
                                    rightP.attr({fill: 'white'});
                                    rightText.attr('text', 'O');
                                    rightText.toFront();
                                }else{
                                    rightP.attr({fill: 'white'});
                                    rightText.attr('text', ' ');
                                }
                        mother.px = rightX;
                        mother.py = py;
                        mother.drawed = true;

                        if(mother.father || mother.mother){

                            if(father.father){
                                temp_father = father.father;
                            }else{

                                temp_father = {
                                      "sex":"male",
                                      "id":"father father",
                                      "name":" ---- ",
                                      "carrierStatus": ""
                                        };
                             
                            }
                            if(father.mother){
                                temp_mother = father.mother;
                            }else{

                                temp_mother = {
                                      "sex":"female",
                                      "id":"father mother",
                                      "name":" ---- ",
                                      "carrierStatus": ""
                                        };
                             
                            }

                            createPedigree(mother.px, mother.py-rSize-vLength, 'male', father, temp_father, temp_mother, false);
                        }
                }

                console.log('mv_length', mv_length);
                var cPath = paper.path("M"+px+","+(py+sSize)+"L"+px+","+(py+vLength));
                    cPath.id = id+ '-cPath';
                var fPath = paper.path("M"+(px-hLength)+","+py+"L"+(px-sSize)+","+py);
                    fPath.id = id+'-fPath';
                var mPath = paper.path("M"+(px+sSize)+","+py+"L"+(px+mv_length)+","+py);
                    mPath.id = id+'-mPath';

                var pset = paper.set();
                var centerP = paper.circle(px,py,sSize).attr({fill: 'red'})
                        .click(function () {mousedown = false;alert(this.id);})
                        .hover(function () {this.attr({"fill": "#E3E3E3"})}, function () {this.attr({"fill": "red"})});
                centerP.id = 'c-'+id ;
                paperLocations[centerP.id] ={};
                paperLocations[centerP.id].px = px;
                paperLocations[centerP.id].py = py;


                if(draw_self){


                        var bottomY = py+vLength+rSize;
                        var sid = id+'-S';
                        var hasParent = (typeof fid === 'undefined' && typeof mid === 'undefined') ? false : true;
                        var centerS = createShadow(px, bottomY, sid);
                        centerS.id = sid;
                        if(gen=='male'){
                            var centerC = paper.rect(px-rSize, bottomY-rSize, 2*rSize, 2*rSize).attr({'id':sid, 'fill':'white'});

                        }else{
                            var centerC = paper.circle(px, bottomY, rSize).attr({'id':sid, 'fill':'white'});
                        }
                        centerC.click(function () {
                            nodeClick(obj);
                        });
                        centerC.id = id ;
                        var centerText = paper.text(px, bottomY, ' ').attr({'font-size':16 });
                        centerText.id = id+'-text';
                        if(obj.carrierStatus=='affected'){
                                centerC.attr({fill: 'yellow'});
                            centerText.attr('text', ' ');
                        }else if(obj.carrierStatus == 'uncertain'){
                                centerC.attr({fill: 'white'});
                                centerText.attr('text', '?');
                                centerText.toFront();
                        }else if(obj.carrierStatus == 'carrier'){
                                centerC.attr({fill: 'white'});
                                centerText.attr('text', 'O');
                            centerText.toFront();
                        }else{
                                centerC.attr({fill: 'white'});
                            centerText.attr('text', ' ');
                        }

                        // updatedPed[id]['px']=px;
                        // updatedPed[id]['py']=bottomY;
                        obj.px = px;
                        obj.py = bottomY;
                        obj.drawed = true;

                }
                if(obj.siblings){
                    if(obj.sex == 'female'){
                        var to_where = 'right'; 
                    }else{
                        var to_where = 'left';
                    }
                    addSiblings(obj.siblings[0], obj, to_where);
                    for(var i=1; i<obj.siblings.length; i++){
                        addSiblings(obj.siblings[i], obj.siblings[i-1], to_where);
                    }
                    
                }
                var s_length = (sons) ? sons.length : 0;
                var d_length = (sons) ? daughters.length : 0;

                if(s_length > 0 || d_length >0 ){
                   
                    if(gen=='male'){
                            
                        if(!spouse){
                             spouse = {
                              "sex":"female",
                              "id":"spouse",
                              "name":" ---- ",
                              "carrierStatus": ""
                            };
                            obj.spouse = spouse;
                        }
                        draw_father = null;
                        draw_mother = spouse;
                        leftX = px+hLength+rSize;
                        leftY = py+vLength+rSize;
                    }else{
                        if(!spouse){
                             spouse = {
                              "sex":"female",
                              "id":"spouse",
                              "name":" ----- ",
                              "carrierStatus": ""
                            };
                            obj.spouse = spouse;
                        }
                        draw_father = spouse;
                        draw_mother = null;
                        leftX = px-hLength-rSize;
                        leftY = py+vLength+rSize;
                    }   
                    
                    
                    
                }
                var childDraw = false;
                var start_ped;
                if(s_length > 0){                        
                        createPedigree(leftX, leftY, 'male', sons[0], draw_father, draw_mother, true);
                        childDraw = true;
                        sons[0].drawed = true;
                        for(var i=1; i<s_length; i++){
                            addSiblings(sons[i], sons[i-1], 'left');
                        }
                }
                
                if(d_length > 0) {
                    if(childDraw){
                        start_ped = sons[0];
                        for(var i=0; i<d_length; i++){
                            addSiblings(daughters[i], start_ped, 'right');
                            start_ped = daughters[i];
                        }
                    }else{
                        createPedigree(leftX, leftY, 'female', daughters[0], draw_father, draw_mother);
                        childDraw = true;
                        daughters[0].drawed = true;
                        for(var i=1; i<s_length; i++){
                            addSiblings(daughters[i], daughters[i-1], 'right');
                        }
                    }
                            
                }
                pset.push( centerS, centerC, centerText);

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
                return pset;
            }

            function setUpPed(obj,  posx, posy) {
                 drawed[obj.id] = true;
                 total_ped++;
                 var gen = (obj.sex == 'female')? 'female' : 'male';
                 obj[obj.id+'-ped'] = createPedigree(posx, posy, gen, obj, obj.father, obj.mother, true);
                 console.log('JsonPed', JsonPed, 'paper', paper);
            }



            setUpPed(JsonPed, 500, 400);


            // show 
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



    }         

            
