folderToUiAppControllers.controller('UserSessionsCtrl',  ['$scope','$http','$location', function($scope,$http,$location){
    $scope.data={};
    $scope.data.sessions = [];

    $http.get('/api/user/sessions').success(function (data) {
        $scope.data.sessions = data;
    }).error(function (data, status, headers, config){

    });

}]);