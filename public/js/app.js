var folderToUiApp = angular.module('folder-to-ui', [
    'ngRoute',
    'folderToUiAppControllers'
]);

folderToUiApp.run(['$route', function($route)  {
    $route.reload();
}]);

folderToUiApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/user', {
                templateUrl: './views/user.html',
                controller: 'UserCtrl'
            }).
            when('/folder', {
                templateUrl: './views/folder-contents.html',
                controller: 'FolderContentCtrl'
            }).
            when('/server', {
                templateUrl: './views/server.html',
                controller: 'ServerCtrl'
            }).
            when('/about', {
                templateUrl: './views/about.html',
                controller: 'AboutCtrl'
            })
    }]);

var folderToUiAppControllers = angular.module('folderToUiAppControllers', []);