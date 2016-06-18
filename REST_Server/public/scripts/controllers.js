'use strict';

angular.module('medicineApp')
.constant("baseURL", "http://localhost:3000/")
.controller('AboutController', ['$scope', function ($scope) {


}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', 
	function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ 
        	template: 'views/login.html', 
        	scope: $scope, 
        	className: 'ngdialog-theme-default', 
        	controller:"LoginController" 
        });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', 
	function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ 
        	template: 'views/register.html', 
        	scope: $scope, 
        	className: 'ngdialog-theme-default', 
        	controller:"RegisterController" 
        });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', 
	function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// List of all equipment items
.controller('CatalogCtrl', ['$scope', 'ngDialog', 'catalogFactory', 
    function ($scope, ngDialog, catalogFactory) {

    $scope.items = [];
    $scope.getItems = function () {
    	catalogFactory.getItems()
	    	.then(function (resp) {
	    		debugger;
	    		$scope.items = resp.data;
	    	},
	    	function (err){
	    		debugger;
	    	});
    };
    $scope.getItems();
    
    $scope.addNewItem = function () {
        ngDialog.open({ 
            template: 'views/newitem.html', 
            scope: $scope, 
            className: 'ngdialog-theme-default', 
            controller:"NewItemCtrl"
        });
    };
}])

// Modal-window for addind new item (is allowed only to admin)
.controller('NewItemCtrl', ['$scope', '$location', 'ngDialog', 'catalogFactory',
    function ($scope, $location, ngDialog, catalogFactory) {
    
    $scope.item = {};

    $scope.addItem = function () {
        catalogFactory.addItem($scope.item)
        	.success(function (resp) {
        		//debugger;
        		// Call update of list of catalog items manually!
        		$scope.getItems();
        	})
        	.error(function (err) {
        		debugger;
        	});
        ngDialog.close();
    };
}])

// By clicking on item we can see detail info about it
.controller('ItemDetailCtrl', ['$scope', 'baseURL', '$stateParams', '$http', 'itemdetailFactory',
    function ($scope, baseURL, $stateParams, $http, itemdetailFactory) {

    $scope.item = {};
    itemdetailFactory.getItem()
    	.then(function (resp) {
    		$scope.item = resp.data;
    	},
    	function (err) {
    		debugger;
    	});
}])

// By clicking on item we can see detail info about it
.controller('ForumCtrl', ['$scope', 'baseURL', 'ngDialog', '$stateParams', '$http', 'commentFactory',
    function ($scope, baseURL, ngDialog, $stateParams, $http, commentFactory) {

    $scope.comments = [];
    $scope.getComments = function () {
        commentFactory.getComments()
            .then(function (resp) {
                $scope.comments = resp.data;
            },
            function (err){
                debugger;
            });
        };
    $scope.getComments();

    $scope.addNewComment = function () {
        ngDialog.open({ 
            template: 'views/newcomment.html', 
            scope: $scope, 
            className: 'ngdialog-theme-default', 
            controller:"NewCommentCtrl"
        });
    };
}])

// Modal-window for addind new comment (is allowed to authorized users)
.controller('NewCommentCtrl', ['$scope', '$location', '$localStorage', 'ngDialog', 'commentFactory',
    function ($scope, $location, $localStorage, ngDialog, commentFactory) {
    
    $scope.comment = {};
    var monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];

    $scope.addComment = function () {
    	debugger;
    	var token = localStorage.getItem('Token');
    	var parsedToken = JSON.parse(token);
    	var username = parsedToken.username;
    	$scope.comment.postedBy = username;

    	var date = new Date();
    	$scope.comment.date = date.getDate() + "-" + monthNames[date.getMonth() + 1] + "-" + date.getFullYear() + " " +
    							date.getHours() + ":" + date.getMinutes();

        commentFactory.addComment($scope.comment)
            .success(function (resp) {
                // Call update of list of comments manually!
                $scope.getComments();
            })
            .error(function (err) {
                debugger;
            });
        ngDialog.close();
    };
}])



;