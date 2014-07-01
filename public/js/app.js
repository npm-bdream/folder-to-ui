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
            }). when('/user/settings', {
                templateUrl: './views/user-settings.html',
                controller: 'UserSettingsCtrl'
            }). when('/user/sessions', {
                templateUrl: './views/user-sessions.html',
                controller: 'UserSessionsCtrl'
            })
    }]);

var folderToUiAppControllers = angular.module('folderToUiAppControllers', []);