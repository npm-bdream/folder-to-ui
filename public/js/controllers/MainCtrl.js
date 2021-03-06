folderToUiAppControllers.controller('MainCtrl', ['$scope','$http','$location', function($scope,$http,$location){

    $scope.param_ui_logged = false;
    $scope.param={};
    $scope.data={};
    $scope.param.theme = 'css/glow-default.css';
    $scope.param.username = '';
    $scope.param.password = '';

    $scope.onKeyPress = function(ev) {
        if(ev.keyCode == 13){
            $scope.login();
        }
    };

    $scope.session = function () {
        $http.get('/api/session').success(function (data) {
            $scope.data.user = data;
            $scope.param.theme = $scope.data.user.theme;
            $scope.param.username = data.username;
            $scope.param_ui_logged = true;
        }).error(function (data, status, headers, config){

        });
    };

    $scope.session();

    $scope.changeView = function(view){
        $location.path(view);
    };
    $scope.login = function () {
        var params = {};
        params.username = $scope.param.username;
        params.password = $scope.param.password;
        //console.log(params);
        $http.post('/api/auth', params).success(function (data) {
            if ( data.username ) {
                $scope.data.user = data;
                $scope.param.theme = $scope.data.user.theme;
                $scope.param_ui_logged = true;
                $scope.changeView('folder');
            }
        }).error(function (data, status, headers, config){

        });
    };

    $scope.logout = function () {
        $http.delete('/api/session').success(function (data, status, headers, config) {
            $scope.data.user = null;
            $scope.param_ui_logged = false;
        }).error(function (data, status, headers, config){

        });
    };

}]);