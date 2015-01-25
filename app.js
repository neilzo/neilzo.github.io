var app = angular.module('helloWorldApp', ['ngRoute']);

app.controller('helloWorldController', function($scope){
	
	$scope.go = function(){
		
		var randoColor ='#'+Math.random().toString(16).substr(2,6);

		$scope.color = randoColor;
		
	}

});
