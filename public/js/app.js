var folderToUiApp = angular.module('folder-to-ui', [
    'ngRoute',
    'folderToUiAppControllers'
]);

folderToUiApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: './views/home.html',
                controller: 'HomeCtrl'
            }).
            when('/folder', {
                templateUrl: './views/folder-contents.html',
                controller: 'FolderContentCtrl'
            }).
            when('/settings', {
                templateUrl: './views/settings.html',
                controller: 'SettingsCtrl'
            }).
            when('/about', {
                templateUrl: './views/about.html',
                controller: 'AboutCtrl'
            }).
            otherwise({
                redirectTo: '/folder'
            });
    }]);