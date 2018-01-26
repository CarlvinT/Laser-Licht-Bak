
app.controller('MainController', function($scope, $http, $window, $location, loginService) {

	$scope.loggedIn = loginService.getLocalData("loggedIn");

	$scope.login = function() {

		var data = {
			email: $scope.email,
			password: $scope.password
		}

		toggleLoadingOn();


 		$http({
 			method: "POST",
 			  url : "database/endpoint_auth.php",
 			  data: data
 		}).then(function mySuccess(response) {

 			if(response.data == '"success"') {

 				handleLogin();
 			
 			}

 		}, function myError(response) {

 			handleWrongLogin();

 		});

	}

	function handleLogin() {

		$scope.error = "";

		$scope.loginDetails = {
			header: 'Ingelogd',
			message: 'Successvol ingelogd!'
		};

		$scope.loggedIn = true;

		$('#loginModal').modal('hide');

		$('#notificationModal').modal('show');

		toggleLoadingOff();

		loginService.saveLocalData("loggedIn", true);

	}

	function handleWrongLogin() {

		$scope.error = "Emailadres en/of wachtwoord is onjuist!";

		toggleLoadingOff();
	}



	$scope.smoothScroll = function(slideClass) {

		$('html,body').animate({
			scrollTop: $('.'+slideClass).offset().top}, 'slow');

	}

	function toggleLoadingOn() {

		$scope.loading = true;

	}



	function toggleLoadingOff() {

		$scope.loading = false;
		$('.fa-cog').hide();

	}

	$scope.logoutConfirm = function() {
		$('#logoutModal').modal('show');
	}

	$scope.logout = function() {

		$scope.loggedIn = false;

		$('#logoutModal').modal('hide');

		$scope.loginDetails = {
			header: 'Uitgelogd',
			message: 'Successvol uitgelogd.'
		};

		$('#notificationModal').modal('show');

		loginService.saveLocalData("loggedIn",false);

		 $location.path( "/" );
	}



});

  
