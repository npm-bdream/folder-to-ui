folderToUiAppControllers.controller('FolderContentCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.conf_ui_extension = config.extension;
    $scope.conf_ui_managedType = config.managedType;
    $scope.conf_ui_sort_file = 'name';
    $scope.conf_ui_sort_dir = 'toString()';

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
        params.recursively = false;
        params.method = "simple";
        $scope.conf_folder_path = p;
        $scope.conf_iron_path = [];
        var splited_conf_folder_path = $scope.conf_folder_path.split('/');
        console.log (splited_conf_folder_path);
        var splitedLenght = splited_conf_folder_path.length;
        for (var i=0; i<splitedLenght;i++){
            if (splited_conf_folder_path[i] == ''){
                $scope.conf_iron_path.push({"name": 'Share', "path":''});
            } else {
                var currentIronPath = '';

                if ($scope.conf_iron_path[i-1]) currentIronPath = $scope.conf_iron_path[i-1].path;
                $scope.conf_iron_path.push({"name": splited_conf_folder_path[i], "path":currentIronPath+'/'+splited_conf_folder_path[i]});
            }
        }

        $http.post('/api/folder/list', params).success(function (data) {
            $scope.folders = data['.folders'];
            $scope.files = data['.files'];
        });

    };

    $scope.postRequestList('');
}]);