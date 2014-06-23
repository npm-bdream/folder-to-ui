folderToUiAppControllers.controller('MainCtrl', ['$scope','$location', function($scope,$location){
    $scope.conf_ui_logged = false;
    $scope.conf_ui_theme = 'default';
    $scope.changeView = function(view){
        $location.path(view); // path not hash
    };
    $scope.test = function () {
        $scope.conf_ui_logged = true;
    };
}]);