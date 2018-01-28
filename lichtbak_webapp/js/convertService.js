app.service('convertService', function() {

	var cs = this;

	cs.convertToHex = function(fileName, coordinateList) {


		var functionHeader = 'const unsigned short draw_' +  fileName + '[] PROGMEM = {\n';
		var functionFooter = '};';

		//var sortedList = cs.sortList(coordinateList);
		var sortedList = cs.fixList(coordinateList);

		var hexCoords = cs.intListToHex(sortedList);


		var hexString = '';

		for(var z = 0; z < hexCoords.length; z ++) {
			if(z % 4 == 0 && z != 0) {
				hexString += '\n';
			}
			hexString += hexCoords[z] + ',';
		}

		totalFile = functionHeader + hexString + '\n' + functionFooter;

		// Convert to header file or copy from console (to do);

		return totalFile;
	}

	cs.fixList = function(coordinateList) {

		var fixedList = []

		for(var x = 0; x < coordinateList.length; x ++) {

			fixedList.push({x: coordinateList[x][0], y: coordinateList[x][1]})
			if(coordinateList[x].length > 2) {
					fixedList.push({x: coordinateList[x][2], y: coordinateList[x][3]})
			}
		

		}

		return fixedList;
	}

	cs.intListToHex = function(coordinates) {

		var hexList = [];

		//console.log(coordinates);

		for(var x = 0; x < coordinates.length; x ++) {
			theCoord = coordinates[x];


			hexList.push('0x' + theCoord.x.toString(16))
			hexList.push('0x' + theCoord.y.toString(16))
		}

		return hexList;

	}

	cs.sortList = function(coordinates) {

		var points = [];
		var newList = [];

		for(var x = 0; x < coordinates.length; x ++) {

			points.push({x: coordinates[x][0], y: coordinates[x][1]});
			points.push({x: coordinates[x][2], y: coordinates[x][3]});
			
		}

		var opts = {
		  yName: 'y',
		  xName: 'x',
		}

		var origin = {x: 500, y: 500};

		var result = cs.sortByDistance(origin, points, opts);

		filteredPoints = [];


		for(var y = 0; y < result.length; y ++) {

			if(!isNaN(result[y].distance)) {

				filteredPoints.push({x: result[y].x, y: result[y].y})
			} 
		}

		return filteredPoints;

	}

	cs.distanceBetweenPoints = function(p1, p2, name) {
  		return Math.abs(Math.sqrt((p1[name.y] - p2[name.y]) * (p1[name.y] - p2[name.y]) + (p1[name.x] - p2[name.x]) * (p1[name.x] - p2[name.x])))
	}

	cs.sortByDistance = function(origin, points, opts = {}) {

		var names = {
    		y: opts.yName || 'y',
    		x: opts.xName || 'x'
		}

  		var newPoints = JSON.parse(JSON.stringify(points));

  		newPoints.sort(function (a, b) {
    		a.distance = cs.distanceBetweenPoints(origin, a, names);
    		b.distance = cs.distanceBetweenPoints(origin, b, names);

    		return a.distance - b.distance;
  		})

  		return newPoints;

	}


});
