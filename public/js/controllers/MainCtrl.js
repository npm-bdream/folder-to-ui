folderToUiAppControllers.controller('MainCtrl', ['$scope','$location', function($scope,$location){
    $scope.param_ui_logged = false;
    $scope.param={};
    $scope.param.theme = 'default';
    alert($scope.param_ui_theme);
    $scope.updateScope = function () {
        $scope.param_ui_theme = 'default';
    };
    $scope.changeView = function(view){
        $location.path(view); // path not hash
    };
    $scope.test = function () {
        $scope.param_ui_logged = true;
    };
}]);