app.controller('ToolsController', function($scope, $http, drawService, coordinateService, loginService) {

	loginService.checkLogin();

	$scope.coordinates = coordinateService.getCoordinates();
	$scope.slider = drawService.slider();

	var canvas;
	var context;
	var dragging = false;

	$scope.importedCoords = [];

	_init();

// 	importCoords([250, 500,
// 250, 500,
// 250, 500,
// 500, 350,
// 500, 350,
// 750, 500,
// 750, 500,
// 500, 900,
// 500, 900,
// 500, 600,
// 500, 600,
// 750, 500,
// 500, 600,
// 250, 500,
// 250, 450,
// 500, 100,
// 500, 100,
// 750, 450,
// 750, 450,
// 500, 300,
// 500, 300,
// 250, 450,
// 500, 300,
// 500, 100,
// 500, 900,
// 250, 500,
// 500, 600,
// 500, 350,]);

/* Bike coordinaten

901,265,889,201,
853,148,800,112,
736,100,673,112,
619,148,583,201,
571,265,578,312,
598,355,629,390,
668,415,656,448,
475,231,427,236,
408,183,371,139,
321,109,264,100,
201,112,148,148,
112,201,100,265,
112,328,148,381,
201,418,265,430,
298,426,329,417,
369,505,354,546,
357,547,347,576,
331,577,318,580,
304,586,299,597,
303,614,315,619,
326,618,339,615,
352,612,361,611,
370,612,381,613,
391,614,396,615,
403,612,405,603,
401,598,388,590,
372,582,358,577,
369,550,371,552,
381,523,629,523,
608,580,608,598,
704,598,704,580,
626,580,684,421,
710,428,736,430,
800,418,853,382,
889,328,901,265,
901,265,883,265,
872,321,840,369,
793,401,736,412,
713,410,690,404,
713,339,732,290,
744,260,742,255,
737,253,728,261,
718,283,675,398,
611,345,590,265,
600,209,633,161,
680,129,736,118,
793,129,840,161,
872,209,883,265,
883,265,650,466,
635,505,388,505,
478,261,650,466,
462,252,377,482,
345,409,408,349,
430,265,430,254,
462,252,411,256,
411,265,392,339,
337,392,281,269,
411,256,409,238,
254,252,321,400,
293,409,265,412,
209,401,161,369,
129,321,118,265,
129,209,161,161,
208,129,264,118,
315,127,359,152,
392,191,409,238,
409,238,
*/



	importCoords([
570,203,
515,226,
515,226,
438,240,
437,240,
336,223,
336,223,
222,168,
222,168,
203,211,
203,211,
205,225,
205,225,
239,221,
239,221,
281,239,
281,239,
306,260,
306,260,
307,283,
307,283,
288,297,
288,297,
250,304,
250,304,
216,284,
216,284,
189,251,
189,251,
169,296,
169,296,
156,357,
156,357,
153,430,
153,430,
155,439,
155,439,
195,416,
195,416,
238,419,
238,419,
267,442,
267,442,
280,490,
280,490,
243,553,
243,553,
161,634,
161,634,
73,694,
73,694,
73,694,
73,694,
162,668,
162,668,
296,608,
296,608,
357,563,
357,563,
421,492,
421,492,
441,448,
441,448,
408,448,
408,448,
371,476,
371,476,
355,517,
355,517,
358,563,
358,563,
320,491,
320,491,
312,462,
312,462,
313,412,
313,412,
323,371,
323,371,
340,450,
340,450,
356,459,
356,459,
366,427,
366,427,
366,385,
366,385,
382,406,
382,406,
408,425,
408,425,
430,425,
430,425,
448,406,
448,406,
448,389,
448,389,
429,364,
429,364,
382,362,
382,362,
411,327,
411,327,
416,307,
416,307,
405,299,
405,299,
369,316,
369,316,
332,344,
332,344,
360,300,
360,300,
403,268,
403,268,
433,256,
433,256,
482,250,
482,250,
452,277,
452,277,
441,306,
441,306,
447,354,
447,354,
472,394,
472,394,
504,405,
504,405,
477,415,
477,415,
499,435,
499,435,
487,445,
487,445,
465,435,
465,435,
475,465,
475,465,
442,449,
442,449,
478,467,
478,467,
466,433,
466,433,
486,442,
486,442,
500,436,
500,436,
478,415,
478,415,
504,405,
504,405,
475,395,
475,395,
489,365,
489,365,
522,302,
522,302,
535,245,
535,245,
572,202,
572,202,]);

	$scope.toggleSnap = function() {
		drawService.toggleSnap();
	}

	$scope.toggleGrid = function() {
		drawService.toggleGrid();
	}

	$scope.togglePoints = function() {
		drawService.togglePoints();
	}

	$scope.displayCoords = function() {

		$('#coordModal').modal('show');

		var coords = coordinateService.getCoordinateList();
		console.log(coords);
		$('#int-coordinates').empty();
		for(var x = 0; x < coords.length; x++) {

			var theCoord = coords[x];

			$('#int-coordinates').append(theCoord + ',</br>')
		}
	}

	$scope.importViewCoords = function() {
		
		try {

			$scope.clearCanvas();

			var theList = $scope.importedCoords.replace('\n', "").split(',');

			console.log(theList);

    		importCoords(theList);	

		} catch(err) {

   			console.log('unable to import coords!');

		}

	}

	function importCoords(coordList) {

		var theList = coordinateService.splitCoordinates(coordList, 4);

		coordinateService.importCoordinates(theList);

		drawService.drawBatch(theList);
	}
	
	function updateLists(xFrom,yFrom,xTo,yTo) {

		xFrom = 2*Math.abs(xFrom);
		yFrom = 2*Math.abs(yFrom-500);

		xTo = 2*Math.abs(xTo);
		yTo = 2*Math.abs(yTo-500);

		coordinateService.updateCoordinates(xFrom, yFrom, xTo, yTo);

	}

	function convertToHexCoordinates(xFrom, yFrom, xTo, yTo) {

		// add 32768 to blank laser, lesser than that will shine laser in coordinates ranging from x/y 0-1000

		// sort coordinates to most efficient scanner movements  

	}

	// Snap this or move to drawService


	function getCanvasCoordinates(event) {

		var posX = event.clientX - Math.round(canvas.getBoundingClientRect().left);
		var posY = event.clientY - Math.round(canvas.getBoundingClientRect().top);

		return {x: posX, y: posY};
	}

	$scope.exportArduinoFormat = function() {

		var totalFile;

		var fileName = $scope.fileName;

		var header = '#ifndef ' + fileName;
		var functionHeader = 'const unsigned short ' +  fileName + '[] PROGMEM = {';
		var functionFooter = '};';

		totalFile = header + '\n\n' + functionHeader + '\n'

		var hexCoords = [];
		var coordList = coordinateService.getCoordinateList();

		
		for(var x = 0; x < coordList.length; x ++) {

			for(var y = 0; y < coordList[x].length; y ++) {

				hexCoords.push(coordList[x][y].toString(16));
			}
		}

		var hexString = '';

		for(var z = 0; z < hexCoords.length; z ++) {
			if(z % 4 == 0 && z != 0) {
				hexString += '\n';
			}
			hexString += hexCoords[z] + ',';
		}

		totalFile = totalFile + hexString + '\n' + functionFooter;

		// Convert to header file or copy from console (to do);

		console.log(totalFile);

	}

	function dragStart(event) {

		dragging = true;

		var position = getCanvasCoordinates(event);
	   
		drawService.drawPoint(position.x, position.y, false, true);

		drawService.setDragStart(getCanvasCoordinates(event));


		drawService.takeSnapshot(); 
	}

	function drag(event) {

		var position = getCanvasCoordinates(event);

		$('canvas').removeLayer('tempLine');

		if (dragging === true) {

			drawService.drawFakeLine(position.x, position.y);
		}

		posX = position.x;
		posY = position.y;



		if(drawService.getSnapping()) {

			posX = drawService._roundByRatio(position.x);
			posY = drawService._roundByRatio(position.y);

		}

		coordinateService.updateCoordinates({x: posX, y: posY});

		$scope.coordinates = coordinateService.getCoordinates();

		drawService.drawCrossHairs({x: posX, y: posY});

		$('canvas').drawLayers();

		$scope.$apply();

	}

	function dragStop(event) {

		dragging = false;
	  
		drawService.restoreSnapshot();

		pos = getCanvasCoordinates(event);
 
		drawService.drawPoint(
			pos.x, 
			pos.y, 
			false, 
			false
			);

		coordinateService.updateList(
			drawService.getDragPos().x, 
			drawService.getDragPos().y, 
			drawService._roundByRatio(pos.x), 
			drawService._roundByRatio(pos.y)
			);

		drawService.actuallyDrawLine(
			drawService.getDragPos().x, 
			drawService.getDragPos().y, 
			pos.x, 
			pos.y,
			false
			);

	}

// Scope functions

	$scope.undo = function() {

		drawService.removeLastAction();
		coordinateService.removeLastAction();
	}

	
	$scope.clearCanvas = function() {

		coordinateService.clear();

		drawService.clear();

	}

	function _init() {

		canvas = document.getElementById("canvas");

		context = canvas.getContext('2d');

		_handleKeys();

		drawService.drawGrid($('canvas'));  
	}

	function _handleKeys() {

		canvas.addEventListener('mousedown', dragStart, false);
		canvas.addEventListener('mousemove', drag, false);
		canvas.addEventListener('mouseup', dragStop, false);
		canvas.addEventListener('contextmenu', event => event.preventDefault());

		document.addEventListener('keydown', function(event) {

			if(event.shiftKey) {
				drawService.toggleSnap();
			}
			if(event.keyCode == 20) {
				$scope.toggleGrid();
			}
			if(event.keyCode == 27) {
				$scope.clearCanvas(); 
			}
			$scope.$apply();
		});
	  
	}

});
