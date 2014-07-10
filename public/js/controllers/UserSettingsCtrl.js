folderToUiAppControllers.controller('UserSettingsCtrl',  ['$scope','$http','$location', function($scope,$http,$location){
    $scope.setUser = function () {
        var params = {};
        params.email = $scope.data.user.email;
        params.theme = $scope.param.theme;

        $http.put('/api/user/self', params).success(function (data) {
        }).error(function (data, status, headers, config){
        });
    }
}]);