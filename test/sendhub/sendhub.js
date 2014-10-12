function service(){

}
function contactCtrl($scope , $http) {
    $scope.contacts = [];
    $scope.getContacts = function(){
        $http({
            method: "POST",
            url : 'getcontacts.php',
            headers: { "Content-Type": "application/json"}
        })
            .success(function(data, status) {
                switch (data.httpcode){
                    case 200 :
                        var body = JSON.parse(data.body);
//                        $scope.contacts.push({name:$scope.name, phone:$scope.phone, id:body.id});
                        $scope.contacts = body.objects;
                        break;
                    case 400 :
                        var body = JSON.parse(data.body);
                        alert(body);
                        break;
                    default :
                        var body = JSON.parse(data.body);
                        alert(body);
                        break;
                }
            })
            .error(function(data, status) {
                alert('Incorrect Setting. ');
            });
    };
    $scope.addContact = function() {

        $http({
            method: "POST",
            url : 'addcontact.php',
            data: { "name" :$scope.name, "number" : $scope.number},
            headers: { "Content-Type": "application/json"}
        })
            .success(function(data, status) {
                switch (data.httpcode){
                    case 201 :
                        alert('Contact Added');
                        var body = JSON.parse(data.body);
                        $scope.contacts.push({name:$scope.name, number:$scope.number, id:body.id});
                        break;
                    case 400 :
                        var body = JSON.parse(data.body);
                        alert(body);
                        break;
                    default :
                        var body = JSON.parse(data.body);
                        alert(body);
                        break;
                }
            })
            .error(function(data, status) {
                alert('Incorrect Setting. ');
            });
    };


    $scope.select = function(item){
        $scope.selected = item;
    };

    $scope.sendMessage = function(){
        if($scope.selected == undefined){
            alert('Choose Contact Please');
            return true;
        }
        if(($scope.message == "")||($scope.message == undefined)){
            alert('Type Message Please');
            return true;
        }
        $http({
            method: "POST",
            url : 'sendhub.php',
            data: { "contacts" :["+"+$scope.selected.number], "text" : $scope.message},
            headers: { "Content-Type": "application/json"}
        })
            .success(function(data, status) {
                switch (data.httpcode){
                    case 201 :
                        alert('Message has been sent');
                        break;
                    case 400 :
                        var body = JSON.parse(data.body);
                        alert(body);
                        break;
                    default :
                        var body = JSON.parse(data.body);
                        alert(body);
                        break;
                }

            })
            .error(function(data, status) {
                alert('Incorrect Setting. ');
            });
    }
    $scope.getContacts();


}

