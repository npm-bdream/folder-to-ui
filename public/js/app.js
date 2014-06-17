var folderToUiApp = angular.module('folder-to-ui', [
    'ngRoute',
    'folderToUiAppControllers'
]);

folderToUiApp.config(['$routeProvider',
    function($routeProvider) {
        console.log('toto');
        $routeProvider.
            when('/about', {
                templateUrl: './views/about.html',
                controller: 'AboutCtrl'
            }).
            when('/folder', {
                templateUrl: './views/folder-contents.html',
                controller: 'FolderContentCtrl'
            }).
            otherwise({
                redirectTo: '/about'
            });
    }]);