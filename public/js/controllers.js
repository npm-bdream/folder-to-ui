var folderToUiAppControllers = angular.module('folderToUiAppControllers', []);

folderToUiAppControllers.controller('MainCtrl', ['$scope','$location', function($scope,$location){
    $scope.changeView = function(view){
        $location.path(view); // path not hash
    }
}]);

folderToUiAppControllers.controller('FolderContentCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.recursivity = false;
    $scope.ui_browsing = 'browsing';

    $scope.postRequestList = function (path) {

        var p = path;
        var params = {
            "path" : p,
            "date" : "yyyy/mm/dd HH:MM:ss",
            "size" : {
                "b":" o",
                "kb":" ko",
                "mb":" mo",
                "gb":" go",
                "tb":" to"
            }
        };

        params.path = p;

        if ( $scope.ui_browsing == 'browsing' ) {
            params.recursively = false;
            params.method = "simple";
        } else if ( $scope.ui_browsing == 'browsing-all-simple' ) {
            params.path = '.';
            params.recursively = true;
            params.method = "simple";
        } else if ( $scope.ui_browsing == 'browsing-all-ext' ) {
            params.path = '.';
            params.recursively = true;
            params.method = "simpleExtension";
        } else if ( $scope.ui_browsing == 'browsing-all-path' ) {
            params.path = '.';
            params.recursively = true;
            params.method = "simplePath";
        }


        $scope.folderPath = p;
        $http.post('/api/folder/list', params).success(function (data) {
            if ( $scope.ui_browsing == 'browsing' ) {
                $scope.folders = data['.folders'];
                $scope.files = data['.files'];
            }  else if ( $scope.ui_browsing == 'browsing-all-simple' ) {
                $scope.folders = [];
                $scope.files = data;
            }  else if ( $scope.ui_browsing == 'browsing-all-ext' || $scope.ui_browsing == 'browsing-all-path' ) {
                $scope.exts = data;
            }
        });
    };

    $scope.postRequestList('./sharing');

    $scope.orderProp = 'name';
}]);

folderToUiAppControllers.controller('AboutCtrl', ['$scope', function($scope){

}]);
