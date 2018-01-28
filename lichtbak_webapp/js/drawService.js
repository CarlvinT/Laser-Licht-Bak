app.service('drawService', function() {

	var ds = this;
	var gridSnapping = true;
	var gridActive = true;
	var pointsActive = true;
	var snapRatio = 10;
	var dragStartLocation;
	var canvas = $('canvas');
	var snapshot;
	var context;
	var slider = {
		value: snapRatio,
		options: {
			showTicksValues: false,
			floor: 5,
			ceil: 250,
			step: 5,
			minLimit: 5,
			maxLimit: 250,
			pushRange: true,
			onChange: function(e) {
				ds.redrawGrid();
			}
		}
	}

	ds.drawBatch = function(coordinateList) {

		for(x = 0; x < coordinateList.length; x++) {

			var xFrom = coordinateList[x][0]/2;

			var yFrom = Math.abs(coordinateList[x][1]-1000)/2;

			var xTo = coordinateList[x][2]/2;

			var yTo = Math.abs(coordinateList[x][3]-1000)/2;

			ds.drawPoint(xFrom, yFrom, true, true);

			ds.drawPoint(xTo, yTo, true, false);

			ds.actuallyDrawLine(xFrom, yFrom, xTo, yTo, true);

		}
	}

	ds.takeSnapshot = function() {

		var cvs = document.getElementById("canvas");

		var ctxt = cvs.getContext('2d');

		snapshot = ctxt.getImageData(0, 0, cvs.width, cvs.height);

	}

	ds.restoreSnapshot = function() {

		var cvs = document.getElementById("canvas");

		var ctxt = cvs.getContext('2d');

		try {

			ctxt.putImageData(snapshot, 0, 0);

		} catch(err) {

			console.log("Error restoring snapshot.");

		}
	}

	ds.toggleGrid = function() {

		gridActive = !gridActive;

		!gridActive ? ds.removeGrid() : ds.redrawGrid();
	}

	ds.removeGrid = function() {

		canvas.removeLayerGroup('grid').drawLayers();
	}

	ds.togglePoints = function() {

		pointsActive = !pointsActive;

		fill = (pointsActive ? '#000' : 'rgba(0, 0, 0, 0)');

		canvas.setLayerGroup('points', {
			fillStyle: fill
		}).drawLayers();

	}

	ds.slider = function() {
		return slider;
	}

	ds.toggleSnap = function() {

		gridSnapping = !gridSnapping;

	}

		// Draw functions here

	ds.getSnapping = function() {

		return gridSnapping;
	}

	ds.getDragPos = function() {

		posX = ds.dragStartLocation.x;
		posY = ds.dragStartLocation.y;	

		if(gridSnapping) {

			posX = ds._roundByRatio(posX);
			posY = ds._roundByRatio(posY);

			return {x: posX, y: posY};
		}

		return {x: posX, y: posY};
	}


	ds.setDragStart = function(coords) {

		ds.dragStartLocation = coords;


	}

	ds.drawGrid = function(canvas) {

			canvas.removeLayerGroup('grid');

			maxLen = 500/snapRatio;

			for(i = 0; i < maxLen; i++) {

				color = (i % 5 == 0 ? '#6699ff' : '#99ccff');

				canvas.drawLine({
					layer: true,
					  strokeStyle: color,
					  strokeWidth: 1,
					  groups: ['grid'],
					  x1: i*snapRatio, y1: 0,
					  x2: i*snapRatio, y2: 500,
				});

				canvas.drawLine({
					 layer: true,
					  strokeStyle: color,
					  strokeWidth: 1,
					  groups: ['grid'],
					  x1: 0, y1: i*snapRatio,
					  x2: 500, y2: i*snapRatio,
				});
			}

			canvas.drawLayers();

		}

		ds.snapRatio = function() {
			return snapRatio;
		}

		ds.redrawGrid = function() {

			snapRatio = slider.value;

			if(gridActive) {
				canvas.removeLayerGroup('grid');
				this.drawGrid(canvas);  
			}
		}

		ds.removeTooltip = function() {

			canvas.removeLayer('tooltipBox');
			canvas.removeLayer('tooltipText');
		}

		ds.displayTooltip = function(e) {

			// Keep tooltip coordinates in boundaries of canvas

			xValue = Math.max(50, Math.min(e.x, 450));
			yValue = Math.max(50, Math.min(e.y, 450));

			canvas.drawRect({
				fillStyle: '#000',
				strokeStyle: '#fff',
				strokeWidth: 1,
				height: 25,
				width: 90,
				groups: 'tooltip',
				name: 'tooltipBox',
				x: xValue,
				y: yValue,
				layer: true,    
			});

			canvas.drawText({
				fillStyle: '#fff',
				strokeWidth: 1,
				layer: true,
				x: xValue,
				y: yValue,
				fontSize: 12,
				name: 'tooltipText',
				groups: 'tooltip',
				fontFamily: 'Roboto, sans-serif',
				text: 'X: ' + e.x*2 + ' Y: ' + Math.abs(e.y-500)*2
			});
		}

		ds.drawPoint = function(posX, posY, isImported, lineStart) {

			lines = canvas.getLayerGroup('lines');

			lineCount = (typeof lines != 'undefined' ? lines.length : 0);

			pointPrefix = lineStart ? 'x' : 'y';

			pointName = pointPrefix + '_point_' + lineCount;

			fill = (pointsActive ? '#000' : 'rgba(0, 0, 0, 0)');

			if(gridSnapping && !isImported) {
				posX = ds._roundByRatio(posX);
				posY = ds._roundByRatio(posY);
			}

			canvas.addLayer({
				type: 'rectangle',
				fillStyle: fill,
				x: posX, 
				y: posY,
				width: 5,
				groups: ['points'],
				name: pointName,
				height: 5,
				strokeWidth:10,
				mouseover : function(e, sick) {
					ds.displayTooltip(e);
				},
				mouseout : function(e, sick) {
					ds.removeTooltip();
				}
			}).drawLayers();

		//	console.log('drawing: ' + pointName);

		}

		ds.removeLine = function() {

			lines = canvas.getLayerGroup('lines');

			lineCount = (typeof lines != 'undefined' ? lines.length-1 : 0);

			lineName = 'line_' + lineCount;
			
			canvas.removeLayer(lineName).drawLayers();

			return lineCount;

		}

		ds.removePoint = function(lineCount, lineStart) {

			lines = canvas.getLayerGroup('lines');

			lineCount = (typeof lines != 'undefined' ? lines.length : 0);

			pointPrefix = (lineStart ? 'x' : 'y');

			pointName = pointPrefix + '_point_' + lineCount;
			
			canvas.removeLayer(pointName).drawLayers();

		//	console.log('removing:' + pointName);

		}

		ds.removeLastAction = function() {

			lineCount = lineCount < 1 ? 0 : ds.removeLine();

			ds.removePoint(lineCount, true);

			ds.removePoint(lineCount, false);
			
			   
			// $scope.activeLines.pop();
			// $scope.activeLines.pop();

			// $scope.hexLines.pop();
			// $scope.hexLines.pop();

		}

		ds.actuallyDrawLine = function(fromX, fromY, posX, posY, isImported) {

			// Create new layer with a line

			lines = canvas.getLayerGroup('lines');

			lineCount = (typeof lines != 'undefined' ? lines.length: 0);

			if(gridSnapping && !isImported) {
				posX = ds._roundByRatio(posX);
				posY = ds._roundByRatio(posY);
			}

			canvas.drawLine({
				strokeStyle: '#000',
				strokeWidth: 1,
				groups: ['lines'],
				name: 'line_' + lineCount,
				layer: true,
				x1: fromX, y1: fromY,
				x2: posX, y2: posY,   
			});
		}

		ds.drawFakeLine = function(posX, posY) {


			toX = ds.dragStartLocation.x;
			toY = ds.dragStartLocation.y;

			if(gridSnapping) {

				posX = ds._roundByRatio(posX);
				posY = ds._roundByRatio(posY);

				toX = ds._roundByRatio(ds.dragStartLocation.x);
				toY = ds._roundByRatio(ds.dragStartLocation.y);
			}

			canvas.drawLine({
				strokeStyle: '#000',
				strokeWidth: 1,
				name: 'tempLine',
				layer: true,
				x1: toX, 
				y1: toY,
				x2: posX, y2: posY,
			});
		}


		ds.drawCrossHairs = function(event) {

			canvas.removeLayer('xCrosshair');
			canvas.removeLayer('yCrosshair');

			var posX = event.x;
			var posY = event.y;



			if(gridSnapping) {
				posX = ds._roundByRatio(posX);
				posY = ds._roundByRatio(posY);
			}


			
			canvas.drawLine({
				strokeStyle: 'red',
				strokeWidth: 1,
				layer: true,
				name: 'xCrosshair',
				x1: posX, y1:0,
				x2: posX, y2:500,
			});

			canvas.drawLine({
				strokeStyle: 'red',
				strokeWidth: 1,
				layer: true,
				name: 'yCrosshair',
				x1: 0, y1: posY,
				x2: 500, y2: posY,
			});

			canvas.moveLayer('xCrosshair', canvas.getLayers().length-4);
			canvas.moveLayer('yCrosshair', canvas.getLayers().length-3);
		}

		ds.clearImage = function() {
			canvas.css('background-image', 'none');
		}

		ds.clear = function() {

			canvas.removeLayerGroup('lines');
			canvas.removeLayerGroup('points');
			canvas.drawLayers();

		}

		ds._roundByRatio = function(coord) {

			return Math.round(coord / snapRatio) * snapRatio;
		}
	});