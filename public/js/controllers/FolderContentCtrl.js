folderToUiAppControllers.controller('FolderContentCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.conf_ui_browsing = 'browsing';
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

        if ( $scope.conf_ui_browsing == 'browsing' ) {
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
            console.log ($scope.conf_iron_path);
            // TODO
        } else if ( $scope.conf_ui_browsing == 'browsing-all-simple' ) {
            params.path = '';
            params.recursively = true;
            params.method = "simple";
        } else if ( $scope.conf_ui_browsing == 'browsing-all-ext' ) {
            params.path = '';
            params.recursively = true;
            params.method = "simpleExtension";
        } else if ( $scope.conf_ui_browsing == 'browsing-all-path' ) {
            params.path = '';
            params.recursively = true;
            params.method = "simplePath";
        }



        $http.post('/api/folder/list', params).success(function (data) {
            if ( $scope.conf_ui_browsing == 'browsing' ) {
                $scope.folders = data['.folders'];
                $scope.files = data['.files'];
            }  else if ( $scope.conf_ui_browsing == 'browsing-all-simple' ) {
                $scope.folders = [];
                $scope.files = data;
            }  else if ( $scope.conf_ui_browsing == 'browsing-all-ext' || $scope.conf_ui_browsing == 'browsing-all-path' ) {
                $scope.exts = data;
            }
        });
    };

    $scope.postRequestList('');


}]);