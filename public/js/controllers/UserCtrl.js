folderToUiAppControllers.controller('UserCtrl',  ['$scope','$http','$location', function($scope,$http,$location){

    $scope.userview = {};
    $scope.userview.current_template = "./templates/user-settings.html";
    $scope.userview.change_template = function(template){
        $scope.userview.current_template = "./templates/"+template+".html";
    };

}]);