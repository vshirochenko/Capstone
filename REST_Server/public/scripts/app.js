'use strict';

angular.module('medicineApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            // route for the aboutus page
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'content@': {
                        templateUrl : 'views/aboutus.html',
                        // controller  : 'AboutCtrl'                  
                    }
                }
            })

            // route for the catalog page
            .state('app.catalog', {
                url: 'catalog',
                views: {
                    'content@': {
                        templateUrl : 'views/catalog.html',
                        controller  : 'CatalogCtrl'
                    }
                }
            })

            // route for the dishdetail page
            .state('app.itemdetails', {
                url: 'catalog/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/itemdetail.html',
                        controller  : 'ItemDetailCtrl'
                   }
                }
            })

            // route for the forum page
            .state('app.forum', {
                url: 'forum',
                views: {
                    'content@': {
                        templateUrl : 'views/forum.html',
                        controller  : 'ForumCtrl'
                   }
                }
            });
    
        $urlRouterProvider.otherwise('/');
    })
;
