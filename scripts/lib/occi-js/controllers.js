var lizennApp = angular.module('occi-js', []);

lizennApp.config(function($logProvider){

	// Turn debugging output to console on (true) or off (false)
	$logProvider.debugEnabled(false);
	
});

// Here we declared a controller called occiCtrl and registered it in an AngularJS module, lizennApp
lizennApp.controller('occiCtrl', function ($scope, $http, $attrs, $log) {

	// Set default headers for GET requests
	$http.defaults.headers.get = { 'Accept': 'application/json' };

	// Default OCCI server url
	$scope.serverurl = "localhost:8080";

	// Get the categories
	$scope.getCategories = function() {
	
		$http.get("http://" + $scope.serverurl + "/-/")
			.success(function(data) {
			
				// Reset the error object (in case we previously had errors)
				$scope.error = false;
				
				// Show the <div> containing a list of categories
				$scope.showCategories = true;
				
				// Save the returned data in our scope
				$scope.data = data;
				
				// Debug
				$log.debug(data);
				
			}).error(function(data, status) {
			
				// Set the error object to update our template
				$scope.error = {
					serverConnection:  true
				};
				
				// Debug
				$log.debug(status);
				
			});
		
	};
	
	// Get resources
	$scope.getResources = function(location, title) {
	
		// Show the resources element
		$scope.showResources = true;
		
		// Set the resources location
		$scope.resourcesLocation = location;
		
		// Update the resource title with the selected category
		$scope.category_title = title;
		
		// Fecth resources
		$http.get(location)
			.success(function(data) {
			
				// Save the returned data in our scope
				$scope.resources = data;
				
			}).error(function(data, status) {
			
				// Debug
				$log.debug(status);
				
			});
	};
	
	// Get a resource's details
	$scope.getResourceDetails = function(location) {
		$scope.resourceLocation = location; // FIXME Why was that?
		$http.get(location)
			.success(function(data) {
			
				// Save the returned data in our scope
				$scope.resourcedetails = data;
				
			}).error(function(data, status) {
			
				// Debug
				$log.debug(status);
				
			});
	};
	
	// Delete a resource
	$scope.deleteResource = function(location) {
		$http.delete(location)
			.success(function(data) {
				$log.debug(data);
			}).error(function(data, status) {
				$log.debug(status);
			});
	}

	// Add a resource
	$scope.addResource = function() {
		
		/*
		 Working CURL command to add a new resource:
		//curl -v -X POST -H "content-type: application/json" -d '{"resources":[{"kind":"http://schemas.ogf.org/occi/infrastructure#compute","attributes":{"occi":{"core":{"title":"Laptop"},"compute":{"architecture":"x86","cores":2,"hostname":"thinkpad","memory":128,"speed":8000}}}}]}' http://localhost.localdomain:8080/collections/compute/
		*/

		// Json object
		var newResource = {"resources":[{"kind":"http://schemas.ogf.org/occi/infrastructure#compute","attributes":{"occi":{"core":{"title":"Laptop"},"compute":{"architecture":"x86","cores":2,"hostname":"thinkpad","memory":128,"speed":8000}}}}]};

		// With Angular's $http
		$http({
			url:'http://localhost:8080/collections/compute/',
			method:"POST",
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(newResource)
		}).success(function(data, status) {
			$log.debug("Yea! Resource added!");
			//$log.debug(status);
		}).error(function(data, status) {
			$log.debug("Error");
			$log.debug(status);
		});
		
		// With Angular's $http.post
		/*
		$http.post('http://localhost:8080/collections/compute/', JSON.stringify(newResource))
		.success(function(data, status) {
			$log.debug("Yea! Resource added!");
			//$log.debug(status);
		}).error(function(data, status) {
			$log.debug("Error");
			$log.debug(status);
		});
		*/
				
		// With Jquery's AJAX
		/*
		$.ajax({
			headers: {
				'Content-Type': 'application/json' 
			},
			'url': 'http://localhost:8080/collections/compute/',
			'data': JSON.stringify(newResource),
			'success': $log.debug("YES")
		});
		*/
		
	}
	
});


