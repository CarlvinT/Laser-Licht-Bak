app.service('coordinateService', function(drawService) {

	var cs = this;
	var coordinateList = [];
	var coordinates = {
		x: 0, 
		y: 0
	}

	cs.clear = function() {
		coordinateList = [];
		$('#int-coordinates').empty();
	}

	cs.removeLastAction = function() {
		coordinateList.pop();
	}

	cs.drawCoordinatesInModal = function() {
		return coordinateList;
	}

	cs.getCoordinates = function() {
		return coordinates;
	}

	cs.getCoordinateList = function() {
		return coordinateList;
	}

	cs.updateCoordinates = function(coords) {

		coordinates.x = 2*Math.abs(coords.x);
		coordinates.y = 2*Math.abs(coords.y-500);

	}

	cs.updateList = function(xFrom, yFrom, xTo, yTo) {

		xFrom = 2*Math.abs(xFrom);
		yFrom = 2*Math.abs(yFrom-500);

		xTo = 2*Math.abs(xTo);
		yTo = 2*Math.abs(yTo-500);

		coordinateList.push([xFrom, yFrom, xTo, yTo]);
	}

	cs.importCoordinates = function(coords) {

		coordinateList = coords;

	}

	cs.splitCoordinates = function(theList, chunkSize){

		var index = 0;
		var arrayLength = theList.length;

		var tempArray = [];
		
		for (index = 0; index < arrayLength; index += chunkSize) {
			myChunk = theList.slice(index, index+chunkSize);
			// Do something if you want with the group
			tempArray.push(myChunk);
		}

		return tempArray;
	}

});