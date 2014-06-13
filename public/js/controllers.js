var folderToUiApp = angular.module('folder-to-ui', []);



folderToUiApp.controller('main', ['$scope', '$http',
    function ($scope, $http) {
        /*
         $http.get('/api/contents/list').success(function(data) {
         console.log(data['.files']);

         $scope.folders = data['.folders'];
         $scope.files = data;
         });
         */

        $scope.postRequestList = function () {
            var p = ".";
            if ($scope.path) p = $scope.path
            var params = {
                "path" : p
            };

            $http.post('/api/contents/list', params).success(function (data) {
                //console.log(data['.files']);
                $scope.folders = data['.folders'];
                $scope.files = data['.files'];
            });
        };

        $scope.postRequestList();

        $scope.orderProp = 'name';
    }]);


