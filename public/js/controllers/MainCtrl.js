folderToUiAppControllers.controller('MainCtrl', ['$scope','$location', function($scope,$location){
    $scope.conf_ui_theme = 'default';
    $scope.changeView = function(view){
        $location.path(view); // path not hash
    }
}]);