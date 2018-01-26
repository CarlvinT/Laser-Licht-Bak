
app.controller('DashboardController', function($sce,$scope, $http, loginService) {

	fetchNewLoraData();
	loginService.checkLogin();

	if(loginService.isAuthenticated()) {
		initCharts();
	}

  	$scope.fietsers = [];
  	$scope.lichten = [];
  	$scope.boxes = [];
  	$scope.selectedBox;
  	$scope.barChartData = [];
  	$scope.barChart = [];
  	$scope.totalResults = 0;

  	$scope.activeContent = 'default';

  	$scope.infoWindows = [];

  	$scope.boxOpen = false;

  	$scope.map;




  	function initCharts() {

  		getFietsers(10);

  		var lastWeekDate = new Date();

		lastWeekDate.setDate(lastWeekDate.getDate()-7);

		lastWeekDate = formatCorrectDate(new Date(lastWeekDate))

		var theDate = formatCorrectDate(new Date());

  		$scope.barChartDates = {
  			startDate: lastWeekDate,
  			endDate: theDate
  		}

  		getBarChartData($scope.barChartDates.startDate, $scope.barChartDates.endDate);


  		getLichten();

  		initMap();

  		initDateChecker();

  	}

  	$scope.formatDate = function(timestamp) {

  		var dateson = moment(timestamp).fromNow();

        return dateson;
  	}

  	$scope.showFietsWarning = function() {

  		$('#dataModal').modal('show');

  	}

  	$scope.closeBox = function() {
  		$scope.boxOpen = false;
  	}

  	$scope.movePos = function(lat,long) {

  	//	console.log(lat,long);

  		$scope.map.panTo({
			lat : parseFloat(lat),
			lng : parseFloat(long)
		});


  
  	}

  	$scope.getFietserCount = function(count) {

  		getFietsers(count);

  		if(count == 0) {

  			$('#dataModal').modal('hide');
  		}
  		
  	}

  	$scope.changeDates = function() {



  		getBarChartData($scope.barChartDates.startDate, $scope.barChartDates.endDate);

  	}

  	function formatCorrectDate(dateObject) {

  		// YYYY MM DD HH MM SS
  		var fullDate = (dateObject.getMonth() + 1) + '-' + 
  			dateObject.getDate() + '-' +
  			dateObject.getFullYear();

		return fullDate;

  	}

  	function initDateChecker() {


		  $("#startDate").datepicker({ 
		        autoclose: true, 
		        todayHighlight: true
		  }).datepicker('update', $scope.barChartDates.startDate);

		  $("#endDate").datepicker({ 
		        autoclose: true, 
		        todayHighlight: true
		  }).datepicker('update', $scope.barChartDates.endDate);

  	}

  	function getBarChartData(dateStart, dateEnd) {

  			$http({
	        method : "POST",
	        url : "database/endpoint_barchart.php",
	        data: {
	        	startVal: dateStart,
	        	endVal: dateEnd
	        }
    	}).then(function mySuccess(response) {

  
         	$scope.barChartData = response.data;

         	initBarChart(response.data);




    	}, function myError(response) {

     //   	console.log(response);

    	});



  	} 

  	function initBarChart(theData) {

  		$('#bar-chart-grouped').remove();

  		$('#bar-chart-container').append('<canvas id="bar-chart-grouped"  height="300"></canvas>');

  		$scope.barChart = new Chart(document.getElementById("bar-chart-grouped"), {
		    type: 'bar',
		    data: {
		      labels: ["Totaal"],
		      datasets: [
		        {
		          label: "Zonder licht (" + theData[0].aantal + ")",
		          backgroundColor: "#a94442",
		          data: [theData[0].aantal,0]
		        }, {
		          label: "Met licht (" + theData[1].aantal + ")",
		          backgroundColor: "#3c763d",
		          data: [theData[1].aantal,0]
		        }
		      ]
		    },
		    options: {
		      title: {
		        display: true,
		      }
		    }
});
  	}

  	function initPieChart() {


  		totaalUit = parseInt($scope.lichten[0].aantal);
  		totaalAan = parseInt($scope.lichten[1].aantal);

  		$scope.totalResults = totaalAan + totaalUit;

  		var totalCount = totaalUit + totaalAan;




  		var uitPercentage = (($scope.lichten[0].aantal / totalCount) * 100).toFixed(1);
  		var aanPercentage = (($scope.lichten[1].aantal / totalCount) * 100).toFixed(1);

  	

  		var data = {
		    labels: [
		        "Geen Licht (" + uitPercentage + "%)" ,
		        "Wel Licht (" + aanPercentage + "%)",
		    ],
    		datasets: [
	        {
	            data: [$scope.lichten[0].aantal, $scope.lichten[1].aantal],
	            backgroundColor: [
	                "#a94442",
	                "#3c763d",

	            ]
        	}]
		};

		var ctx = document.getElementById("pieChart").getContext('2d');
		var myChart = new Chart(ctx, {
		      type: 'pie',
		      data: data,
		});

  	}

  	function getLichten() {

  		$http({
	        method : "GET",
	        url : "database/endpoint_licht.php"
    	}).then(function mySuccess(response) {

  
         	$scope.lichten = response.data;

         	initPieChart();

    	}, function myError(response) {

       // 	console.log(response);

    	});


  	}


  	function getFietsers(count) {

  		$http({
	        method : "POST",
	        url : "database/endpoint_stats.php",
	        data: {count: count}
    	}).then(function mySuccess(response) {

    		//console.log(response);

         	$scope.fietsers = response.data;

    	}, function myError(response) {

        //	console.log(response);

    	});

  	}

  	function initMap() {


  	jQuery(document).ready(function () {

		var style = [
			{
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#242f3e"
					}
				]
			},
			{
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#746855"
					}
				]
			},
			{
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#242f3e"
					}
				]
			},
			{
				"featureType": "administrative.locality",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#d59563"
					}
				]
			},
			{
				"featureType": "poi",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#d59563"
					}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#263c3f"
					}
				]
			},
			{
				"featureType": "poi.park",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#6b9a76"
					}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#38414e"
					}
				]
			},
			{
				"featureType": "road",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#212a37"
					}
				]
			},
			{
				"featureType": "road",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#9ca5b3"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#746855"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "geometry.stroke",
				"stylers": [
					{
						"color": "#1f2835"
					}
				]
			},
			{
				"featureType": "road.highway",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#f3d19c"
					}
				]
			},
			{
				"featureType": "transit",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#2f3948"
					}
				]
			},
			{
				"featureType": "transit.line",
				"stylers": [
					{
						"visibility": "on"
					}
				]
			},
			{
				"featureType": "transit.station",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#d59563"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [
					{
						"color": "#17263c"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "labels.text.fill",
				"stylers": [
					{
						"color": "#515c6d"
					}
				]
			},
			{
				"featureType": "water",
				"elementType": "labels.text.stroke",
				"stylers": [
					{
						"color": "#17263c"
					}
				]
			}
		]

		var options = {
			zoom: 15,
			center:  new google.maps.LatLng(52.167439, 4.471286),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		};

		$scope.map = new google.maps.Map($('#map')[0], options);
		$scope.map.setOptions({
			styles: style
		});
	});
	
  	getBoxes();

  	}


  	function getBoxes() {

  		$http({
	        method : "GET",
	        url : "database/endpoint_box.php"
    	}).then(function mySuccess(response) {

  
         	$scope.boxes = response.data;

         	drawBoxes();

    	}, function myError(response) {

        	console.log(response);

    	});



  	}

  	function getBoxDetails(boxId) {

  		$http({
	        method : "POST",
	        url : "database/endpoint_boxdetails.php",
	        data: {
	        	id: boxId,
	        }
    	}).then(function mySuccess(response) {

         	return response;

    	}, function myError(response) {

        	console.log('Error', response);

    	});

  	}

  	function drawBoxes() {

  		for(var x = 0; x < $scope.boxes.length; x++) {

  			var theBox = $scope.boxes[x];


  			var lat = parseFloat(theBox.latitude);
  			var long = parseFloat(theBox.longitude);

  		//	console.log('boxDets',getBoxDetails(1));



  			var theContent = theBox.location + '<br/><br/>' + theBox.details;


  			infowindow = new google.maps.InfoWindow({
      			content: theContent
    		});

    		$scope.infoWindows.push(infowindow);

    	//	console.log('drawing marker');

    		var marker = new google.maps.Marker({
	          position: new google.maps.LatLng(lat, long),
	          map: $scope.map,
	          title: theBox.location,
	          icon: 'img/marker_icon.png'
      		});

    		var content = theContent;

    		google.maps.event.addListener(marker,'click', (function(marker, content, theBox, infowindow){ 

    			return function() {

    							$scope.selectedBox = theBox;
    			console.log($scope.selectedBox);

	    			for(var x = 0; x < $scope.infoWindows.length; x++) {
	    				$scope.infoWindows[x].close();
	    				
	    			}

	    			

        			infowindow.setContent(content);
        			infowindow.open(map,marker);
        			changeBoxOpen();
        			moveTo(theBox.longitude, theBox.latitude);
    			};

			})(marker,content, theBox, infowindow));  

			
      	
    	}
  	}



  	function changeBoxOpen() {
  		// console.log('opening box');
  			$scope.boxOpen = true;
  			$scope.$apply();
  	}

	function createMarker(width, height, radius) {

      var canvas, context;

      canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      context = canvas.getContext("2d");

      context.clearRect(0,0,width,height);

      // background is yellow
      context.fillStyle = "rgba(255,255,0,1)";

      // border is black
      context.strokeStyle = "rgba(0,0,0,1)";

      context.beginPath();
      context.moveTo(radius, 0);
      context.lineTo(width - radius, 0);
      context.quadraticCurveTo(width, 0, width, radius);
      context.lineTo(width, height - radius);
      context.quadraticCurveTo(width, height, width - radius, height);
      context.lineTo(radius, height);
      context.quadraticCurveTo(0, height, 0, height - radius);
      context.lineTo(0, radius);
      context.quadraticCurveTo(0, 0, radius, 0);
      context.closePath();

      context.fill();
      context.stroke();

      return canvas.toDataURL();

    }

 	function fetchNewLoraData() {

 		$http({
 			method: "GET",
 			  url : "database/endpoint_lora.php",
 		}).then(function mySuccess(response) {

 		//	console.log("Updated database from TTN");


 		}, function myError(response) {

 		//	console.log("Failed updating database from TTN");

 		});

 		



 	}

});




